const { createClient } = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

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

        const parsedMessage = JSON.parse(message);

        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    });
                });
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
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

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;