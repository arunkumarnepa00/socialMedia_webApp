require('dotenv').config();
const express=require('express');
const app=express();
const app2=express();
const morgan=require('morgan');
const mongoose=require('mongoose');
const cors=require('cors');
const bcrypt = require('bcrypt');
//const formidable = require('formidable');



app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());

//database connection
mongoose.connect(process.env.MONGODB_URL_LOCAL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.log("connected to database"))
.catch(err=>console.log(err))


// routes
const authRoutes=require('./Routes/auth');
app.use('/api/v1',authRoutes);
const userRoutes=require('./Routes/user');
app.use('/api/v1',userRoutes);
const postRoutes=require('./Routes/post');
app.use('/api/v1',postRoutes);
const messengerRoutes=require('./Routes/messenger');
app.use('/api/v1',messengerRoutes);

app.use("/",(req,res)=>{
    res.send("hi")
})

app.listen(process.env.PORT,(req,res)=>{
    console.log('server is running on port 5000');
})

app2.listen(50001,(req,res)=>{
    console.log('server is running on port 5001');
})
