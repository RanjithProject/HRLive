"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/Context";

export default function NavBar() {
  const router = useRouter();

  // Use user data from context
  const { userName, userRole, updateUserDetails } = useAppContext();
  console.log(userName, userRole);

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout Successful");
      updateUserDetails(); // Refresh user data in context
      router.push("/login");
    } catch (error) {
      console.log(error.message);
      toast.error("Error logging out");
    }
  };

  // If user is not logged in (userName is null), return null to hide the NavBar
  if (!userName) return null;

  return (
    <div className="flex flex-col bg-gray-100">
      <nav className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-lg font-semibold">
            <Link href="/" className="hover:text-gray-300">Home</Link>
          </div>
          <div className="flex space-x-6">
            {/* Common Links */}
            <Link href="/components/Attentance" className="hover:text-gray-300">Attentance</Link>
            <Link href="/components/LeaveApplyPage" className="hover:text-gray-300">LeaveApply</Link>

            {/* HR and Manager Links */}
            {userRole === "hr" && (
              <Link href="/components/HREmployeeConnection" className="hover:text-gray-300">HREmployeeConnection</Link>
            )}
            {userRole === "manager" && (
              <Link href="/components/ManagerEmployee" className="hover:text-gray-300">ManagerEmployee</Link>
            )}

            {userRole === "employee" && (
              <>
                <Link href="/components/EmployeeExpense" className="hover:text-gray-300">EmployeeExpense</Link>
                <Link href="/components/ExpenseApply" className="hover:text-gray-300">ExpenseApply</Link>
                <Link href="/components/LeaveStatus" className="hover:text-gray-300">LeaveStatus</Link>
              </>
            )}

            {/* Additional HR and Manager Links */}
            {(userRole === "hr" || userRole === "manager") && (
              <>
                <Link href="/components/HRApprovel" className="hover:text-gray-300">HRApprovel</Link>
                <Link href="/components/ExpenseDecline" className="hover:text-gray-300">ExpenseDecline</Link>
                <Link href="/components/LeaveCart" className="hover:text-gray-300">LeaveCart</Link>
              </>
            )}

            {/* Conditionally render the username or login button */}
            <div className="flex items-center space-x-4">
              {userName ? (
                <>
                  <span className="text-white">{userName}</span>
                  <button onClick={logout} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Logout</button>
                </>
              ) : (
                <Link href="/login" className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}


