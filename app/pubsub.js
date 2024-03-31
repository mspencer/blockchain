import { createClient } from 'redis';

const CHANNELS = {
    TEST: 'ch.TEST',
    BLOCKCHAIN: 'ch.BLOCKCHAIN',
    TRANSACTION: 'ch.TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool }) {
        return (async () => {
            this.blockchain = blockchain;
            this.transactionPool = transactionPool;

            const client = createClient();
            await client.connect();
            this.subscriber = client.duplicate();
            await this.subscriber.connect();

            this.publisher = createClient();
            await this.publisher.connect();

            await this.subscriber.pSubscribe('ch.*', (message, channel) => {
                console.log('inside subscribe()');
                this.handleMessage(channel, message);
            });
            return this;
        })();
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}.`);

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
        console.log('::::: publish(): '+channel+' : ');
        await this.subscriber.pUnsubscribe();
        await this.publisher.publish(channel, message);
        //await this.subscriber.subscribe(channel);
        await this.subscriber.pSubscribe('ch.*', (message, channel) => {
            console.log('inside subscribe() inside function publish()');
            this.handleMessage(channel, message);
        });
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