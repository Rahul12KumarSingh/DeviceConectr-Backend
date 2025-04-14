const mongoose = require('mongoose');

// deviceInfo :{
//     deviceId ,
//     data 
// }


const deviceDataSchema = new mongoose.Schema({
    deviceId: {
              type : mongoose.Schema.Types.ObjectId ,
              ref : 'Device'
       } ,
      data: [
        {
            type: String,
            required: true
        }
      ] ,
      status : {
        type : Boolean ,
        default : false
      }
}
, {
    timestamps: true
});

const DeviceData = mongoose.model('DeviceData' , deviceDataSchema) ;

module.exports = DeviceData ;
