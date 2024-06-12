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
const user_1 = __importDefault(require("../models/user"));
const company_1 = __importDefault(require("../models/company"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwToken_1 = __importDefault(require("../middlewares/jwToken"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const verifyUser_1 = __importDefault(require("../utils/verifyUser"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
dotenv_1.default.config();
const NODEENV = process.env.NODE_ENV || 'development';
class UserControllers {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({ messgae: "Email and password fields required" });
                }
                const userExist = yield user_1.default.findByEmail(email);
                if (userExist) {
                    return res
                        .status(400)
                        .json({ message: `User ${email} already exists` });
                }
                const newUser = yield user_1.default.create({ email, password });
                if (NODEENV === 'production') {
                    const result = yield (0, verifyUser_1.default)(email);
                    if (result) {
                        if (!result.booleanValue)
                            return res.status(400).json({ message: result.message });
                    }
                    return res.status(201).json({ message: result.message });
                }
                res
                    .status(201)
                    .json({ user: newUser, message: "User created successfully" });
            }
            catch (error) {
                console.log("Error when registering", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("local", { session: false }, (error, user, info) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (error || !user) {
                        return res.status(401).json({ message: info.message });
                    }
                    if (!user.isVerified) {
                        if (NODEENV === 'production') {
                            const result = yield (0, verifyUser_1.default)(user.email);
                            if (result) {
                                if (!result.booleanValue)
                                    return res.status(400).json({ message: result.message });
                            }
                            return res.status(201).json({ message: result.message });
                        }
                    }
                    const payload = { userId: user.id };
                    const token = yield jwToken_1.default.generateToken(payload);
                    res.status(200).json({ token, message: info.message });
                }
                catch (error) {
                    console.log("Error logging in", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("jwt", { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { firstName, lastName, phoneNumber } = req.body;
                    if (phoneNumber || !firstName || !lastName) {
                        return res.status(400).json({ message: 'First name, lastname and phone number skills required' });
                    }
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    const userwithPhone = yield user_1.default.findOne({ where: { phoneNumber } });
                    if (userwithPhone) {
                        return res
                            .status(400)
                            .json({ message: `User with phone number ${phoneNumber} already exists` });
                    }
                    const updatedUser = yield user.update({
                        firstName,
                        lastName,
                        phoneNumber,
                    });
                    res
                        .status(201)
                        .json({ message: "User info updated", user: updatedUser });
                }
                catch (error) {
                    console.log("Error updating user", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("jwt", { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    const deleteUser = yield user.destroy();
                    res.status(200).json({ message: "User deleted successfully" });
                }
                catch (error) {
                    console.log("Error updating user", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("jwt", { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    res.status(200).json({ message: "User info obtained", user });
                }
                catch (error) {
                    console.log("Error getting user", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    selectCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate("jwt", { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { companyId } = req.params;
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    const selectedCompany = yield company_1.default.findByPk(companyId);
                    if (!selectedCompany) {
                        return res
                            .status(400)
                            .json({ message: `Company id ${companyId} does not exist` });
                    }
                    res.status(201).json({
                        message: "Company selected successfully",
                        company: selectedCompany,
                    });
                }
                catch (error) {
                    console.log("Error", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    verifyUserEmail(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const decoded = jwToken_1.default.decodeToken(token);
                if (!decoded.success) {
                    return res.status(400).json({ message: decoded === null || decoded === void 0 ? void 0 : decoded.error });
                }
                const userEmail = (_a = decoded.data) === null || _a === void 0 ? void 0 : _a.email;
                if (!userEmail) {
                    return res.status(400).json({ message: 'No email found in token' });
                }
                const userToVerify = yield user_1.default.findByEmail(userEmail);
                if (!userToVerify) {
                    return res.status(404).json({ message: `User with email ${userEmail} not found` });
                }
                const verifiedUser = yield userToVerify.update({ isVerified: true });
                res.status(200).json({ message: 'User successfully verified', verified: verifiedUser.isVerified });
            }
            catch (error) {
                console.log('Error verifying email', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    forgotPassWord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    return res.status(400).json({ message: 'Email field requierd to reset password' });
                }
                const emailUser = yield user_1.default.findByEmail(email);
                if (!emailUser) {
                    return res.status(404).json({ message: `User with email ${email} not found` });
                }
                const token = yield jwToken_1.default.generateToken({ email });
                const verificationLink = `${process.env.FRONTEND_URL}/api/v1/user/resetpassword/${token}`;
                const text = `
      Dear user,

      You recently requested to reset your password for your AkauntCalc account. Please click the link below to reset your password. If you did not request a password reset, you can safely ignore this email.

      Reset Password Link: ${verificationLink}

      This link will expire in 8 hours from the time this email was sent, so be sure to use it as soon as possible.

      Thank you,
      Your AkauntCalc Team
      `;
                const subject = 'Reset password link';
                const result = yield (0, sendMail_1.default)(email, subject, text);
                if (result) {
                    if (!result.booleanValue)
                        return res.status(400).json({ message: result.message });
                }
                return res.status(201).json({ message: result === null || result === void 0 ? void 0 : result.message });
            }
            catch (error) {
                console.log('Error sending reset password link', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    resetPassword(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const { password } = req.body;
                if (!password) {
                    return res.status(400).json({ message: 'Password field required' });
                }
                const decoded = jwToken_1.default.decodeToken(token);
                if (!decoded.success) {
                    return res.status(400).json({ message: decoded === null || decoded === void 0 ? void 0 : decoded.error });
                }
                const userEmail = (_a = decoded.data) === null || _a === void 0 ? void 0 : _a.email;
                if (!userEmail) {
                    return res.status(400).json({ message: 'No email found in token' });
                }
                const emailUser = yield user_1.default.findByEmail(userEmail);
                if (!emailUser) {
                    return res.status(404).json({ message: `User with email ${userEmail} not found` });
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                yield emailUser.update({ password: hashedPassword });
                return res.status(200).json({ message: "User password changed successfully" });
            }
            catch (error) {
                console.log('Error resetting password', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = UserControllers;
