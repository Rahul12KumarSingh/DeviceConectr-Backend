const express = require('express');
const app = express();
const dotenv = require('dotenv').config() ;
const cors = require('cors');
const {connectDb} = require('./utils/databaseConnect');
const userRoutes = require('./routes/userRoutes') ;
const deviceRoutes = require('./routes/deviceRoutes') ;
const mqtt = require("mqtt") ;



const MQTT_BROKER_URL = 'wss://a2f276cdb18d48f284666da86175b258.s1.eu.hivemq.cloud:8884/mqtt';
const MQTT_USERNAME = 'DeviceConectr'
const MQTT_PASSWORD = 'Kasia@1234'


const client = mqtt.connect(MQTT_BROKER_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
  }) ;


client.on("connect" ,()=>{
    console.log("Connected to the MQTT broker") ;

    client.subscribe("bulb", (err) => {
        if (!err) {
          console.log("subscribed successfully");
        }
      });

      client.subscribe("xyz9878", (err) => {
        if (!err) {
          console.log("subscribed successfully");
        }
      });

    
})

client.on("message", (topic, message) => {
    // message is Buffer
    console.log(message.toString());
    // client.end();
  });


const { awsIotCoreConnect } = require('./utils/awsIoTCoreConnect');
// const { createCertAndPolicy } = require('./utils/resgisterDeviceOnAwsIot');



connectDb(); //Connect to the database
awsIotCoreConnect() ; //Connect to the AWS IoT Core

const PORT = process.env.PORT || 8080 ;
app.use(cors()) ;
app.use(express.json()) ;


  
// (async () => {
//     const res = await createCertAndPolicy('myUser123');
//     console.log(res);
// })();


app.use('/api/v1' , userRoutes) ;
app.use('/api/v1' , deviceRoutes) ;


app.get('/', (req, res) => {
    res.send("Welcome to the server") ;
})

app.listen(4000, ()=>{
    console.log(`Server is running on port ${PORT}`);
})






