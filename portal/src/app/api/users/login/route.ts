
// import { connect } from "@/dbConfig/dbConfig";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "@/models/UserModel";
// // import User from "@/models/UserModel";
// // import { User } from "../../../../models/UserModel";

// // Define the types for the request body
// interface LoginRequestBody {
//   email: string;
//   password: string;
//   employeeId: string;
// }

// export async function POST(request: NextRequest) {
//   const TOKEN_SECRET = new TextEncoder().encode('Secret_Key');
//   try {
//     // Parse the request body with a defined type
//     const reqBody: LoginRequestBody = await request.json();
//     const { email, password, employeeId } = reqBody;
    
//     console.log(email, password, employeeId);

//     // Connect to the database
//     await connect();

//     // Find the user by email and employeeId
//     const user = await User.findOne({ email, employeeId });
//     if (!user) {
//       return NextResponse.json({ error: "User (email or employee Id) does not exist" }, { status: 400 });
//     }

//     // Compare the provided password with the stored password
//     const validPassword = await bcryptjs.compare(password, user.password);
//     if (!validPassword) {
//       return NextResponse.json({ error: "Invalid password" }, { status: 400 });
//     }

//     // Create the token payload
//     const tokendata = {
//       id: user._id,
//       email: user.email,
//       username: user.username,
//       userrole: user.userrole   
//     };

//     // Sign the token
//     const token = jwt.sign(tokendata, TOKEN_SECRET!, { expiresIn: "1h" });

//     // Send the response with the token
//     const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });
//     response.cookies.set("token", token, { httpOnly: true });

//     return response;
//   } catch (error: unknown) {
//     // Error handling with specific type
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     } else {
//       return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
//     }
//   }
// }






import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/UserModel";

// Define the types for the request body
interface LoginRequestBody {
  email: string;
  password: string;
  employeeId: string;
}

export async function POST(request: NextRequest) {
  const TOKEN_SECRET ='Secret_Key';
  
  try {
    // Parse the request body with a defined type
    const reqBody: LoginRequestBody = await request.json();
    const { email, password, employeeId } = reqBody;

    console.log(email, password, employeeId);

    // Connect to the database
    await connect();

    // Find the user by email and employeeId
    const user = await User.findOne({ email, employeeId });
    if (!user) {
      return NextResponse.json({ error: "User (email or employee Id) does not exist" }, { status: 400 });
    }

    // Compare the provided password with the stored password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Create the token payload
    const tokendata = {
      id: user._id,
      email: user.email,
      username: user.username,
      userrole: user.userrole   
    };

    // Sign the token
    const token = jwt.sign(tokendata, TOKEN_SECRET, { expiresIn: "1h" });

    // Send the response with the token
    const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });
    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: unknown) {
    // Error handling with specific type
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}
