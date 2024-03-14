import express from 'express';
import mysql2 from 'mysql2';
import  Jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors'

const app = express();
app.use(express.json());
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


app.post('/signup',async (req, res)=>{
    const {username,email,password}=req.body;

    const hashedPassword=await bcrypt.hash(password,10);

   db.query(
    'INSERT INTO user (username, password, email ,role) VALUES (?, ?, ? ,?)',
    [username, hashedPassword,email],
    (err,result)=>{
        if (err){
            if(err){
                console.error('error inserting into db',err);
                res.status(500).json({error:'internal srever error'});
            }
            else{
                console.log('Data inserted in db',result);
                res.json('successfully registered');
            }
        }
    }
   )
})



app.post('/signup', async (req,res)=>{
    res.json({
        message:'API is working'
    })
    const {email, password}=req.body;
    db.query(
        'SELECT * FROM user WHERE email =?,'[email],
        async(err,result)=>{
            if (err){
                console.error('erroe in query data in db',err);
                res.status(500).jason({error:'Internal server error'});
            }
            else {
                if(result.length>0){
                    const user =result[0];
                    const passwordmatch=await bcrypt.compare(password,user.passwword);
                    if(passwordmatch){
                        const token =Jwt.sign({id:user.id,email:user.email}, process.env.JWT_SECRET,{
                            expiresIn:'1h'
                        } );
                        res.json({message:'Login successhul',token,email:user.email});
                        console.log('Data retrieved form db',user);
                    }
                    else{
                        res.status(401).json({error:'Invalid username or password'});
                    }
                }
            }
        }
    )

})

app.listen(3000, () => {
    console.log("Server running on port 3000!");
});
