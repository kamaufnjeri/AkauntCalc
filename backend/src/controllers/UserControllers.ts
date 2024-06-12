import User from "../models/user";
import Company from "../models/company";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import tokenClass from "../middlewares/jwToken";
import passport from "passport";
import dotenv from "dotenv";
import verifyUser from "../utils/verifyUser";
import sendMail from "../utils/sendMail";

dotenv.config();


const NODEENV = process.env.NODE_ENV || 'development';

class UserControllers {
  async register(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ messgae: "Email and password fields required"});
      }

      const userExist = await User.findByEmail(email);


      if (userExist) {
        return res
          .status(400)
          .json({ message: `User ${email} already exists` });
      }

      const newUser = await User.create({ email, password });

      if (NODEENV === 'production') {
        const result = await verifyUser(email);

        if (result) {
          if (!result.booleanValue)
          return res.status(400).json({ message: result.message });
        }
        return res.status(201).json({ message: result.message });
      }
      res
        .status(201)
        .json({ user: newUser, message: "User created successfully" });
    } catch (error) {
      console.log("Error when registering", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response): Promise<any> {
    passport.authenticate(
      "local",
      { session: false },
      async (error: string | null, user: User | false, info: any | null) => {
        try {
          if (error || !user) {
            return res.status(401).json({ message: info.message });
          }

          if (!user.isVerified) {
            if (NODEENV === 'production') {
              const result = await verifyUser(user.email);
      
              if (result) {
                if (!result.booleanValue)
                return res.status(400).json({ message: result.message });
              }
              return res.status(201).json({ message: result.message });
            }
          }
          const payload = { userId: user.id };
          const token = await tokenClass.generateToken(payload);
          res.status(200).json({ token, message: info.message });
        } catch (error) {
          console.log("Error logging in", error);
          res.status(500).json({ message: "Internal server error" });
        }
      },
    )(req, res);
  }

  async updateUser(req: Request, res: Response): Promise<any> {
    passport.authenticate(
      "jwt",
      { session: false },
      async (error: string | null, user: User | false) => {
        try {
          const { firstName, lastName, phoneNumber } = req.body;

          if (phoneNumber || !firstName || !lastName) {
            return res.status(400).json({ message: 'First name, lastname and phone number skills required'});
          }

          if (error || !user) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          
          const userwithPhone = await User.findOne({ where: { phoneNumber }});

          if (userwithPhone) {
            return res
              .status(400)
              .json({ message: `User with phone number ${phoneNumber} already exists` });
          }

          const updatedUser = await user.update({
            firstName,
            lastName,
            phoneNumber,
          });
          res
            .status(201)
            .json({ message: "User info updated", user: updatedUser });
        } catch (error) {
          console.log("Error updating user", error);
          res.status(500).json({ message: "Internal server error" });
        }
      },
    )(req, res);
  }

  async deleteUser(req: Request, res: Response): Promise<any> {
    passport.authenticate(
      "jwt",
      { session: false },
      async (error: string | null, user: User | false) => {
        try {
          if (error || !user) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          const deleteUser = await user.destroy();
          res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
          console.log("Error updating user", error);
          res.status(500).json({ message: "Internal server error" });
        }
      },
    )(req, res);
  }

  async getUser(req: Request, res: Response): Promise<any> {
    passport.authenticate(
      "jwt",
      { session: false },
      async (error: string | null, user: User | false) => {
        try {
          if (error || !user) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          res.status(200).json({ message: "User info obtained", user });
        } catch (error) {
          console.log("Error getting user", error);
          res.status(500).json({ message: "Internal server error" });
        }
      },
    )(req, res);
  }

  async selectCompany(req: Request, res: Response): Promise<any> {
    passport.authenticate(
      "jwt",
      { session: false },
      async (error: string | null, user: User | false) => {
        try {
          const { companyId } = req.params;

          if (error || !user) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          const selectedCompany = await Company.findByPk(companyId);

          if (!selectedCompany) {
            return res
              .status(400)
              .json({ message: `Company id ${companyId} does not exist` });
          }

          res.status(201).json({
            message: "Company selected successfully",
            company: selectedCompany,
          });
        } catch (error) {
          console.log("Error", error);
          res.status(500).json({ message: "Internal server error" });
        }
      },
    )(req, res);
  }

  async verifyUserEmail(req: Request, res: Response): Promise<any> {
    try {
      const { token } = req.params;

    const decoded = tokenClass.decodeToken(token);

    if (!decoded.success) {
      return res.status(400).json({ message: decoded?.error });
    } 

    const userEmail = decoded.data?.email;

    if (!userEmail) {
      return res.status(400).json({ message: 'No email found in token'})
    }
    const userToVerify = await User.findByEmail(userEmail);

    if (!userToVerify) {
      return res.status(404).json({ message: `User with email ${userEmail} not found`})
    }

    const verifiedUser = await userToVerify.update({ isVerified: true });

    res.status(200).json({ message: 'User successfully verified', verified: verifiedUser.isVerified });
    } catch(error) {
      console.log('Error verifying email', error);
      res.status(500).json({ message: 'Internal server error'});
    }
    
  }

  async forgotPassWord(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email field requierd to reset password'})
      }

      const emailUser = await User.findByEmail(email);

      if (!emailUser) {
        return res.status(404).json({ message: `User with email ${email} not found`});
      }

      const token = await tokenClass.generateToken({ email });

      const verificationLink = `${process.env.FRONTEND_URL}/api/v1/user/resetpassword/${token}`

      const text = `
      Dear user,

      You recently requested to reset your password for your AkauntCalc account. Please click the link below to reset your password. If you did not request a password reset, you can safely ignore this email.

      Reset Password Link: ${verificationLink}

      This link will expire in 8 hours from the time this email was sent, so be sure to use it as soon as possible.

      Thank you,
      Your AkauntCalc Team
      `
      const subject = 'Reset password link';

      const result = await sendMail(email, subject, text);

      if (result) {
        if (!result.booleanValue)
        return res.status(400).json({ message: result.message });
      }
      return res.status(201).json({ message: result?.message });
    } catch(error) {
      console.log('Error sending reset password link', error);
      res.status(500).json({ message: 'Internal server error'});
    }
  }

  async resetPassword(req: Request, res: Response): Promise<any> {
    try {
      const { token } = req.params;

      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: 'Password field required'});
      }

      const decoded = tokenClass.decodeToken(token);

      if (!decoded.success) {
        return res.status(400).json({ message: decoded?.error });
      } 
  
      const userEmail = decoded.data?.email;
  
      if (!userEmail) {
        return res.status(400).json({ message: 'No email found in token'})
      }
      const emailUser = await User.findByEmail(userEmail);
  
      if (!emailUser) {
        return res.status(404).json({ message: `User with email ${userEmail} not found`})
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await emailUser.update({ password: hashedPassword });
      return res.status(200).json({ message: "User password changed successfully"})
    } catch(error) {
      console.log('Error resetting password', error);
      res.status(500).json({ message: 'Internal server error'});
    }
  }
}

export default UserControllers;
