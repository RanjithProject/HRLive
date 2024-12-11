'use client';

import { useAppContext } from '@/app/Context';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const { employeeId, API } = useAppContext(); // Get the employeeId from context
  console.log("Employee ID: ", employeeId);

  // Fetch the list of expenses based on employeeId
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // Make the API call with employeeId
        const response = await axios.get(API + `/getAll/expenses/employeeId?employeeId=${employeeId}`);
        
        // Check if there are expenses
        if (response.data.success) {
          setExpenses(response.data.allExpenses); // Update state with fetched expenses
        } else {
          alert('No expenses found for the provided employee.');
        }
      } catch (error) {
        console.log('Error fetching expenses:', error);
        alert('Failed to fetch expenses.');
      }
    };

    if (employeeId) {
      fetchExpenses(); // Only fetch if employeeId is available
    }
  }, [employeeId,API]); // Run this effect when employeeId changes
  console.log(expenses);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h4 className="text-2xl font-semibold text-center mb-4">Expense Manager</h4>

      <h4 className="text-xl font-semibold">Uploaded Expenses</h4>
      <ul className="space-y-4">
        {expenses.map((expense) => (
          <li key={expense._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h5 className="font-semibold">Employee: {expense.employeeId.replace(/'/g, '&apos;')}</h5> {/* Escape single quote */}
            <p><strong>Email:</strong> {expense.employeeEmail.replace(/'/g, '&apos;')}</p> {/* Escape single quote */}
            <p><strong>Expense Amount:</strong> ${expense.expenseAmount}</p>
            <p><strong>Expense Description:</strong> {expense.expenseDescription.replace(/'/g, '&apos;')}</p> {/* Escape single quote */}
            <p><strong>Expense Type:</strong> {expense.expenseType.replace(/'/g, '&apos;')}</p> {/* Escape single quote */}
            <p><strong>Status:</strong>
              <span
                className={
                  expense.status === "Pending"
                    ? "bg-yellow-200 p-1 rounded text-white"
                    : expense.status === "Approved"
                    ? "bg-green-400 p-1 rounded text-white"
                    : "bg-red-600 p-1 rounded text-white"
                }
              >
                {expense.status}
              </span>
            </p>
            <p><strong>Managers Reason:</strong> {expense.managerReason ? expense.managerReason.replace(/'/g, '&apos;') : 'Not Provided'}</p> {/* Escape single quote */}

            {/* File download button */}
            <div className="mt-4">
              <button
                onClick={() => downloadFile(expense.file)}  // Trigger download on button click
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Download File
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Function to download the file
const downloadFile = async (filename) => {
  try {
    const response = await axios({
      url: `http://localhost:4000/files/${filename}`,  // Adjust URL as needed
      method: 'GET',
      responseType: 'blob', 
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  
  } catch (error) {
    console.log('Error downloading file:', error);
    alert('Failed to download file');
  }
};

export default ExpenseManager;
