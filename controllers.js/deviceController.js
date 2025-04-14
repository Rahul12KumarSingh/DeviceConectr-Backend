



 const addDevice = async (req, res) => {
    const {deviceName , deviceType } = req.body ;
    const user = req.user ;

    try {
        if(!deviceName || !deviceType){
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields"
            });
        }

        //creating the device....
        const device = await Device.create({
            deviceName,
            deviceType,
            userId: user._id
        });

        //pushing the device to the user devices array....
        await User.findByIdAndUpdate(user._id , {
            $push: {
                devices: device._id
            }
        });

        res.status(200).json({
            success: true,
            message: "Device added successfully",
            device
        });       
    } catch (error) {

    }
};


const createTopicAndAddCloudFunction = async () => {
    try {
        const [topic] = await pubsub.createTOpic(topicName);
        const subscriptionName = `${topicName}-subscription`;
        const pushEndpoint = `https://iotdataprocessing-930066634417.us-central1.run.app`;


        //linking the topic to the cloud fucntion...
        const [subscription] = await topic.createSubscription(subscriptionName, {
            pushConfig: { pushEndpoint }
        });

    } catch (error) {

    }
};

const getControllerCode = async (req, res) => {
    //it will create the  topic corresponding to each device.....
    const { email} = req.body;

    try {
        //find the all the devices corresponding to that user...
        const data = await User.findAll({ email }).populate('devices');

        console.log("data : ", data);

        data.devices.map((deviceInfo) => {
            //create a topic for each device....

            const topicName = `abc${email}/${deviceInfo.deviceName}`;

            //creating the topic if not exists....
            createTopicAndAddCloudFunction(topicName);
        });


        const controllerCode = `
          #include<Wifi.h>
          #include<HTTPClient.h>
          #include<ArduinoJson.h>

          //wifi setup....
          const char* ssid = "" ;
          const char* wifi_password = "" ;

          //google cloud setup...
          const char* project_id = "rock-web-453711-d5";
          const subscriptionName = ${email}-subscription ;

          const char* token_url = ""

          // pub/sub base url....
          String pubsub_pull_base_url = "https://pubsub.googleapis.com/v1/projects/" + project_id + "/subscriptions/";

          String pubsub_publish_base_url = "https://pubsub.googleapis.com/v1/projects/" + project_id + "/topics/"; 

          //dynamic map the gpio pins to the device name....
          const int *deviceMap = {
            ${data.devices.map((deviceInfo) => {
            `
                if(deviceInfo.type == 1)        
                    return ${deviceInfo.deviceName}    
              `})
            }
           };

           void setup_wifi(){
                Serial.print("connecting to wifi....") ;
                WiFi.begin(ssid , wifi_password) ;

                while(WiFi.status() != WL_CONNECTED){
                    delay(1000);
                    Serial.print(".") ;
                }
           }

            void fetchMessages(){
                //cheking for token expiration...
                if(millis() > tokenExpiryTime){
                    getAccessToken() ;
                }

          
                for(int i = 0 ; i < topicList1.length ; i++){

                const subscriptionName = ${topicList1[i]}-ControllerSubscription ;

                HTTPClient http ;
               
                http.begin(pubsub_pull_base_url + subscriptionName + ":pull") ;

                http.addHeader("Authorization" , "Bearer " + accessToken) ;

                http.addHeader("Content-Type" , "application/json") ;

                String payload = "{\"maxMessages\": 1}" ;
                int httpResponseCode = http.POST(payload) ;
                
                if(httpResponseCode == 200){
                    String payload = http.getString() ;
                    Serial.println("Response : " , payload) ;

                    //intract with the GPIO pins here based on the messages....

                }else{
                    Serial.println("Error while fetching the message") ;
                }

                }
                
            }


            void publishMessages(){
                    if(millis() > tokenExpiryTime){
                       getAccessToken() ;
                    }

                    HTTPClient http ;
                    http.begin(pubsub_publish_base_url + topicName + ":publish") ;
                    http.addHeader("Authorization" , "Bearer " + accessToken) ;

                    http.addHeader("Content-Type" , "application/json") ;

                    String payload = "{\"messages\": [{\"data\""+ data + "\"}]}" ;

                    int httpResponseCode = http.POST(payload) ;

                    if(httpResponseCode == 200){
                        Serial.println("Message published successfully") ;
                    }else{
                        Serial.println("Error while publishing the message") ;
                    }
            }

           const topicList1 = [
            ${data.devices.map((deviceInfo) => {
                `
                if(deviceInfo.type == 1)        
                    return ${email}/${deviceInfo.deviceName}    
              `})
            }
           ];


          const topicList2 = [
            ${data.devices.map((deviceInfo) => {
                `
                if(deviceInfo.type == 2)        
                    return ${email}/${deviceInfo.deviceName}    
              `})
            }
           ];
                   
            void setup() {
                Serial.begin(115200);
                setup_wifi() ;
            }

            void loop(){
               const sensor1Info = random(0, 100) ;
               publishMessages(sensor1Info , topicList2[0]) ;

               const sensor2Info = random(0, 100) ;
               publishMessages(sensor2Info , topicList2[1]) ;

               const sensor3Info = random(0, 100) ;
               publishMessages(sensor3Info , topicList2[2]) ;

               const sensor4Info = random(0, 100) ;
               publishMessages(sensor4Info , topicList2[3]) ;

               fetchMessages() ;
            }
        `;

       res.status(200).json({
            message: "Controller code generated successfully",
            controllerCode: controllerCode
        });
       
    } catch (error) {
        res.json({
            message: "Error while generating the controller code..",
            error: error.message
        })
    }

};