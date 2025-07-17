const request = require("supertest")
const app = require("../../app");
const {connectMongo, disconnectMongo, provider, service} = require("./utils/shared");
const Service = require("../../models/Service");

const serviceRoute = '/api/services';
const registerRoute = '/api/auth/register';
let accessToken;

beforeAll(async () => {
    await connectMongo();
    const response = await request(app)
        .post(registerRoute)
        .send(provider)
    accessToken = response.body.accessToken;
});

afterAll(async () => {
    await Service.deleteMany({});
    await disconnectMongo();
});

describe("Create new service", () => {

    it("successfully created", async () => {
        const response = await request(app)
            .post(serviceRoute)
            .send(service)
            .set('Authorization', `Bearer ${accessToken}`);


        expect(response.status).toBe(201);
    })

    it("failed to create because of non-authorized", async () => {
        const response = await request(app)
            .post(serviceRoute)
            .send(service)

        expect(response.status).toBe(401);
    })

    it("failed to create because of lack of fields in body", async () => {
        const {serviceData, description} = {...service}
        const response = await request(app)
            .post(serviceRoute)
            .send(serviceData)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
    })

    it("failed to create because of unvalid fields", async () => {
        let serviceData = {...service}
        serviceData.description = "";
        const response = await request(app)
            .post(serviceRoute)
            .send(serviceData)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
    })

})
