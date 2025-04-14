const mongoose = require('mongoose');


// firstName ,
// lastName ,
// email ,
// devices[(objctId)]
// Espcode (string)


const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: false ,
    },
    email : {
        type: String,
        required: true
    },
    mobileNumber : {
        type: String,
        required: true
    } ,
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    }],
    controllerCode: {
        type: String,
        required: false
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;


