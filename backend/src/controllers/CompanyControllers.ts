import Company from '../models/company';
import User from '../models/user';
import UserCompany from '../models/userCompany';
import { Request, Response } from 'express';
import tokenClass from "../middlewares/jwToken";
import passport from 'passport';
import sendMail from '../utils/sendMail';
import dotenv from 'dotenv';


dotenv.config();

class CompanyControllers {
    async createCompany(req: Request, res: Response): Promise<any> {
        passport.authenticate('jwt', { session: false }, async (error: string | null, user: User | false) => {
            try {
                const { name, email, phoneNumber, country, currency, alias } = req.body;

                if (!name || !email || !phoneNumber) {
                    return res.status(400).json({ message: "Company name, email and phone number required"});
                }
                if (error || !user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const companywithEmail = await Company.findOne({ where: { email }});
                const companywithPhone = await Company.findOne({ where: { phoneNumber }});

                if (companywithEmail) {
                    return res.status(400).json({ message: `Company with the email ${email} already exists`})
                }

                if (companywithPhone) {
                    return res.status(400).json({ message: `Company with the phone no. ${phoneNumber} already exists`})
                }
                const newCompany = await Company.create({ name, email, phoneNumber, country, currency, alias });
                await UserCompany.create({ userId: user.id, companyId: newCompany.id, role: "isAdmin" });
                res.status(201).json({ company: newCompany, message: "Company created successfully" });
            } catch (error) {
                console.log('Error creating company', error);
                res.status(500).json({ message: "Internal server error" });
            }
        })(req, res);
    }

    async updateCompany(req: Request, res: Response): Promise<any> {
        passport.authenticate('jwt', { session: false }, async (error: string | null, user: User | false) => {
            try {
                const { id } = req.params;
                const { name, email, phoneNumber, country, currency, alias } = req.body;

                if (!name || !email || !phoneNumber) {
                    return res.status(400).json({ message: "Company name, email and phone number required"});
                }
                if (error || !user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const companywithEmail = await Company.findOne({ where: { email }});
                const companywithPhone = await Company.findOne({ where: { phoneNumber }});

                if (companywithEmail) {
                    return res.status(400).json({ message: `Company with the email ${email} already exists`})
                }

                if (companywithPhone) {
                    return res.status(400).json({ message: `Company with the phone no. ${phoneNumber} already exists`})
                }

                const company = await Company.findByPk(id);
                if (!company) {
                    return res.status(404).json({ message: `Company id ${id} not found` });
                }

                const userRole = await UserCompany.getUserRoleInCompany(company.id, user.id);  // Assuming this method is asynchronous
                if (userRole !== 'isAdmin') {
                    return res.status(403).json({ message: 'Only admin can update company info' });
                }

                const updatedCompany = await company.update({ name, email, phoneNumber, country, currency, alias });
                res.status(200).json({ company: updatedCompany, message: "Company updated successfully" });
            } catch (error) {
                console.log('Error updating company', error);
                res.status(500).json({ message: "Internal server error" });
            }
        })(req, res);
    }

    async getCompany(req: Request, res: Response): Promise<any> {
        passport.authenticate('jwt', { session: false }, async (error: string | null, user: User | false) => {
            try {
                const { id } = req.params;

                if (error || !user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const company = await Company.findByPk(id);
                if (!company) {
                    return res.status(404).json({ message: `Company id ${id} not found` });
                }

                res.status(200).json({ company: company, message: "Company info found" });
            } catch (error) {
                console.log('Error getting company info', error);
                res.status(500).json({ message: "Internal server error" });
            }
        })(req, res);
    }

    async deleteCompany(req: Request, res: Response): Promise<any> {
        passport.authenticate('jwt', { session: false }, async (error: string | null, user: User | false) => {
            try {
                const { id } = req.params;

                if (error || !user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const company = await Company.findByPk(id);
                if (!company) {
                    return res.status(404).json({ message: `Company id ${id} not found` });
                }

                const userCompany = await UserCompany.findOne({ where: { companyId: company.id, userId: user.id } });  // Assuming this method is asynchronous
                if (userCompany?.role !== 'isAdmin') {
                    return res.status(403).json({ message: 'Only admin can delete company' });
                }

                await userCompany?.destroy();
                await company.destroy();
        
                res.status(200).json({ message: "Company deleted successfully" });
            } catch (error) {
                console.log('Error deleting company', error);
                res.status(500).json({ message: "Internal server error" });
            }
        })(req, res);
    }

    async sentInvitation(req: Request, res: Response): Promise<any> {
        passport.authenticate('jwt', { session: false }, async (error: string | null, user: User | false) => {
            try {
                const { id } = req.params;
                const { email } = req.body;
    
                if (error || !user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
    
                if (!email) {
                    return res.status(400).json({ message: "Email is required" });
                }
    
                const company = await Company.findByPk(id);
    
                if (!company) {
                    return res.status(404).json({ message: `Company with id ${id} not found` });
                }
    
                const userCompany = await UserCompany.findOne({ where: { companyId: company.id, userId: user.id } });
    
                if (!userCompany || userCompany.role !== 'isAdmin') {
                    return res.status(403).json({ message: 'Only admin can send company invitations' });
                }
    
                const payload = { email, companyId: id };
                const token = await tokenClass.generateToken(payload);
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
                const result = await sendMail(email, subject, text);
    
                if (!result || !result.booleanValue) {
                    return res.status(400).json({ message: result?.message || 'Failed to send invitation email' });
                }
    
                res.status(201).json({ message: 'Invitation email sent successfully' });
            } catch(error) {
                console.error('Error sending company invitation email', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        })(req, res);
    }    

    async acceptInvitation(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;
            const { token } = req.params;
    
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
    
            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }
    
            const decoded = tokenClass.decodeToken(token);
    
            if (!decoded.success) {
                return res.status(400).json({ message: 'Invalid token' });
            }
    
            const { data } = decoded;
    
            if (email !== data?.email) {
                return res.status(400).json({ message: "Email doesn't match the email sent in the invitation link" });
            }
    
            const company = await Company.findByPk(data?.companyId);
    
            if (!company) {
                return res.status(404).json({ message: `Company with id ${data?.companyId} not found` });
            }
    
            let user = await User.findByEmail(email);
    
            if (user) {
                const isMatch = await user.comparePassword(password);
    
                if (!isMatch) {
                    return res.status(400).json({ message: `Incorrect password for ${email}` });
                }
            } else {
                user = await User.create({ email, password, isVerified: true });
            }

            const userInCompany = await UserCompany.findOne({ where: { userId: user.id, companyId: company.id } });

            if (userInCompany) {
                return res.status(400).json({ message: `${email} already in company ${company.name}`});
            }
            await UserCompany.create({ userId: user.id, companyId: company.id, role: 'isMember' });
    
            res.status(201).json({ message: `${email} added to ${company.name} successfully` });
        } catch(error) {
            console.error('Error accepting company invitation', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
}
export default CompanyControllers;
