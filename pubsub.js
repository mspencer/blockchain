const { createClient } = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.publisher = createClient();
        this.subscriber = createClient();

        (async () => {
            await this.publisher.connect();
            await this.subscriber.connect();
        })();
        this.subscribeToChannels();
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

        if(channel === CHANNELS.BLOCKCHAIN) {
            const parsedMessage = JSON.parse(message);
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    async subscribeToChannels() {
        Object.values(CHANNELS).forEach(async (channel) => {
            await this.subscriber.subscribe(channel, (message, channel) => { 
                this.handleMessage(channel, message);
            });
        });
    }

    async publish({ channel, message }) {
        await this.subscriber.unsubscribe(channel);
        await this.publisher.publish(channel, message);
        await this.subscriber.subscribe(channel);      
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;