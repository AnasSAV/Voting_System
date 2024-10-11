from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy # type: ignore
import os

app = Flask(__name__)

# Configuring the PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')  # Heroku sets this automatically
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(50), nullable=False)

# Create the database (only needed once)
@app.before_first_request
def create_tables():
    db.create_all()

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

if __name__ == '__main__':
    app.run(debug=True)
