// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { jwtVerify } from 'jose';

// export async function middleware(request: NextRequest) {
//     const path = request.nextUrl.pathname;
//     const token = request.cookies.get('token')?.value || '';
//     const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET || 'Secret_Key');

// console.log(typeof token);


//     let isAuthenticated = false;
//     let userRole = '';

//     // Verify and decode the token if it exists
//     if (token) {
//         try {
//             const decoded = await jwtVerify(token, TOKEN_SECRET); // Decode the JWT token
//             isAuthenticated = true;
//             userRole = decoded.payload.userrole; // Extract user role from the decoded token
//         } catch (error) {
//             console.error("Token verification failed:", error);
//         }
//     }

//     // Define the public paths where authentication is not required
//     const publicPaths = ['/login', '/signup'];

//     // If the user is authenticated and tries to access public paths, redirect them to the home page
//     if (publicPaths.includes(path) && isAuthenticated) {
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     // Define the protected paths where authentication is required
//     const protectedPaths = [
//         '/', // Home page
//         '/profile', // Protected path
//         '/components/Attentance', // Protected path
//         '/components/LeaveApplyPage',
        
//     ];

//     // If the user is not authenticated and tries to access protected paths, redirect to login
//     if (protectedPaths.includes(path) && !isAuthenticated) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // Role-based access control logic:
    
//     // HR and Manager can access the following pages
//     const allowedPathsForHRManager = [
//         '/components/HRApprovel',
//         '/components/ExpenseDecline',
//         '/components/HREmployeeConnection',
//         '/components/LeaveCart',
//         '/components/ShiftMangement',
//         '/components/ManagerEmployee',
        
//     ];

//     // Employee can access the following pages
//     const allowedPathsForEmployee = [
//         '/components/EmployeeExpense',
//         '/components/ExpenseApply',
//         '/components/LeaveStatus'
//     ];

//     // HR and Manager access check
//     if (allowedPathsForHRManager.includes(path) && (userRole !== 'hr' && userRole !== 'manager')) {
//         // If the user is not HR or Manager, redirect to home or any other default page
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     // Employee access check
//     if (allowedPathsForEmployee.includes(path) && userRole !== 'employee') {
//         // If the user is not an employee, redirect to home or any other default page
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     // If the user is authenticated and authorized, allow the request to proceed
//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/', // Home page
//         '/profile', // Protected path
//         '/components/Attentance', // Protected path
//         '/login', // Login page
//         '/signup', // Signup page
//         '/components/HRApprovel', // HR and Manager only
//         '/components/ExpenseDecline', // HR and Manager only
//         '/components/HREmployeeConnection', // HR and Manager only
//         '/components/LeaveCart', // HR and Manager only
//         '/components/ShiftMangement', // HR and Manager only
//         '/components/ManagerEmployee', // HR and Manager only
//         '/components/EmployeeExpense', // Employee only
//         '/components/ExpenseApply', // Employee only
//         '/components/LeaveStatus',
//         '/components/LeaveApplyPage',
//     ],
// };







import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define the type for the JWT payload
interface JwtPayload {
    userrole: 'employee' | 'hr' | 'manager'; // Adjust this to match the roles in your system
    // Add other fields that your payload may contain
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value || '';
    const TOKEN_SECRET = new TextEncoder().encode('Secret_Key');

    console.log(typeof token);

    let isAuthenticated = false;
    let userRole: 'employee' | 'hr' | 'manager' | '' = ''; // Initialize userRole with proper type

    // Verify and decode the token if it exists
    if (token) {
        try {
            const decoded = await jwtVerify(token, TOKEN_SECRET); // Decode the JWT token

            // Safely cast decoded.payload to the expected JwtPayload type
            const payload = decoded.payload as unknown as JwtPayload;

            // Check if userrole exists in the payload
            if (payload && payload.userrole) {
                isAuthenticated = true;
                userRole = payload.userrole; // Extract user role from the decoded token
            }
        } catch (error) {
            console.error("Token verification failed:", error);
        }
    }

    // Define the public paths where authentication is not required
    const publicPaths = ['/login', '/signup'];

    // If the user is authenticated and tries to access public paths, redirect them to the home page
    if (publicPaths.includes(path) && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Define the protected paths where authentication is required
    const protectedPaths = [
        '/', // Home page
        '/profile', // Protected path
        '/components/Attentance', // Protected path
        '/components/LeaveApplyPage',
    ];

    // If the user is not authenticated and tries to access protected paths, redirect to login
    if (protectedPaths.includes(path) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control logic:

    // HR and Manager can access the following pages
    const allowedPathsForHRManager = [
        '/components/HRApprovel',
        '/components/ExpenseDecline',
        '/components/HREmployeeConnection',
        '/components/LeaveCart',
        '/components/ShiftMangement',
        '/components/ManagerEmployee',
    ];

    // Employee can access the following pages
    const allowedPathsForEmployee = [
        '/components/EmployeeExpense',
        '/components/ExpenseApply',
        '/components/LeaveStatus'
    ];

    // HR and Manager access check
    if (allowedPathsForHRManager.includes(path) && !(userRole === 'hr' || userRole === 'manager')) {
        // If the user is not HR or Manager, redirect to home or any other default page
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Employee access check
    if (allowedPathsForEmployee.includes(path) && userRole !== 'employee') {
        // If the user is not an employee, redirect to home or any other default page
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If the user is authenticated and authorized, allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', // Home page
        '/profile', // Protected path
        '/components/Attentance', // Protected path
        '/login', // Login page
        '/signup', // Signup page
        '/components/HRApprovel', // HR and Manager only
        '/components/ExpenseDecline', // HR and Manager only
        '/components/HREmployeeConnection', // HR and Manager only
        '/components/LeaveCart', // HR and Manager only
        '/components/ShiftMangement', // HR and Manager only
        '/components/ManagerEmployee', // HR and Manager only
        '/components/EmployeeExpense', // Employee only
        '/components/ExpenseApply', // Employee only
        '/components/LeaveStatus',
        '/components/LeaveApplyPage',
    ],
};
