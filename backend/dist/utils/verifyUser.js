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
const dotenv_1 = __importDefault(require("dotenv"));
const sendMail_1 = __importDefault(require("./sendMail"));
const jwToken_1 = __importDefault(require("../middlewares/jwToken"));
dotenv_1.default.config();
const verifyUser = (receiverEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwToken_1.default.generateToken({ email: receiverEmail });
    console.log(token);
    const verificationLink = `${process.env.FRONTEND_URL}/api/v1/user/${token}`;
    const subject = "Verify Your Email Address";
    const body = `
    Dear User,

    Thank you for registering with our service. To complete your registration, we need to verify your email address.
    
    Please click the link below to verify your email address:
    
    ${verificationLink}
    
    This link will expire in 8 hours.
    
    If you did not request this verification, please ignore this email.
    
    Thank you,
    AkauntCalc   
    `;
    const result = yield (0, sendMail_1.default)(receiverEmail, subject, body);
    if (result) {
        return result;
    }
});
exports.default = verifyUser;
