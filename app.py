from flask import Flask, jsonify, request, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Vote model
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(50), nullable=False)

print("Database URL:", os.getenv('DATABASE_URL'))

# Route to handle the root URL
@app.route('/')
def index():
    return render_template('vote1.html')  # Default to vote1.html or change as needed

# Route to handle voting pages
@app.route('/vote/<int:vote_page>')
def vote_page(vote_page):
    if vote_page == 1:
        return render_template('vote1.html')
    else:
        return "Page not found", 404

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

# Route to get voting results
@app.route('/results', methods=['GET'])
def get_results():
    try:
        # Query to get vote counts for each team
        votes = db.session.query(
            Vote.team_name,
            db.func.count(Vote.team_name).label('count')
        ).group_by(Vote.team_name).all()

        # Convert to dictionary format
        vote_results = {team: count for team, count in votes}
        
        return jsonify({
            "votes": vote_results,
            "total_votes": sum(vote_results.values())
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ensure the database tables are created
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5050)

