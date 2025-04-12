const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    devicename: {
        type: String,
        required: true
    },
    deviceImg: {
        type: String,
        required: false
    }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device ;

