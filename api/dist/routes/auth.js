"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../models/user");
const token_1 = require("../utils/token");
const protected_1 = require("../utils/protected");
exports.authRouter = (0, express_1.default)();
exports.authRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.User.findOne({ email: email });
        console.log(user);
        if (user) {
            return res.status(500).json({
                message: "User already exists! Try logging in.",
                type: "warning"
            });
        }
        const salt = yield (0, bcryptjs_1.genSalt)(10);
        const passwordHash = yield (0, bcryptjs_1.hash)(password, salt);
        const newUser = new user_1.User({
            email: email,
            password: passwordHash
        });
        console.log(newUser);
        yield newUser.save();
        res.status(200).json({
            message: "User created successfully",
            type: 'success'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            type: "error",
            message: "Error creating user",
            error,
        });
    }
}));
exports.authRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.User.findOne({ email: email });
        if (!user) {
            return res.status(500).json({
                message: "User doesn't exist",
                type: "error"
            });
        }
        const isMatch = (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch) {
            return res.status(500).json({
                message: "Password is incorrect",
                type: "error"
            });
        }
        const accessToken = (0, token_1.createAccessToken)(user._id.toString());
        const refreshToken = (0, token_1.createRefreshToken)(user._id.toString());
        user.refreshToken = refreshToken;
        yield user.save();
        (0, token_1.sendRefreshToken)(res, refreshToken);
        (0, token_1.sendAccessToken)(req, res, accessToken);
    }
    catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error signing in!",
            error,
        });
    }
}));
exports.authRouter.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    return res.json({
        message: "Logged out successfully",
        type: "success"
    });
});
exports.authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(500).json({
                message: "No refresh token!",
                type: "error"
            });
        }
        let id;
        try {
            id = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET || "very-secret-token");
            console.log(id);
        }
        catch (error) {
            return res.status(500).json({
                message: "Invalid refresh token",
                type: "error"
            });
        }
        if (!id) {
            return res.status(500).json({
                message: "Invalid refresh token",
                type: "error"
            });
        }
        const user = yield user_1.User.findById(id);
        if (!user) {
            return res.status(500).json({
                message: "User doesn't exist",
                type: "error"
            });
        }
        console.log(user);
        if (user.refreshToken !== refreshToken) {
            return res.status(500).json({
                message: "Invalid refresh token",
                type: "error"
            });
        }
        const accessToken = (0, token_1.createAccessToken)(user._id.toString());
        user.refreshToken = (0, token_1.createRefreshToken)(user._id.toString());
        (0, token_1.sendRefreshToken)(res, refreshToken);
        return res.json({
            message: "Refreshed successfully",
            type: "success",
            accessToken
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Error refreshing token",
            type: "error",
            error
        });
    }
}));
exports.authRouter.get('/protected', protected_1.protectedRoute, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            return res.json({
                message: "You are logged in",
                type: "success",
                user: req.user
            });
        }
        return res.status(500).json({
            message: "Not login",
            type: "error"
        });
    }
    catch (error) {
        res.status(500).json({
            type: "error",
            message: "Error getting protected route",
            error
        });
    }
}));
