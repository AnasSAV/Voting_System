from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Configuring the PostgreSQL database
db_url = os.environ.get('DATABASE_URL')
if db_url and db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_url  # Heroku sets this automatically
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Vote model
class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(50), nullable=False)

# Route to handle voting
@app.route('/submit_vote', methods=['POST'])
def submit_vote():
    team_name = request.json.get('team')
    new_vote = Vote(team_name=team_name)
    db.session.add(new_vote)
    db.session.commit()
    return jsonify({"message": f"Vote recorded for {team_name}"}), 200

# Route to get voting results
@app.route('/results', methods=['GET'])
def get_results():
    votes = db.session.query(Vote.team_name, db.func.count(Vote.team_name)).group_by(Vote.team_name).all()
    vote_results = {team: count for team, count in votes}
    return jsonify(vote_results), 200

# Ensure the database tables are created within the app context
@app.before_first_request
def create_tables():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
