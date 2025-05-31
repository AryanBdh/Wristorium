import webRouter from './router/web.js';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connection from './database/connection.js';
import UserTableSeeder from './database/seeder/UserTableSeeder.js';
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/',webRouter);
connection();
UserTableSeeder.run();    

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});