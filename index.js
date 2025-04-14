const express = require('express');
const app = express();
const dotenv = require('dotenv').config() ;
const cors = require('cors');


const {connectDb} = require('./utils/databaseConnect');
connectDb(); // Connect to the database


const PORT = process.env.PORT || 8080 ;
app.use(cors()) ;
app.use(express.json()) ;


const userRoutes = require('./routes/userRoutes') ;
app.use('/api/v1' , userRoutes) ;


app.get('/', (req, res) => {
    res.send("Welcome to the server") ;
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})






