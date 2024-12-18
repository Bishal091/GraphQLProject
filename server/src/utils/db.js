
const mongoose = require('mongoose');
require('dotenv').config();


const URI = process.env.MONGODB_URI;


async function connect(){
    try {
        // console.log('asd',URI);
        
        await mongoose.connect(URI);
        // console.log('Database Connected');
        
    } catch (e) {
        // console.log('Error connecting to the database: ', e.message);
        
        
    }

    
}

module.exports =connect;

