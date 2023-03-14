"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.sendAccessToken = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// signing the access token
const createAccessToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.ACCESS_TOKEN_SECRET || 'very-secret-token', {
        expiresIn: 15 * 60
    });
};
exports.createAccessToken = createAccessToken;
// signing the refresh token
const createRefreshToken = (id) => {
    return (0, jsonwebtoken_1.sign)({ id }, process.env.REFRESH_TOKEN_SECRET || 'very-secret-token', {
        expiresIn: "90d"
    });
};
exports.createRefreshToken = createRefreshToken;
// sending the access token to the client
const sendAccessToken = (req, res, accessToken) => {
    res.json({
        accessToken, message: "Sign in successful", type: 'success'
    });
};
exports.sendAccessToken = sendAccessToken;
// sending the refresh token to the client as a cookie
const sendRefreshToken = (res, refreshToken) => {
    res.cookie('refreshtoken', refreshToken, {
        httpOnly: true
    });
};
exports.sendRefreshToken = sendRefreshToken;
