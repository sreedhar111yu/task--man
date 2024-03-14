import express from 'express';
import mysql2 from 'mysql2';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const db = mysql2.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Sreedhar@1116',
    database: 'task-tracker'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting in mysql', err);
    } else {
        console.log("Connected to Mysql");
    }
});

app.post('/signup',async(req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save the hashed password to the database
        db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.json({ message: 'User signed up successfully' });
    } catch (error) {
        console.error('Error while hashing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





app.post('/signin',async (req,res)=>{
    const {email,password,} =res.body;
    
        db.query(
            'SELECT * FROM user WHERE email =?',[email],
            async(err,result)=>{
                if(err){
                    console.error('Error querying data from Msql:',err);
                    res.status(500).json({error:'Internal server error'});
                }
                else{
                    if(result.length >0){
                        const user =result[0];
                        const passwordMatch =await bcrypt.compare(password,user.password);
                    }
                }
            }
        )
    

})



app.listen(3000, () => {
    console.log("server is running-3000!")
});
