const { createClient } = require('redis');

const CHANNELS = {
    TEST: 'ch.TEST',
    BLOCKCHAIN: 'ch.BLOCKCHAIN',
    TRANSACTION: 'ch.TRANSACTION'
};

console.log('1');
class PubSub {
    constructor({ blockchain, transactionPool }) {
        console.log('2');
        return (async () => {
            console.log('3');
            this.blockchain = blockchain;
            this.transactionPool = transactionPool;

            const client = createClient()
            this.publisher = createClient();
            this.subscriber = client.duplicate();

            await this.publisher.connect();
            await this.subscriber.connect();

            await this.subscriber.subscribe('ch.*', (message, channel) => {
                this.handleMessage(channel, message);
            });
            console.log('4');
            return this;
        })();
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

export default PubSub;