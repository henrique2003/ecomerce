"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = exports.createSuccess = exports.success = exports.badRequest = exports.serverError = void 0;
function serverError(res, error) {
    return res.status(500).json({ error });
}
exports.serverError = serverError;
function badRequest(res, message) {
    return res.status(400).json({ message });
}
exports.badRequest = badRequest;
function success(res, data) {
    return res.status(200).json(data);
}
exports.success = success;
function createSuccess(res, data) {
    return res.status(201).json(data);
}
exports.createSuccess = createSuccess;
function unauthorized(res) {
    return res.status(401).json({ message: 'Não autorizado' });
}
exports.unauthorized = unauthorized;
