const request = require("supertest")
const app = require("../../app");
const User = require('../../models/User');
const {provider, connectMongo, disconnectMongo} = require("./utils/shared");

const availabilityRoute = '/api/availability'
let providerId;


beforeAll(async () => {
    await connectMongo()
    const user = await User.create(provider)
    providerId = user._id.toString();
});

afterAll(async () => {
    await User.deleteMany({});
    await disconnectMongo();
});


describe("get provider availability", () => {

    it("successfully get", async () => {
        const response = await request(app)
            .get(availabilityRoute)
            .query({providerId})

        expect(response.statusCode).toBe(200);
        expect(response.body.freeSlots).toBeDefined();
    })

    it("failed get because of non valid provider id", async () => {
        const badProviderId = 'bad' + providerId;
        const response = await request(app)
            .get(availabilityRoute)
            .query({providerId: badProviderId})

        expect(response.statusCode).toBe(400);
    })

    it("failed get because of non existence provider id", async () => {
        const newSymbol = providerId.at(-1) === 'a' ? 'b' : 'a'
        const badProviderId = providerId.slice(0, -1) + newSymbol;
        const response = await request(app)
            .get(availabilityRoute)
            .query({providerId: badProviderId})

        expect(response.statusCode).toBe(404);
    })
})