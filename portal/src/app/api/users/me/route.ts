





// // import { NextRequest, NextResponse } from "next/server";
// // // import { getDataFromToken } from "@/helpers/getDataFromToken";

// // // import User from "@/models/userModel";

// // import { getDataFromToken } from "../getDataFromToken/route";
// // import User from "@/models/UserModel";
// // // import { User } from "../../../../models/UserModel";

// // // import User from "@/models/UserModel";

// // // import { Connect } from "@/dbConfig/dbConfig";

// // export async function GET(request: NextRequest) {
// //     try {
// //         const userId = await getDataFromToken(request);
// //         const user = await User.findById(userId).select("-password");

// //         if (!user) {
// //             return NextResponse.json({ error: "User not found" }, { status: 404 });
// //         }

// //         return NextResponse.json({ message: "User found", data: user });
// //     } catch (error) {
// //         console.error("Fetch user error:", error);
// //         return NextResponse.json({ error: "An error occurred." }, { status: 400 });
// //     }
// // }





// import { NextRequest, NextResponse } from "next/server";
// import { getDataFromToken } from "../getDataFromToken/route";
// import User from "@/models/UserModel"; // Adjust the import as needed

// export async function GET(request: NextRequest) {
//     try {
//         // Get user ID from the token in the request
//         const userId = await getDataFromToken(request);

//         // Find the user by ID and exclude the password field
//         const user = await User.findById(userId).select("-password");

//         // If user is not found, return a 404 error response
//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // Return the user data with a success message
//         return NextResponse.json({ message: "User found", data: user });
//     } catch (error) {
//         console.error("Fetch user error:", error);

//         // Return a 400 error if something goes wrong
//         return NextResponse.json({ error: "An error occurred." }, { status: 400 });
//     }
// }





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
