const Roles = require("../../../consts/roles");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const provider = {
    firstName: "Petro",
    lastName: "Biba",
    email: "petro@gmail.com",
    password: "password",
    role: Roles.Provider
}

const client = {
    firstName: "Volodymyr",
    lastName: "Boba",
    email: "volodymyr@gmail.com",
    password: "password"
}

const connectMongo = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

const disconnectMongo = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}

const getRefreshToken = (response) => {
    const setCookieHeader = response.headers['set-cookie'];
    const refreshTokenCookie = setCookieHeader.find(cookie => cookie.startsWith('refreshToken='));
    const refreshToken = refreshTokenCookie?.split(';')[0].split('=')[1];
    return refreshToken;
}

module.exports =  {provider, client, connectMongo, disconnectMongo, getCookieValue: getRefreshToken};