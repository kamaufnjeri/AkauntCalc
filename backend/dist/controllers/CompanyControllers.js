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
const company_1 = __importDefault(require("../models/company"));
const user_1 = __importDefault(require("../models/user"));
const userCompany_1 = __importDefault(require("../models/userCompany"));
const jwToken_1 = __importDefault(require("../middlewares/jwToken"));
const passport_1 = __importDefault(require("passport"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class CompanyControllers {
    createCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('jwt', { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { name, email, phoneNumber, country, currency, alias } = req.body;
                    if (!name || !email || !phoneNumber) {
                        return res.status(400).json({ message: "Company name, email and phone number required" });
                    }
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    const companywithEmail = yield company_1.default.findOne({ where: { email } });
                    const companywithPhone = yield company_1.default.findOne({ where: { phoneNumber } });
                    if (companywithEmail) {
                        return res.status(400).json({ message: `Company with the email ${email} already exists` });
                    }
                    if (companywithPhone) {
                        return res.status(400).json({ message: `Company with the phone no. ${phoneNumber} already exists` });
                    }
                    const newCompany = yield company_1.default.create({ name, email, phoneNumber, country, currency, alias });
                    yield userCompany_1.default.create({ userId: user.id, companyId: newCompany.id, role: "isAdmin" });
                    res.status(201).json({ company: newCompany, message: "Company created successfully" });
                }
                catch (error) {
                    console.log('Error creating company', error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    updateCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('jwt', { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id } = req.params;
                    const { name, email, phoneNumber, country, currency, alias } = req.body;
                    if (!name || !email || !phoneNumber) {
                        return res.status(400).json({ message: "Company name, email and phone number required" });
                    }
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    const companywithEmail = yield company_1.default.findOne({ where: { email } });
                    const companywithPhone = yield company_1.default.findOne({ where: { phoneNumber } });
                    if (companywithEmail) {
                        return res.status(400).json({ message: `Company with the email ${email} already exists` });
                    }
                    if (companywithPhone) {
                        return res.status(400).json({ message: `Company with the phone no. ${phoneNumber} already exists` });
                    }
                    const company = yield company_1.default.findByPk(id);
                    if (!company) {
                        return res.status(404).json({ message: `Company id ${id} not found` });
                    }
                    const userRole = yield userCompany_1.default.getUserRoleInCompany(company.id, user.id); // Assuming this method is asynchronous
                    if (userRole !== 'isAdmin') {
                        return res.status(403).json({ message: 'Only admin can update company info' });
                    }
                    const updatedCompany = yield company.update({ name, email, phoneNumber, country, currency, alias });
                    res.status(200).json({ company: updatedCompany, message: "Company updated successfully" });
                }
                catch (error) {
                    console.log('Error updating company', error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    getCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('jwt', { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id } = req.params;
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    const company = yield company_1.default.findByPk(id);
                    if (!company) {
                        return res.status(404).json({ message: `Company id ${id} not found` });
                    }
                    res.status(200).json({ company: company, message: "Company info found" });
                }
                catch (error) {
                    console.log('Error getting company info', error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    deleteCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('jwt', { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id } = req.params;
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    const company = yield company_1.default.findByPk(id);
                    if (!company) {
                        return res.status(404).json({ message: `Company id ${id} not found` });
                    }
                    const userCompany = yield userCompany_1.default.findOne({ where: { companyId: company.id, userId: user.id } }); // Assuming this method is asynchronous
                    if ((userCompany === null || userCompany === void 0 ? void 0 : userCompany.role) !== 'isAdmin') {
                        return res.status(403).json({ message: 'Only admin can delete company' });
                    }
                    yield (userCompany === null || userCompany === void 0 ? void 0 : userCompany.destroy());
                    yield company.destroy();
                    res.status(200).json({ message: "Company deleted successfully" });
                }
                catch (error) {
                    console.log('Error deleting company', error);
                    res.status(500).json({ message: "Internal server error" });
                }
            }))(req, res);
        });
    }
    sentInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('jwt', { session: false }, (error, user) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { id } = req.params;
                    const { email } = req.body;
                    if (error || !user) {
                        return res.status(401).json({ message: "Unauthorized" });
                    }
                    if (!email) {
                        return res.status(400).json({ message: "Email is required" });
                    }
                    const company = yield company_1.default.findByPk(id);
                    if (!company) {
                        return res.status(404).json({ message: `Company with id ${id} not found` });
                    }
                    const userCompany = yield userCompany_1.default.findOne({ where: { companyId: company.id, userId: user.id } });
                    if (!userCompany || userCompany.role !== 'isAdmin') {
                        return res.status(403).json({ message: 'Only admin can send company invitations' });
                    }
                    const payload = { email, companyId: id };
                    const token = yield jwToken_1.default.generateToken(payload);
                    const invitationLink = `${process.env.FRONTEND_URL}/api/v1/company/invitation/${token}`;
                    const subject = `${company.name} - You're Invited to Join Us on AkauntCalc!`;
                    const text = `
                Hi,
                
                You've been invited to join our team on AkauntCalc, our cutting-edge financial management platform!
                
                Please click the link below to accept your invitation and complete your registration. This link will expire in 8 hours.
                
                ${invitationLink}
                
                If you do not wish to join, you can safely ignore this message.
                
                Looking forward to working with you!
                
                Best regards,
                The AkauntCalc Team
                ${company.name}
                `;
                    const result = yield (0, sendMail_1.default)(email, subject, text);
                    if (!result || !result.booleanValue) {
                        return res.status(400).json({ message: (result === null || result === void 0 ? void 0 : result.message) || 'Failed to send invitation email' });
                    }
                    res.status(201).json({ message: 'Invitation email sent successfully' });
                }
                catch (error) {
                    console.error('Error sending company invitation email', error);
                    res.status(500).json({ message: 'Internal server error' });
                }
            }))(req, res);
        });
    }
    acceptInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { token } = req.params;
                if (!email || !password) {
                    return res.status(400).json({ message: 'Email and password are required' });
                }
                if (!token) {
                    return res.status(400).json({ message: 'Token is required' });
                }
                const decoded = jwToken_1.default.decodeToken(token);
                if (!decoded.success) {
                    return res.status(400).json({ message: 'Invalid token' });
                }
                const { data } = decoded;
                if (email !== (data === null || data === void 0 ? void 0 : data.email)) {
                    return res.status(400).json({ message: "Email doesn't match the email sent in the invitation link" });
                }
                const company = yield company_1.default.findByPk(data === null || data === void 0 ? void 0 : data.companyId);
                if (!company) {
                    return res.status(404).json({ message: `Company with id ${data === null || data === void 0 ? void 0 : data.companyId} not found` });
                }
                let user = yield user_1.default.findByEmail(email);
                if (user) {
                    const isMatch = yield user.comparePassword(password);
                    if (!isMatch) {
                        return res.status(400).json({ message: `Incorrect password for ${email}` });
                    }
                }
                else {
                    user = yield user_1.default.create({ email, password, isVerified: true });
                }
                const userInCompany = yield userCompany_1.default.findOne({ where: { userId: user.id, companyId: company.id } });
                if (userInCompany) {
                    return res.status(400).json({ message: `Already in company ${company.name}` });
                }
                yield userCompany_1.default.create({ userId: user.id, companyId: company.id, role: 'isMember' });
                res.status(201).json({ message: `${email} added to ${company.name} successfully` });
            }
            catch (error) {
                console.error('Error accepting company invitation', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = CompanyControllers;
