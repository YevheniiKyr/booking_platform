const authService = require("../../services/AuthService");
const {connectMongo} = require("../integration/utils/shared");
const ApiError = require("../../exceptions/ApiError");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

let refreshToken = "ddwidwjdw233232d2w2323";
const user = {
    _id: "id",
    firstName: "fn",
    lastName: "ln",
    role: "client",
    email: "fn@fn.com",
    password: "password",
    secret: "secret",
    phone: "phone"
}

beforeAll(async () => {
    await connectMongo()
});

afterEach(() => {
    jest.resetAllMocks();
});


test('convert days to ms', () => {
    const sevenDaysInMs = 604800000
    expect(authService.daysToMs(7)).toBe(sevenDaysInMs);
});

test('userToDTO', () => {
    const result = authService.userToDTO(user);
    expect(result.lastName).toBeTruthy();
    expect(result.firstName).toBeTruthy();
    expect(result.role).toBeTruthy();
    expect(result.id).toBeTruthy();
    expect(result.email).toBeTruthy();

    expect(result.password).toBeUndefined();
    expect(result.secret).toBeUndefined();
    expect(result.phone).toBeUndefined();
});


test('UserDTOtoUser', () => {
    const userDTO = {
        firstName: "fn",
        lastName: "ln",
        role: "client",
        email: "fn@fn.com",
        password: "password",
    }

    const result = authService.userDTOToUser(userDTO);
    expect(result._id).toBeTruthy();
});


test('Token generation', () => {
    const userId = "swswswswwssw"
    const tokens = authService.generateTokens(userId)

    expect(Object.keys(tokens).length).toBe(2);
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
})

test('success registerUser', async () => {
    const res = await authService.registerUser(user)
    expect(res.accessToken).toBeTruthy();
    expect(res.refreshToken).toBeTruthy();
    expect(res.user).toBeTruthy();
    expect(res.user.pass).toBeUndefined();
})

test('failed registerSameUser', async () => {
    try {
        await authService.registerUser(user);
        fail('Expected ApiError to be thrown');
    } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(400);
    }
})

test('success login user', async () => {
    const res = await authService.loginUser(user.email, user.password);
    expect(res.accessToken).toBeTruthy();
    expect(res.refreshToken).toBeTruthy();
    expect(res.user).toBeTruthy();
    expect(res.user.pass).toBeUndefined();
})

test('failed login user', async () => {
    try {
        await authService.loginUser(user.email, 'bad' + user.password);
        fail('Expected ApiError to be thrown');
    } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(400);
    }
})

test('failed refreshToken', async () => {

    jest.spyOn(jwt, 'verify').mockImplementation(() =>{throw new Error('Invalid token')});
    try {
        await authService.refreshToken(refreshToken);
        fail('Expected ApiError to be thrown');
    } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(401);
    }
})

test('success refreshToken', async () => {
    const mockUser = {...user, refreshToken};
    jest.spyOn(jwt, 'verify').mockImplementation(() => mockUser);
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    mockUser.save = jest.fn(() => {});
    jest.spyOn(mockUser, 'save').mockImplementation(()=>{});

    const res = await authService.refreshToken(refreshToken);
    expect(res.accessToken).toBeTruthy();
    expect(res.refreshToken).toBeTruthy();
})



