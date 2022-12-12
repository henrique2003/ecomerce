"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET_ID, { expiresIn: '1d' });
}
exports.default = generateToken;
