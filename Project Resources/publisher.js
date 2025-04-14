const { PubSub } = require('@google-cloud/pubsub');

const projectId = 'rock-web-453711-d5';


const pubsub = new PubSub({
    keyFilename: "./rock-web-453711-d5-208b469e8de1.json",
});


const createTopicAndSubscription = async (topicName) => {
    try {
        //creating te new topic...
        const [topic] = await pubsub.createTopic(topicName);
        console.log(`Topic ${topicName} created.`);

        //linking the topic to the cloud fucntion...
        const subscriptionName = `${topicName}-subscription`;
        const pushEndpoint = `https://iotdataprocessing-930066634417.us-central1.run.app`;

        const [subscription] = await topic.createSubscription(subscriptionName, {
            pushConfig: { pushEndpoint }
        });

        console.log(`Subscription ${subscriptionName} created and linked to cloud function${topicName}`);
    } catch (error) {
        console.log("Error while creating the topic", error.message);
    }
}


const publishMessage = async (data, topicName) => {
    try {
        const topic = pubsub.topic(topicName);
        const messageBuffer = Buffer.from(JSON.stringify(data));


        const messageId = await topic.publishMessage({ data: messageBuffer })

        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.log("error : ", error.message);
    }
}


const myscript = async () => {
    const topicName = "rishi-topic";
    // await createTopicAndSubscription(topicName );

    const message = {
        temperature: -80,
        humidity: 0,
        fan: false ,
    }

    await publishMessage(message, topicName);
}


myscript();



/*

+----------------------+                                            +----------------------+     
|   frontend           |                https (req/res)             |   backend            |                          
|                      !     <--------------------------------->    |   services           |
+----------------------+                                            +----------------------+
                \                                                    /                                   \           
                 \                                                  /                                      \
                  \                                                /                                        \
                   \                                              /                                         \
                    \                                            /                                        \
                     \                                          /                                            \
                      \                                       /                                             \      
                       \                                    /
                        \                                 /
                         \                              /  
                          \                           /
                            +----------------------+         +-----------------------+           +----------------------+
                            | Pub/Sub Topic: xxx1  | ----->  | google cloud function | --------> | processing and storing|
                            | (e.g., xxx1/...)     |         |                       |           | Data (e.g., MongoDB)  |
                            +----------------------+         +-----------------------+           +----------------------+
                                |
                                v
                        +--------------------------------+
                        | mutiples  subscribed /publisher|
                        |       devices                  |
                        +--------------------------------+
          
/*







/*
               (xxx1/bulb)         

 publisherxa   (xxx1/fan)          subscriberxa

               (xx1/motor)        



               (xxx2/bulb)         

publisherxb    (xxx2/fan)          subscriberxb

               (xx2/motor)  
               
               (XXX2/tempSensor)


                
              

               (xxx3/humiditySensor)         

publisherxc    (xxx3/fan)              subscriberxc

               (xx3/motor)    
                


                
               (xxx4/bulb)         

publisherxd    (xxx4/solidMoister)          subscriberxd

               (xxx4/motor)        
                           


*/


