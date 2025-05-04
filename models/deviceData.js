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
      val : { 
        //it is only used for the type 0 and type 1 devices.....
        type : Number ,
        default : false
      }
}
, {
    timestamps: true
});

const DeviceData = mongoose.model('DeviceData' , deviceDataSchema) ;

module.exports = DeviceData ;
