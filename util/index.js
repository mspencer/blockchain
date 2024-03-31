import EC from 'elliptic';
import cryptoHash from './cryptohash.js';

const ECec = EC.ec;

const ec = new ECec('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    
    return keyFromPublic.verify(cryptoHash(data), signature);
};

export { ec, verifySignature, cryptoHash };