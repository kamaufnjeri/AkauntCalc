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
const mail_config_1 = __importDefault(require("../config/mail.config"));
dotenv_1.default.config();
const SENDER = process.env.APP_EMAIL || "";
const sendMail = (receiverEmail, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    if (!SENDER) {
        return { booleanValue: false, message: "Sender email required" };
    }
    const mailOptions = {
        from: SENDER,
        to: receiverEmail,
        subject: subject,
        text: text,
    };
    try {
        const response = yield mail_config_1.default.sendMail(mailOptions);
        console.log(response);
        return { booleanValue: true, message: "Check your email for link" };
    }
    catch (error) {
        console.log("Error sending mail", error);
        return { booleanValue: false, message: "Error sending mail" };
    }
});
exports.default = sendMail;
