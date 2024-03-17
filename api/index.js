import express from 'express';
import mysql from 'mysql2/promise'; // Import the promise-based version
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const connection = await mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Sreedhar@1116',
    database: 'task-tracker'
});

// Route for user signup
app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body)

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into the database
        const [result] = await connection.query(
            'INSERT INTO user (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );

        console.log('Data inserted into MySQL successfully:', result);
        res.json('Successfully registered');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for user signin
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database to retrieve user data
        const [result] = await connection.query(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );

        if (result.length > 0) {
            // User found, compare hashed password
            const user = result[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Authentication successful
                res.json({ message: 'Login successful', email: user.email });
                console.log('User logged in:', user);
            } else {
                // Invalid password
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } else {
            // User not found
            res.status(401).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
