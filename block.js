<<<<<<< HEAD
=======
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./cryptohash");

>>>>>>> ff578f1 (Section 2: individual block in Block class)
class Block {
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
<<<<<<< HEAD
}

const block1 = new Block({
    data: 'foo-data',
    lastHash: 'foo-lastHash',
    hash: 'foo-hash',
    timestamp: '01/01/01'
});

console.log('block1: ', block1);
=======

    static genesis() {
        // "this" refers to the Block class itself
        return new this(GENESIS_DATA);
    }
    
    static mineBlock({ lastBlock, data }) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        return new this({
            timestamp,
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        });
    }
}

module.exports = Block;
>>>>>>> ff578f1 (Section 2: individual block in Block class)
