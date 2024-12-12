
'use client';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/Context';


export default function SideBar() {
  const router = useRouter();

  // Use user data from context
  const { userName, userRole, updateUserDetails } = useAppContext();
  console.log(userName, userRole);

  // Logout function
  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout Successful');
      updateUserDetails(); // Refresh user data in context
      router.push('/login');
    } catch (error) {
      console.log(error.message);
      toast.error('Error logging out');
    }
  };

  // If user is not logged in (userName is null), return null to hide the sidebar
  if (!userName) return null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 p-4 flex flex-col fixed left-0 top-0 h-full">
        <div className="text-xl font-semibold mb-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
        </div>

        <ul className="flex flex-col space-y-4">
          {/* Common Links */}
          <li>
            <Link href="/components/Attendance" className="hover:text-gray-300">Attendance</Link>
          </li>
          <li>
            <Link href="/components/LeaveApplyPage" className="hover:text-gray-300">Leave Apply</Link>
          </li>

          {/* HR and Manager Links */}
          {userRole === 'hr' && (
            <li>
              <Link href="/components/HREmployeeConnection" className="hover:text-gray-300">HR Employee Connection</Link>
            </li>
          )}
          {userRole === 'manager' && (
            <li>
              <Link href="/components/ManagerEmployee" className="hover:text-gray-300">Manager Employee</Link>
            </li>
          )}

          {userRole === 'employee' && (
            <>
              <li>
                <Link href="/components/EmployeeExpense" className="hover:text-gray-300">Employee Expense</Link>
              </li>
              <li>
                <Link href="/components/ExpenseApply" className="hover:text-gray-300">Expense Apply</Link>
              </li>
              <li>
                <Link href="/components/LeaveStatus" className="hover:text-gray-300">Leave Status</Link>
              </li>
            </>
          )}

          {/* Additional HR and Manager Links */}
          {(userRole === 'hr' || userRole === 'manager') && (
            <>
              <li>
                <Link href="/components/HRApproval" className="hover:text-gray-300">HR Approval</Link>
              </li>
              <li>
                <Link href="/components/ExpenseDecline" className="hover:text-gray-300">Expense Decline</Link>
              </li>
              <li>
                <Link href="/components/LeaveCart" className="hover:text-gray-300">Leave Cart</Link>
              </li>
              <li>
                <Link href="/components/ShiftManagement" className="hover:text-gray-300">Change Shift</Link>
              </li>
            </>
          )}

          {/* Conditionally render the username or login button */}
          <div className="mt-auto">
            {userName ? (
              <div className="flex flex-col items-start space-y-2">
                <span className="text-white">{userName}</span>
                <button
                  onClick={logout}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>
            )}
          </div>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 p-6 bg-white">
        {/* Your main content goes here */}
      </div>
    </div>
  );
}
