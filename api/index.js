import express from 'express';
import mysql2 from 'mysql2';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const app = express();
app.use(bodyParser.json());
app.use(cors);


const db = mysql2.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Sreedhar@1116',
    database: 'task-tracker'
});

db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
    } else {
        console.log('Connected to MySQL');
    }
});

// // Sign-up endpoint
// app.post('/signup', async (req, res) => {
//     const { username,email, password, role } = req.body;

//     // Hash the password 
//     const hashedPassword = await bcrypt.hash(password, 10);

//     //  user db
//     const insertUserQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';    
//     db.query(insertUserQuery, [email, hashedPassword, role], (error, results) => {
//         if (error) {
//             console.error('Error signing up:', error);
//             res.status(500).json({ message: 'Error signing up' });
//         } else {
//             res.status(201).json({ message: 'User signed up successfully' });
//         }
//     });
// });

app.post('')

// Sign-in endpoint
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    // get  user  db
    const getUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(getUserQuery, [email], async (error, results) => {
        if (error) {
            console.error('Error signing in:', error);
            res.status(500).json({ message: 'Error signing in' });
        } else if (results.length === 0) {
            res.status(401).json({ message: 'Invalid username or password' });
        } else {
        //pw compare
            const match = await bcrypt.compare(password, results[0].password);
            if (match) {
                res.json({ message: 'User signed in successfully' });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000!");
});
