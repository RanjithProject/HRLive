"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "@/app/Context";

const TodayLeaveApplications = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole, employeeId,API } = useAppContext(); // Get manager"s employeeId from context

  // Fetch today"s leave applications on component mount
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        // Sending managerId as part of the URL params
        const response = await axios.get(API+`/api/todayLeaveApplications/${employeeId}`);
        
        if (response.data.success) {
          setLeaveData(response.data.data);  // Store the fetched leave data
        } else {
          setLeaveData([]);  // If no data found, set empty array
        }
      } catch (err) {
        setError("Error fetching leave applications",err);  // Error handling for failed request
      } finally {
        setLoading(false);  // Stop loading spinner once data is fetched or error occurs
      }
    };

    fetchLeaveData();
  }, [employeeId,API]); // Ensure data is fetched when the component mounts or when employeeId changes

  // Handle leave status change
  const handleLeaveStatusChange = async (employeeId, leaveId, newStatus) => {
    try {
      const response = await axios.patch(API+`/api/updateLeaveStatus/${employeeId}/${leaveId}`, { 
        leaveStatus: newStatus, 
        approvedByRole: userRole  // Send manager"s role for approval/rejection
      });

      if (response.data.success) {
        // Update the local leaveData state with the updated status
        setLeaveData(prevData =>
          prevData.map(employee =>
            employee.employeeId === employeeId
              ? {
                  ...employee,
                  todaysLeaves: employee.todaysLeaves.map(leave =>
                    leave._id === leaveId ? { ...leave, leaveStatus: newStatus } : leave
                  ),
                }
              : employee
          )
        );
      }
    } catch (err) {
      setError("Error updating leave status",err);  // Error handling for failed status update
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Todays Leave Applications</h1>
      {leaveData.length === 0 ? (
        <p className="text-center text-gray-500">No leave applications for today.</p>
      ) : (
        leaveData.map((employee) => (
          <div key={employee.employeeId} className="leave-card bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{employee.username} (ID: {employee.employeeId})</h2>
            <p className="text-gray-700 mb-4">Email: {employee.email}</p>
            <h3 className="text-xl font-semibold mb-2">Leave Applications:</h3>
            <ul className="space-y-4">
              {employee.todaysLeaves.map((leave) => (
                <li key={leave._id} className="p-4 rounded-lg">
                  <div>
                    <strong className="font-semibold">Leave Type:</strong> {leave.leaveType}
                  </div>
                  <div>
                    <strong className="font-semibold">From:</strong> {new Date(leave.fromDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong className="font-semibold">To:</strong> {new Date(leave.toDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong className="font-semibold">Reason:</strong> {leave.reason}
                  </div>
                  <div className={`mt-2 p-2 rounded-md text-white ${leave.leaveStatus === "pending" ? "bg-yellow-500" : leave.leaveStatus === "approved" ? "bg-green-500" : "bg-red-500"}`}>
                    <strong>Status:</strong> {leave.leaveStatus}
                  </div>

                  {/* Leave Status Selection */}
                  <div className="mt-4">
                    <label className="font-semibold text-lg">Change Status:</label>
                    <select
                      value={leave.leaveStatus}
                      onChange={(e) => handleLeaveStatusChange(employee.employeeId, leave._id, e.target.value)}
                      className="ml-2 p-2 border rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayLeaveApplications;
