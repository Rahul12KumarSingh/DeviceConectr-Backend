const {PubSub} = require('@google-cloud/pubsub');

const projectId = 'rock-web-453711-d5';

const topicName = 'rishi-topic';
const subscriptionName = 'rishi-topic-mysub';

const pubsub = new PubSub({
    keyFilename: "./rock-web-453711-d5-208b469e8de1.json", 
  });


const createSubscription = async() => {
    try {
        await pubsub.topic(topicName).createSubscription(subscriptionName);
        console.log(`Subscription ${subscriptionName} created for topic ${topicName}`);
    } catch (error) {
        console.log("Error while creating the subscription", error.message);
    }
}

const listenForMessages = async ()=> {
       const subscription = pubsub.subscription(subscriptionName);

       subscription.on("message" , (message)=>{
             console.log("Received message : ", message.data.toString());
            message.ack() ;             
       })

      console.log("listening for messages on topic : ", topicName);
}

//subscribing the topic...
 createSubscription().then(()=>{
    listenForMessages() ;
 })

//listening for messages...

