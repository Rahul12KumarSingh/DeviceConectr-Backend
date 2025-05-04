//deviceId will be the topicId......
const createTopicAndAddCloudFunction = async (topicName) => {
    try {
        const [topic] = await pubsub.createTopic(topicName);
        const subscriptionName = `${topicName}-subscription`;
        const pushEndpoint = `https://iotdataprocessing-930066634417.us-central1.run.app`;


        //linking the topic to the cloud fucntion....
        const [subscription] = await topic.createSubscription(subscriptionName, {
            pushConfig: { pushEndpoint }
        });

        return {
            topicName: topic.name,
            subscriptionName: subscription.name,
            pushEndpoint: pushEndpoint
        };
    } catch (error) {
        throw new Error(`Failed to create topic and subscription: ${error.message}`);
    }
};

module.exports = { createTopicAndAddCloudFunction };


