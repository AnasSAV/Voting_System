from flask import Flask, jsonify, request, render_template
import csv

app = Flask(__name__, static_url_path='/static')

# Route to render the voting page
@app.route('/')
def index():
    return render_template('vote.html')

# Route to handle voting
@app.route('/submit_vote', methods=['POST'])
def submit_vote():
    team_name = request.json.get('team')  # Get the team name from the request body
    with open('votes.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([team_name])
    return jsonify({"message": f"Vote recorded for {team_name}"}), 200

# Route to get voting results
@app.route('/results', methods=['GET'])
def get_results():
    votes = {}
    try:
        with open('votes.csv', 'r') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row:  # Check if the row is not empty
                    team = row[0]
                    votes[team] = votes.get(team, 0) + 1
    except FileNotFoundError:
        # Handle case where votes.csv doesn't exist yet
        return jsonify({"error": "No votes have been recorded yet."}), 404
    
    return jsonify(votes), 200


if __name__ == '__main__':
    app.run(debug=True)
