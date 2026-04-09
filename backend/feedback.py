from flask import Blueprint, request, jsonify, render_template, current_app, g
from flask_login import current_user
import sqlite3
import datetime

bp = Blueprint('feedback', __name__, template_folder='templates', static_folder='static')


def get_db():
    db = getattr(g, '_db', None)
    if db is None:
        db_path = current_app.config.get('DATABASE', 'app.db')
        db = g._db = sqlite3.connect(db_path, detect_types=sqlite3.PARSE_DECLTYPES)
        db.row_factory = sqlite3.Row
    return db


@bp.teardown_app_request
def close_db(exc):
    db = getattr(g, '_db', None)
    if db is not None:
        db.close()


@bp.route('/feedback', methods=['GET'])
def feedback_page():
    prefill = {}
    if getattr(current_user, 'is_authenticated', False):
        prefill['name'] = getattr(current_user, 'name', '') or getattr(current_user, 'id', '')
        prefill['email'] = getattr(current_user, 'email', '')
    return render_template('feedback.html', prefill=prefill)


@bp.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    if request.is_json:
        payload = request.get_json()
    else:
        payload = request.form

    name = (payload.get('name') or '').strip()
    email = (payload.get('email') or '').strip()
    rating = payload.get('rating')
    tag = (payload.get('tag') or '').strip()
    message = (payload.get('message') or '').strip()
    user_id = None
    if getattr(current_user, 'is_authenticated', False):
        try:
            user_id = current_user.get_id()
        except Exception:
            user_id = None

    errors = {}
    if not name:
        errors['name'] = 'Name is required.'
    if not email:
        errors['email'] = 'Email is required.'
    try:
        rating = int(rating)
        if rating < 1 or rating > 5:
            errors['rating'] = 'Rating must be between 1 and 5.'
    except Exception:
        errors['rating'] = 'Rating must be an integer between 1 and 5.'
    if not tag:
        errors['tag'] = 'Tag is required.'
    if not message:
        errors['message'] = 'Message is required.'

    if errors:
        return jsonify(success=False, errors=errors), 400

    db = get_db()
    sql = '''INSERT INTO feedback (user_id, name, email, rating, tag, message, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)'''
    now = datetime.datetime.utcnow().isoformat(sep=' ')
    try:
        db.execute(sql, (user_id, name, email, rating, tag, message, now))
        db.commit()
    except Exception as e:
        current_app.logger.exception('Failed to save feedback')
        return jsonify(success=False, message='Database error'), 500

    return jsonify(success=True, message='Feedback submitted successfully'), 200


@bp.route('/my-feedback', methods=['GET'])
def my_feedback():
    if not getattr(current_user, 'is_authenticated', False):
        return jsonify(success=False, message='Authentication required'), 401
    user_id = current_user.get_id()
    if not user_id:
        return jsonify(success=False, message='No user id'), 400
    db = get_db()
    rows = db.execute(
        'SELECT id, user_id, name, email, rating, message, created_at FROM feedback WHERE user_id = ? ORDER BY created_at DESC',
        (user_id,)
    ).fetchall()
    items = [dict(r) for r in rows]
    return jsonify(success=True, feedback=items), 200


@bp.route('/api/feedback-stats', methods=['GET'])
def feedback_stats():
    """Return aggregated counts for ratings and tags."""
    db = get_db()
    # ratings 1..5
    rows = db.execute('SELECT rating, COUNT(*) as cnt FROM feedback GROUP BY rating').fetchall()
    rating_counts: dict = {str(i): 0 for i in range(1, 6)}
    for r in rows:
        rating_counts[str(r['rating'])] = r['cnt']

    # tags
    tag_rows = db.execute('SELECT tag, COUNT(*) as cnt FROM feedback GROUP BY tag').fetchall()
    tag_counts = {r['tag']: r['cnt'] for r in tag_rows}

    return jsonify(success=True, ratings=rating_counts, tags=tag_counts), 200


@bp.route('/api/recent-feedback', methods=['GET'])
def recent_feedback():
    # Admin-only: return recent feedback entries (limit 20)
    if not getattr(current_user, 'is_authenticated', False) or not getattr(current_user, 'is_admin', False):
        return jsonify(success=False, message='Admin required'), 403
    db = get_db()
    rows = db.execute('SELECT id, user_id, name, email, rating, tag, message, created_at FROM feedback ORDER BY created_at DESC LIMIT 20').fetchall()
    items = [dict(r) for r in rows]
    return jsonify(success=True, feedback=items), 200
