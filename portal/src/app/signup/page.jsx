"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { FaEyeSlash, FaRegEye } from "react-icons/fa";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        employeeId: "",
        username: "",
        password: "",
        userrole: "employee", // Default role
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/signup', user);
            console.log("SignUp Response", response.data);
            // const response1 = await axios.post('http://localhost:4000/signup', user);
            // console.log("SignUp Response", response1);

            if (response.data.error) {
                console.error(response.data.error);
            } else {
                alert("Signup successful");
                router.push('/login');
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password && user.username && user.userrole));
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-1 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">{loading ? "Processing" : "Sign Up"}</h1>
            <hr className="w-full mb-4" />

            <label htmlFor="employeeId" className="mb-1">Employee Id</label>
            <input 
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black mb-4 w-80"
                onChange={(e) => setUser({ ...user, employeeId: e.target.value })}
                placeholder="Employee Id"
                type="number" 
            />

            <label htmlFor="username" className="mb-1">Username</label>
            <input
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black mb-4 w-80"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Username"
            />

            <label htmlFor="email" className="mb-1">Email</label>
            <input
                className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black mb-4 w-80"
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
            />

            <label htmlFor="password" className="mb-1">Password</label>
            <div className="relative mb-4 w-80">
                <input
                    className="p-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black w-full"
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Password"
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? <FaRegEye /> : <FaEyeSlash />}
                </button>
            </div>

            <label htmlFor="userrole" className="mb-1">Role</label>
            <select
                id="userrole"
                className="p-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black mb-4 w-80"
                value={user.userrole}
                onChange={(e) => setUser({ ...user, userrole: e.target.value })}
            >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
            </select>

            <button
                onClick={onSignup}
                className="p-2 border border-gray-300 mb-4 bg-blue-500 text-white rounded-lg w-80 hover:bg-blue-600 transition duration-200"
                disabled={buttonDisabled || loading}
            >
                {loading ? "Processing..." : "Sign Up"}
            </button>

            <Link href="/login" className="text-blue-500">Visit Login</Link>
        </div>
    );
}