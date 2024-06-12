import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const SECRETKEY = process.env.SECRET_KEY || 'your_secret_key'; // Replace with your actual secret key
// Generate JWT token

// Define the payload interface
interface Payload {
    email: string;
    companyId?: string;
    iat?: number; // Issued at
    exp?: number; // Expiration time
}

// Define the response interface
interface VerifyTokenResponse {
    success: boolean;
    data?: Payload;
    error?: string;
}

class Token {
    async generateToken(payload: any): Promise<string> { 
        const token = jwt.sign(payload, SECRETKEY, { expiresIn: '8h' }); // Token expires in 1 hour
        return token;
    }

    decodeToken(token: string): VerifyTokenResponse {
        try {
            const decoded = jwt.verify(token, SECRETKEY) as Payload;

            return { success: true, data: decoded };
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return { success: false, error: 'Token has expired' };
            } else if (error instanceof JsonWebTokenError) {
                return { success: false, error: 'Invalid token' };
            } else {
                return { success: false, error: 'Error verifying token' };
            }
        }
    };
}

export default new Token();