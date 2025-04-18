from flask import Flask, jsonify, request, render_template, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS with credentials
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')  # Add a secret key for session

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Vote model
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(50), nullable=False)

# Define the Admin model
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Admin login route
@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    admin = Admin.query.filter_by(username=username).first()
    if admin and admin.check_password(password):
        session['admin_logged_in'] = True
        return jsonify({"message": "Login successful", "success": True}), 200
    return jsonify({"error": "Invalid credentials"}), 401

# Admin logout route
@app.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_logged_in', None)
    return jsonify({"message": "Logged out successfully"}), 200

# Check admin status
@app.route('/admin/status', methods=['GET'])
def check_admin_status():
    return jsonify({"isAdmin": session.get('admin_logged_in', False)}), 200

# User registration route
@app.route('/user/register', methods=['POST'])
def user_register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# User login route
@app.route('/user/login', methods=['POST'])
def user_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['user_logged_in'] = True
        return jsonify({"message": "Login successful", "success": True}), 200

    return jsonify({"error": "Invalid credentials"}), 401

# User logout route
@app.route('/user/logout', methods=['POST'])
def user_logout():
    session.pop('user_logged_in', None)
    return jsonify({"message": "Logged out successfully"}), 200

# Route to handle voting
@app.route('/submit_vote', methods=['POST'])
def submit_vote():
    try:
        data = request.get_json()
        team_name = data.get('team')

        if not team_name:
            return jsonify({"error": "No team name provided"}), 400

        new_vote = Vote(team_name=team_name)
        db.session.add(new_vote)
        db.session.commit()

        return jsonify({
            "message": f"Vote recorded for {team_name}",
            "success": True
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Protected route to get voting results
@app.route('/results', methods=['GET'])
@admin_required
def get_results():
    try:
        votes = db.session.query(
            Vote.team_name,
            db.func.count(Vote.team_name).label('count')
        ).group_by(Vote.team_name).all()

        vote_results = {team: count for team, count in votes}
        
        return jsonify({
            "votes": vote_results,
            "total_votes": sum(vote_results.values())
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Initialize admin user if not exists
def init_admin():
    with app.app_context():
        db.create_all()
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            admin = Admin(username='admin')
            admin.set_password('admin123')  
            db.session.add(admin)
            db.session.commit()
            print("Admin user created")

if __name__ == '__main__':
    init_admin()
    app.run(debug=True, port=5050)

