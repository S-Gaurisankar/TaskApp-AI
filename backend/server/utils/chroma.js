// utils/chroma.js
const { ChromaClient } = require('chromadb');
const dotenv = require('dotenv');
dotenv.config();

const chroma = new ChromaClient({
    apiKey: process.env.CHROMA_API_KEY,
});

const createCollection = async (name) => {
    const collection = await chroma.createCollection(name);
    return collection;
};

module.exports = { chroma, createCollection };
