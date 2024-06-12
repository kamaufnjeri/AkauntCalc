"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserControllers_1 = __importDefault(require("../controllers/UserControllers"));
const router = express_1.default.Router();
const controller = new UserControllers_1.default();
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/', controller.getUser);
router.put('/', controller.updateUser);
router.delete('/', controller.deleteUser);
router.get('/:companyId', controller.selectCompany);
router.put('/:token', controller.verifyUserEmail);
router.post('/forgotpassword', controller.forgotPassWord);
router.put('/resetpassword/:token', controller.resetPassword);
exports.default = router;
