const mongoose = require('mongoose');


// firstName ,
// lastName ,
// email ,
// devices[(objctId)]
// Espcode (string)


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    }],
    CorrespondingCode: {
        type: String,
        required: true
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;


