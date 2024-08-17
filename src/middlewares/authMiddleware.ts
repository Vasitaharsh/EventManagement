import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    }; 
}

const verifyTokenAndRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        console.log("hello");
        
        const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
console.log(token);

        try {
            console.log(token, process.env.JWT_SECRET!);
            
            const decoded:any = jwt.verify(token, process.env.JWT_SECRET!);
            console.log(decoded);
            
            if (typeof decoded !== 'string') {
                const user = decoded; // Type casting to AuthTokenPayload

                req.user = user; // Assign the payload to req.user

                // Check if the user's role is in the list of allowed roles
                if (allowedRoles.includes(user.role)) {
                    next(); // User has one of the allowed roles, proceed to the next middleware or route handler
                } else {
                    res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
                }
            } else {
                res.status(400).json({ message: 'Invalid token.' });
            }
        } catch (err) {
            res.status(400).json({ message: 'Invalid token.' });
        }
    };
};

export default verifyTokenAndRole;
