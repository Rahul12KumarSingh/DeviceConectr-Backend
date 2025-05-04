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
    dataPoints : [{
        type : Number 
    }] ,
    status :{
        type : Number ,
        default : 0
    }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device ;

