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
const jwToken_1 = __importDefault(require("../middlewares/jwToken"));
const passport_1 = __importDefault(require("passport"));
class AuthControllers {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userExist = yield user_1.default.findByEmail(email);
                if (userExist) {
                    return res.status(400).json({ message: `User ${email} already exists` });
                }
                const newUser = yield user_1.default.create({ email, password });
                res.status(201).json({ newUser, message: "User created successfully" });
            }
            catch (error) {
                console.log("Error when registering", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('local', { session: false }, (error, user, info) => {
                try {
                    if (error || !user) {
                        return res.status(401).json({ message: info.message });
                    }
                    const payload = { userId: user.id };
                    const token = (0, jwToken_1.default)(payload);
                    res.status(200).json({ token, message: info.message });
                }
                catch (error) {
                    console.log("Error logging in", error);
                    res.status(500).json({ message: "Internal server error" });
                }
            })(req, res);
        });
    }
}
exports.default = AuthControllers;
