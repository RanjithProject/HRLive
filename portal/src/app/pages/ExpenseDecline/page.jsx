"use client";

import { useAppContext } from "@/app/Context";
import axios from "axios";
import React, { useState, useEffect } from "react";

const ExpenseDecline = () => {
  const [expenses, setExpenses] = useState([]);
  const [status, setStatus] = useState("");
  const [managerReason, setManagerReason] = useState("");
  const { userEmail, employeeId } = useAppContext();

  console.log("userEmail:", userEmail, " employeeId:", employeeId);

  // Fetch the list of expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(process.env.APIS+`/get-files?managerId=${employeeId}`);
        setExpenses(response.data.files);
      } catch (error) {
        console.log("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [employeeId]);

  // Handle status update and manager reason submission
  const handleUpdateStatus = async (expenseId) => {
    if (!status) {
      alert("Please provide a status (Approved/Declined)");
      return;
    }

    // Ensure a reason is provided if the status is "Declined"
    if (status === "Declined" && !managerReason) {
      alert("Please provide a reason for declining");
      return;
    }

    try {
      const response = await axios.put(process.env.APIS+`/update-expense/${expenseId}`, {
        expenseId,
        status,
        reason: managerReason,
        managerId: employeeId,
        managerEmail: userEmail,
      });

      if (response.data.success) {
        // Update the local state to reflect the changes
        const updatedExpenses = expenses.map((expense) => {
          if (expense._id === expenseId) {
            return {
              ...expense,
              status: response.data.expense.status,
              managerReason: response.data.expense.managerReason, // Update the reason as well
            };
          }
          return expense;
        });

        setExpenses(updatedExpenses);
        setStatus("");
        setManagerReason("");
        alert("Expense status updated successfully!");
      }
    } catch (error) {
      console.log("Error updating expense status:", error);
      alert("Failed to update status.");
    }
  };

  // Download file logic
  const downloadFile = async (filename) => {
    try {
      const response = await axios({
        url: process.env.APIS+`/files/${filename}`,
        method: "GET",
        responseType: "blob", // Download as blob
      });

      // Create a link element to trigger the download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Specify the file name to download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h4 className="text-2xl font-semibold text-center mb-4">Expense Manager</h4>

      <h4 className="text-xl font-semibold">Uploaded Expenses</h4>
      <ul className="space-y-4">
        {expenses.map((expense) => (
          <li key={expense._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h5 className="font-semibold">Employee: {expense.employeeId}</h5>
            <p><strong>Email:</strong> {expense.employeeEmail}</p>
            <p><strong>Expense Amount:</strong> ${expense.expenseAmount}</p>
            <p><strong>Expense Description:</strong> {expense.expenseDescription}</p>
            <p><strong>Expense Type:</strong> {expense.expenseType}</p>
            <p>
              <strong>Status:</strong>
              <span className={
  expense.status === "Pending"
    ? "bg-yellow-600 px-1 rounded text-white"
    : expense.status === "Approved"
    ? "bg-green-700 px-2 rounded text-white"
    : "bg-red-700 px-2 rounded text-white"
}>
  {expense.status}
</span>
            </p>
            <p><strong>Managers Reason:</strong> {expense.managerReason || "Not Provided"}</p>

            {/* File download button */}
            <div className="mt-4">
              <button
                onClick={() => downloadFile(expense.file)} // Trigger download on button click
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Download File
              </button>
            </div>

            {/* Update Status Section */}
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Change Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none mb-2"
              >
                <option value="">Select Status</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </select>

              {status === "Declined" && (
                <textarea
                  value={managerReason}
                  onChange={(e) => setManagerReason(e.target.value)}
                  placeholder="Add Managers Reason"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none mb-4"
                />
              )}

              <button
                onClick={() => handleUpdateStatus(expense._id)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Update Status
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseDecline;
