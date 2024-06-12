"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthControllers_1 = __importDefault(require("../controllers/AuthControllers"));
const router = express_1.default.Router();
const controller = new AuthControllers_1.default();
router.post('/register', controller.register);
router.post('/login', controller.login);
exports.default = router;
