// This is how you create the client
const { createClient } = require('redis');
const client = createClient();
const publisher = createClient();
const CHANNELS = {channelone:'channelone', channeltwo:'channeltwo'};

(async () => {
    // This is the subscriber part
    //const subscriber = client.duplicate();
    const subscriber = createClient();
    await subscriber.connect();
    Object.values(CHANNELS).forEach(async (channel) => {
        await subscriber.subscribe(channel, (message, channel) => {
            console.log('> message: ',message);
            console.log('> channel: ', channel);
        });
    });
    subscriber.on('message', (channel, message) => {
        console.log(`hey listener for message. channel: ${channel}. message: ${message}.`);
    });
    

    //await subscriber.subscribe('channel', (message) => {
    //    console.log(message); // 'message'
    //});

    // This is an example of how to publish a message to the same channel
    await publisher.connect();
    await publisher.publish('channelone', 'messageone');
    await publisher.publish('channeltwo','twotwo');
})();