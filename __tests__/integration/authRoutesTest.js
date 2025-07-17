
const request = require("supertest")
const app = require("../../app");
const User = require('../../models/User');
const {client, getRefreshToken, connectMongo, disconnectMongo} = require("./utils/shared");
const registerRoute = '/api/auth/register';
const loginRoute = '/api/auth/login';
const refreshRoute = '/api/auth/refresh';
const logoutRoute = '/api/auth/logout';

let refreshToken;
let accessToken;

const loginUser = {
    email: client.email,
    password: client.password,
}

beforeAll(async () => {
    await connectMongo()
});

afterAll(async () => {
    await User.deleteMany({});
})

afterAll(async () => {
    await disconnectMongo()
});


describe("Register user tests", () => {

    it("should successfully register user", async () => {
        const response = await request(app)
            .post(registerRoute)
            .send(client)
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true)
    });


    describe("Failed register user", () => {

        describe("Not all fields presented", () => {
            it("should not register user, because email is not presented", async () => {
                const {email, ...testUser} = client
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });

            it("should not register user, because firstName is not presented", async () => {
                const {firstName, ...testUser} = client
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });

            it("should not register user, because lastName is not presented", async () => {
                const {lastName, ...testUser} = client
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });

            it("should not register user, because password is not presented", async () => {
                const {password, ...testUser} = client
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });
        })


        describe("Not valid fields", () => {
            it("should not register user, because password length is less than 6 symbols ", async () => {
                const testUser = {...client};
                testUser.password = "short"
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });

            it("should not register user, because email is not valid", async () => {
                const testUser = {...client};
                testUser.email = "not-email"
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });

            it("should not register user, because firstName length is less than 2 symbols", async () => {
                const testUser = {...client};
                testUser.firstName = "f"
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });

            it("should not register user, because lastName length is less than 2 symbols", async () => {
                const testUser = {...client};
                testUser.lastName = "l"
                const response = await request(app)
                    .post(registerRoute)
                    .send(testUser)

                expect(response.statusCode).toBe(400);
            });
        })


    })
})


describe("Login user tests", () => {

    it("successfully logged in", async () => {
        const response = await request(app)
            .post(loginRoute)
            .send(loginUser)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true)
        accessToken = response.body.accessToken
        expect(accessToken).toBeTruthy();
        refreshToken =  getRefreshToken(response)
        expect(refreshToken).toBeTruthy();
    })

    it("failed log in because of invalid credentials", async () => {
        let loginData = {...loginUser}
        loginData.email = "notcorrectemail@gmail.com"
        const response = await request(app)
            .post(loginRoute)
            .send(loginData)

        expect(response.statusCode).toBe(400);
    })

    it("failed log in because of validation errors", async () => {
        let loginData = {...loginUser}
        loginData.email = "not_an_email"
        const response = await request(app)
            .post(loginRoute)
            .send(loginData)

        expect(response.statusCode).toBe(400);

    })
})


describe("Refresh tests", () => {

    it("successfully refreshed", async () => {
        const response = await request(app)
            .post(refreshRoute)
            .set('Cookie', `refreshToken=${refreshToken}`)
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true)
        expect(response.body.accessToken).toBeTruthy();
    })

    it("failed refresh because of invalid refresh token", async () => {
        const badRefreshToken = 'bad' + refreshToken
        const response = await request(app)
            .post(refreshRoute)
            .set('Cookie', `refreshToken=${badRefreshToken}`)

        expect(response.statusCode).toBe(401);
    })

})


describe("Logout tests", () => {

    it("successfully log out", async () => {
        const response = await request(app)
            .post(logoutRoute)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true)
    })

    it("failed log out because of invalid access token", async () => {
        const badAccessToken = 'bad' + accessToken
        const response = await request(app)
            .post(logoutRoute)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .set('Authorization', `Bearer ${badAccessToken}`);

        expect(response.statusCode).toBe(401);
    })

})


