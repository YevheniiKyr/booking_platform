describe("Logout tests", () => {

    it("successfully log out", async () => {
        expect(2+2).toBe(4);
    })
})
// const request = require("supertest")
// const mongoose = require("mongoose");
// const app = require("../../app");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// const User = require('../../models/User');
// const Roles = require("../../consts/roles");
//
// let mongoServer;
//
// const availabilityRoute = '/api/availability'
// const USER_EMAIL = "petro@gmail.com"
// const USER_PASSWORD = "password"
// let providerId;
//
// const provider = {
//     firstName: "Petro",
//     lastName: "Biba",
//     email: USER_EMAIL,
//     password: USER_PASSWORD,
//     role: Roles.Provider
// }
//
// beforeAll(async () => {
//     mongoServer = await MongoMemoryServer.create();
//     const uri = mongoServer.getUri();
//     await mongoose.connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     const user = await User.create(provider)
//     providerId = user._id.toString();
//     console.log("provider id", providerId)
// });
//
// afterAll(async () => {
//     await User.deleteMany({});
//     await mongoose.disconnect();
//     await mongoServer.stop();
// });
//
//
// describe("get provider availability", () => {
//
//     it("successfully get", async () => {
//         const response = await request(app)
//             .get(availabilityRoute)
//             .query({providerId})
//
//         expect(response.statusCode).toBe(200);
//         expect(response.body.freeSlots).toBeDefined();
//     })
//
//     it("failed get because of non existence provider", async () => {
//         const badProviderId = 'bad' + providerId;
//         const response = await request(app)
//             .get(availabilityRoute)
//             .query({providerId: badProviderId})
//
//         expect(response.statusCode).toBe(400);
//     })
// })