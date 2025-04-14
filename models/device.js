const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device ;

