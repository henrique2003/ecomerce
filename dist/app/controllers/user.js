"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../prisma"));
const response_status_1 = require("../helpers/response-status");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
class User {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!password.trim()) {
                return (0, response_status_1.badRequest)(res, 'Senha em branco');
            }
            if (!validator_1.default.isEmail(email)) {
                return (0, response_status_1.badRequest)(res, 'Email inválido');
            }
            if (await prisma_1.default.user.findUnique({ where: { email } })) {
                return (0, response_status_1.badRequest)(res, 'Email já esta em uso');
            }
            const encriptedPassword = await bcrypt_1.default.hash(password, 10);
            const newUser = await prisma_1.default.user.create({
                data: {
                    email,
                    password: encriptedPassword
                }
            });
            delete newUser.password;
            // Generate token
            const token = (0, generateToken_1.default)(newUser.id);
            return (0, response_status_1.createSuccess)(res, { newUser, token });
        }
        catch (error) {
            return (0, response_status_1.serverError)(res, error);
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validations
            if (!password.trim()) {
                return (0, response_status_1.badRequest)(res, 'Senha em branco');
            }
            if (!validator_1.default.isEmail(email)) {
                return (0, response_status_1.badRequest)(res, 'Email inválido');
            }
            // Login
            const user = await prisma_1.default.user.findUnique({ where: { email } });
            if (!user) {
                return (0, response_status_1.badRequest)(res, 'Usuário não encontrado');
            }
            if (!await bcrypt_1.default.compare(password, user.password)) {
                return (0, response_status_1.badRequest)(res, 'Senha invalida');
            }
            delete user.password;
            // Generate token
            const token = (0, generateToken_1.default)(user.id);
            return (0, response_status_1.success)(res, { user, token });
        }
        catch (error) {
            return (0, response_status_1.serverError)(res, error);
        }
    }
    async addProductOnCart(req, res) {
        try {
            const { userId, body } = req;
            let { productId } = body;
            productId = productId.toString();
            // Verify if exist product
            const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
            if (!product) {
                return (0, response_status_1.badRequest)(res, 'Produto inválido');
            }
            // Update cart from user
            const transaction = await prisma_1.default.transaction.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    userId,
                    productId
                },
                include: {
                    products: true
                }
            });
            return (0, response_status_1.success)(res, transaction);
        }
        catch (error) {
            return (0, response_status_1.serverError)(res, error);
        }
    }
    async removeProductOnCart(req, res) {
        try {
            const { transactionId } = req.body;
            // Verify if exist product
            if (!await prisma_1.default.transaction.findUnique({ where: { id: transactionId } })) {
                return (0, response_status_1.badRequest)(res, 'Transação inválida');
            }
            await prisma_1.default.transaction.delete({
                where: { id: transactionId }
            });
            return res.status(202).json({ message: 'Produto removido' });
        }
        catch (error) {
            return (0, response_status_1.serverError)(res, error);
        }
    }
    async loadUser(req, res) {
        try {
            const user = await prisma_1.default.user.findUnique({
                where: {
                    id: req.userId
                },
                include: {
                    Transaction: {
                        include: {
                            products: true
                        }
                    }
                }
            });
            delete user.password;
            return (0, response_status_1.success)(res, user);
        }
        catch (error) {
            return (0, response_status_1.serverError)(res, error);
        }
    }
}
exports.default = User;
