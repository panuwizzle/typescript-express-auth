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
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../models/user");
const protectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(500).json({
            message: "No token",
            type: "error"
        });
    }
    const token = authorization.split(" ")[1];
    let id;
    try {
        id = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET || 'xxx');
        console.log(id);
    }
    catch (error) {
        return res.status(500).json({
            message: "Invalid token! 🤔",
            type: "error",
        });
    }
    if (!id) {
        return res.status(500).json({
            message: "Invalid token",
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
    req.user = user;
    next();
});
exports.protectedRoute = protectedRoute;
