import express from 'express';
import mysql from 'mysql2/promise'; 
import bcrypt from 'bcrypt';


const app = express();
app.use(express.json());

const connection = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Sreedhar@1116',
    database: 'task-tracker'
});

connection.connect((err)=>{
    if(err){
        console.error('db is not connected ')
    }
    else{
        console.log('db is connected')
    }
})

 


// app.post('/signup', async (req, res) => {
//     const { username, email, password } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         // Save the hashed password to the database
//         await db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
//         res.json({ message: 'User signed up successfully' });
//     } catch (error) {
//         console.error('Error while hashing password:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// app.post('/signin', async (req, res) => {
//     const { email, password } = req.body;

//     db.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
//         if (err) {
//             console.error('Error querying data from MySQL:', err);
//             res.status(500).json({ error: 'Internal server error' });
//         } else {
//             if (result.length > 0) {
//                 const user = result[0];
//                 const passwordMatch = await bcrypt.compare(password, user.password);

//                 if (passwordMatch) {
//                     res.json({ message: 'User signed in successfully' });
//                 } else {
//                     res.status(401).json({ error: 'Invalid email or password' });
//                 }
//             } else {
//                 res.status(404).json({ error: 'User not found' });
//             }
//         }
//     });
// });


app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user data into the database
      connection.query(
        'INSERT INTO user (username, password, email ) VALUES (?, ?, ? )',
        [username, hashedPassword, email],
        (err, result) => {
          if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            console.log('Data inserted into MySQL successfully:', result);
            res.json('Successfully registered');
          }
        }
      );
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  //? login
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
      // ?Query the database to retrieve user data
      connection.query(
        'SELECT * FROM user WHERE email = ?', [email,role],
        async (err, result) => {
          if (err) {
            console.error('Error querying data from MySQL:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            if (result.length > 0) {
              // ?User found, compare hashed password
              const user = result[0];
              const passwordMatch = await bcrypt.compare(password, user.password);
              if (passwordMatch) {
                // ?Generate JWT token
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
                  expiresIn: '1h'
                });
                res.json({ message: 'Login successful', token, email: user.email });
                console.log('Data retrieved from MySQL successfully:', user);
              } else {
                res.status(401).json({ error: 'Invalid username or password' });
              }
            } else {
              res.status(401).json({ error: 'Invalid username or password' });
            }
          }
        }
      );
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.listen(3000, () => {
    console.log("server is running-3000!")
});
