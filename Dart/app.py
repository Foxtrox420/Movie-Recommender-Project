from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Function to initialize the database
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL)''')
    conn.commit()
    conn.close()

# Landing page
@app.route('/')
def landing():
    return render_template('index.html')

# Sign Up route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        try:
            c.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
            conn.commit()
        except sqlite3.IntegrityError:
            return 'Username already exists!'
        conn.close()
        
        return redirect(url_for('signin'))
    return render_template('signup.html')

# Sign In route
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[2], password):
            session['username'] = username
            return redirect(url_for('landing'))  # Redirect to index after login
        return 'Invalid credentials!'
    return render_template('signin.html')

@app.route('/recommend')
def recommend():
    return render_template('recommend.html')

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/moviesearch')
def moviesearch():
    return render_template('moviesearch.html')

@app.route('/moviedatabase')
def moviedatabase():
    return render_template('moviedatabase.html')

@app.route('/informatics.html')
def informatics():
    # Process any parameters if needed
    return render_template('informatics.html')

@app.route('/comment.html')
def comment():
    # Process any parameters if needed
    return render_template('comment.html')

# Logout route
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('landing'))  # Redirect to landing page after logout

if __name__ == '__main__':
    app.run(debug=True)

