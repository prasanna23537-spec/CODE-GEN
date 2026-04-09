This is a minimal test backend to exercise the Feedback feature.

Quick start:

1. Create a virtual environment and install dependencies:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

2. Initialize the DB:

```bash
python setup_db.py
```

3. Run the app:

```bash
python app.py
```

4. Visit `http://127.0.0.1:5000/login-test` to log in as a test user, then open `/feedback`.
