const mongoose = require('mongoose');

// deviceInfo :{
//     deviceId ,
//     data 
// }


const deviceDataSchema = new mongoose.Schema({
       
    deviceId :{
              type : mongoose.Schema.Types.ObjectId ,
              ref : 'Device'
       } ,

      data: {
            type : Object ,
            required : true
         }
});

const DeviceData = mongoose.model('DeviceData' , deviceDataSchema) ;

module.exports = DeviceData ;
