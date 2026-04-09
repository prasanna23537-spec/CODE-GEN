from flask import Flask, render_template, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
import os

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET', 'dev-secret')
    app.config['DATABASE'] = os.path.join(os.path.dirname(__file__), 'app.db')

    # setup login
    login_manager = LoginManager()
    login_manager.login_view = 'login_test'
    login_manager.init_app(app)

    # Simple in-memory test user
    class User(UserMixin):
        def __init__(self, id, name, email, is_admin=False):
            self.id = id
            self.name = name
            self.email = email
            self.is_admin = is_admin

        def get_id(self):
            return str(self.id)

    TEST_USER = User('1', 'Test User', 'testuser@example.com', is_admin=True)

    @login_manager.user_loader
    def load_user(user_id):
        if str(user_id) == TEST_USER.get_id():
            return TEST_USER
        return None

    # register feedback blueprint
    from feedback import bp as feedback_bp
    app.register_blueprint(feedback_bp)

    @app.route('/')
    def index():
        return redirect(url_for('feedback.feedback_page'))

    @app.route('/login-test')
    def login_test():
        login_user(TEST_USER)
        return f'Logged in as {TEST_USER.name} ({TEST_USER.email}). <a href="/feedback">Go to Feedback</a>'

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return 'Logged out.'

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
