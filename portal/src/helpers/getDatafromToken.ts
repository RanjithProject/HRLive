// import jwt from "jsonwebtoken";

// const TOKEN_SECRET = process.env.TOKEN_SECRET || 'Secret_Key'; 

// export async function getDataFromToken(request) {
//     const token = request.cookies.get('token')?.value;
//     if (!token) throw new Error('No token provided');

//     const decoded = jwt.verify(token, TOKEN_SECRET);
//     return decoded.id; // Return user ID from token
// }




import jwt from "jsonwebtoken";
import { NextRequest } from "next/server"; // Import Next.js Request type

const TOKEN_SECRET = new TextEncoder().encode('Secret_Key');

interface JwtPayload {
    id: string; // Define the structure of the payload (ensure 'id' is always present)
}

// Modify the function to work with NextRequest
export async function getDataFromToken(request: NextRequest): Promise<string> {
    // Access cookies in Next.js using request.cookies
    const token = request.cookies.get('token')?.value;  // `.value` is required to extract the token string
    if (!token) throw new Error('No token provided');

    try {
        // Decode the token and cast it to 'unknown' first to safely check the type
        const decoded = jwt.verify(token, TOKEN_SECRET) as unknown;

        // Perform a type check to ensure the decoded token contains 'id' and matches the JwtPayload type
        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            return (decoded as JwtPayload).id; // Safely assert to JwtPayload here
        } else {
            throw new Error('Invalid token payload');
        }
    } catch (error) {
        throw new Error('Token verification failed: ' + (error instanceof Error ? error.message : error));
    }
}




