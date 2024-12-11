import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Define the interface for the request body
interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
    employeeId: string;
    userrole: string;
    shiftType: string;
}

export async function POST(request: NextRequest) {
    try {
        // Establish the connection to the database
        await connect();

        // Parse the JSON request body with type definition
        const reqBody: RegisterRequestBody = await request.json();
        const { username, email, password, employeeId, userrole, shiftType } = reqBody;
        console.log(username, email, password, employeeId, userrole, shiftType);

        // Basic validation for the required fields
        if (!username || !email || !password || !employeeId || !userrole) {
            return NextResponse.json(
                { error: "Username, email, employeeId, password, and role are all required." },
                { status: 400 }
            );
        }

        // Validate the role field
        const validRoles = ['employee', 'hr', 'manager'];
        if (!validRoles.includes(userrole)) {
            return NextResponse.json(
                { error: `Invalid role. Allowed roles are: ${validRoles.join(", ")}.` },
                { status: 400 }
            );
        }

        // Check if the employeeId already exists
        const existingEmployeeId = await User.findOne({ employeeId });
        if (existingEmployeeId) {
            return NextResponse.json(
                { error: "Employee ID already exists." },
                { status: 400 }
            );
        }

        // Check if the user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists." },
                { status: 400 }
            );
        }

        // Hash the password using bcrypt
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Determine shift based on shiftType, or default to 'morning'
        let shift = {};
        const currentDate = new Date();

        switch (shiftType) {
            case 'morning':
                shift = {
                    shiftType: 'morning',
                    startTime: currentDate.setHours(9, 0, 0, 0), // 9:00 AM
                    endTime: currentDate.setHours(18, 0, 0, 0), // 6:00 PM
                    shiftName: 'Morning Shift'
                };
                break;
            case 'midshift':
                shift = {
                    shiftType: 'midshift',
                    startTime: currentDate.setHours(14, 0, 0, 0), // 2:00 PM
                    endTime: currentDate.setHours(23, 0, 0, 0), // 11:00 PM
                    shiftName: 'Mid Shift'
                };
                break;
            case 'nightshift':
                shift = {
                    shiftType: 'nightshift',
                    startTime: currentDate.setHours(18, 0, 0, 0), // 6:00 PM
                    endTime: currentDate.setHours(3, 0, 0, 0), // 3:00 AM (next day)
                    shiftName: 'Night Shift'
                };
                break;
            default:
                // Default to morning shift if no shiftType provided
                shift = {
                    shiftType: 'morning',
                    startTime: currentDate.setHours(9, 0, 0, 0), // 9:00 AM
                    endTime: currentDate.setHours(18, 0, 0, 0), // 6:00 PM
                    shiftName: 'Morning Shift'
                };
                break;
        }

        // Create a new user document with all the provided fields, including the shift information
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            employeeId,
            userrole, // Add role to the new user
            shift, // Add the selected shift for the user
        });

        // Save the new user to the database
        await newUser.save();

        // Return a success response
        return NextResponse.json(
            { message: "User created successfully." },
            { status: 201 }
        );
    } catch (error: unknown) {
        // Error handling with specific type
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message || "Internal Server Error" },
                { status: 500 }
            );
        } else {
            // If the error is not an instance of Error, handle accordingly
            return NextResponse.json(
                { error: "An unexpected error occurred." },
                { status: 500 }
            );
        }
    }
}
