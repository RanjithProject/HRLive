import { NextRequest, NextResponse } from "next/server";  // Import necessary modules from Next.js
// import { getDataFromToken } from "../getDataFromToken/route"; 
import { getDataFromToken } from "@/helpers/getDatafromToken";

import User from "@/models/UserModel";  // Your Mongoose User model (adjust import as needed)

export async function GET(request: NextRequest) {
    try {
        // Call getDataFromToken to retrieve the user ID from the JWT token
        const userId = await getDataFromToken(request);

        // Find the user by their ID and exclude the password field from the result
        const user = await User.findById(userId).select("-password");

        if (!user) {
            // If no user is found, return a 404 error with a message
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // If user is found, return the user data along with a success message
        return NextResponse.json({ message: "User found", data: user });
    } catch (error) {
        console.error("Fetch user error:", error);

        // Return a 400 error with a generic error message
        return NextResponse.json({ error: "An error occurred." }, { status: 400 });
    }
}
