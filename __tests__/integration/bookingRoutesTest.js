const request = require("supertest")
const app = require("../../app");
const {provider, service, client, connectMongo, disconnectMongo} = require("./utils/shared");
const Booking = require("../../models/Booking");
const User = require("../../models/User");
const Service = require("../../models/Service");
const BookingStatuses = require("../../consts/bookingStatuses");

const bookingRoute = '/api/bookings';
const registerRoute = '/api/auth/register';
const serviceRoute = '/api/services';

let clientAccessToken;
let providerAccessToken;
let booking = {}
let bookingId;
let bookingStatusConfirmed = {
    status: BookingStatuses.Confirmed
}
let bookingStatusInvalid = {
    status: "isNotAStatus"
}

const getValidDate = () => {
    let startTime = new Date()
    startTime.setDate(startTime.getDate() + 1);
    startTime.setHours(12, 0, 0, 0)
    return startTime;
}

const getInvalidDate = () => {
    let startTime = new Date()
    startTime.setDate(startTime.getDate() - 1);
    startTime.setHours(12, 0, 0, 0)
    return startTime;
}

beforeAll(async () => {
    await connectMongo();
    const clientResponse = await request(app)
        .post(registerRoute)
        .send(client)
    clientAccessToken = clientResponse.body.accessToken;

    const providerResponse = await request(app)
        .post(registerRoute)
        .send(provider)
    providerAccessToken = providerResponse.body.accessToken;

    const serviceResponse = await request(app)
        .post(serviceRoute)
        .send(service)
        .set("Authorization", `Bearer ${providerAccessToken}`)
    booking = {
        serviceId: serviceResponse.body.service._id,
        startTime: getValidDate(),
    }
});

afterAll(async () => {
    await Booking.deleteMany({});
    await User.deleteMany({});
    await Service.deleteMany({});
    await disconnectMongo();
});

describe("Create new booking", () => {
    it("successfully create a new booking", async () => {
        const response = await request(app)
            .post(bookingRoute)
            .send(booking)
            .set("Authorization", `Bearer ${clientAccessToken}`)
        bookingId = response.body.booking._id.toString();
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    })

    it("failed create a new booking because time is already occupied", async () => {
        const response = await request(app)
            .post(bookingRoute)
            .send(booking)
            .set("Authorization", `Bearer ${clientAccessToken}`)
        expect(response.status).toBe(400);
    })

    it("failed create a new booking because of unauthorized", async () => {
        const response = await request(app)
            .post(bookingRoute)
            .send(booking)
        expect(response.status).toBe(401);
    })

    it("failed create a new booking because of lack of fields", async () => {
        const {serviceId,...bookingData} = {...booking}
        const response = await request(app)
            .post(bookingRoute)
            .send(bookingData)
            .set("Authorization", `Bearer ${clientAccessToken}`)
        expect(response.status).toBe(400);
    })

    it("failed create a new booking because fields are invalid", async () => {
        let bookingData = {...booking}
        bookingData.startTime = getInvalidDate();
        const response = await request(app)
            .post(bookingRoute)
            .send(bookingData)
            .set("Authorization", `Bearer ${clientAccessToken}`)

        expect(response.status).toBe(400);
    })
})


describe("Update booking status", () => {

    it("successfully update a booking status", async () => {
        const response = await request(app)
            .put(`${bookingRoute}/${bookingId}/status` )
            .send(bookingStatusConfirmed)
            .set("Authorization", `Bearer ${providerAccessToken}`)

        expect(response.status).toBe(200);
        expect(response.body.booking.status).toBe(BookingStatuses.Confirmed);
    })

    it("failed update a booking status because bookingId is not valid" , async () => {
        const response = await request(app)
            .put(`${bookingRoute}/notABookingId/status`)
            .send(bookingStatusConfirmed)
            .set("Authorization", `Bearer ${providerAccessToken}`)

        expect(response.status).toBe(400);
    })

    it("failed update a booking status because booking is not found" , async () => {
        const newSymbol = bookingId.at(-1) === 'a' ? 'b' : 'a'
        const badBookingId = bookingId.slice(0, -1) + newSymbol;
        const response = await request(app)
            .put(`${bookingRoute}/${badBookingId}/status`)
            .send(bookingStatusConfirmed)
            .set("Authorization", `Bearer ${providerAccessToken}`)

        expect(response.status).toBe(404);
    })

    it("failed update a booking status because status is not valid" , async () => {
        const response = await request(app)
            .put(`${bookingRoute}/${bookingId}/status`)
            .send(bookingStatusInvalid)
            .set("Authorization", `Bearer ${providerAccessToken}`)

        expect(response.status).toBe(400);
    })

    it("failed update a booking status because only provider can change it" , async () => {
        const response = await request(app)
            .put(`${bookingRoute}/${bookingId}/status`)
            .send(bookingStatusInvalid)
            .set("Authorization", `Bearer ${clientAccessToken}`)

        expect(response.status).toBe(403);
    })
})