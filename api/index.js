import express from 'express';
import mysql2 from 'mysql2'


const app=express();
app.use(express.json());


const db= mysql2.createConnection({
    user:'root',
    host:'localhost',
    password:'Sreedhar@1116',
    database:'task-tracker'
})

db.connect((err)=>{
    if(err){
        console.error('Error connecting in mysql',err);
    }
    else{
        console.log("Connected to Mysql");
    }
})

app.listen (3000,()=>{
    console.log("server is running-3000!")
})
