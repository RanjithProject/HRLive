'use client';
// import { useAppContext } from '@/app/Context';
import axios from 'axios';
import React, { useState} from 'react';

const ExpenseUpload = () => {
  // Getting values from context
  const { employeeId, userEmail, managerEmail, managerId } = useAppContext();
  console.log(employeeId, userEmail, managerEmail, managerId);

  // State variables for expense details
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedExpenses, setUploadedExpenses] = useState([]);
 

  // Handle expense submission
  const submitExpense = async (e) => {
    try {
      e.preventDefault();

      // FormData to send as multipart form data
      const formData = new FormData();
      formData.append('employeeId', employeeId); // from context
      formData.append('employeeEmail', userEmail); // from context
      formData.append('expenseAmount', expenseAmount);
      formData.append('expenseDescription', expenseDescription);
      formData.append('managerId', managerId); // from context
      formData.append('managerEmail', managerEmail); // from context
      formData.append('expenseType', expenseType);
      formData.append('file', file);

      // Send POST request with expense data
      const result = await axios.post(process.env.APIS+"/upload-expense", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // If the result is successful, update the UI and reset the form
      if (result.data.success) {
        alert("Expense uploaded successfully!");
        
        // Refresh the list of uploaded expenses
        setUploadedExpenses([...uploadedExpenses, { expenseType, file: file.name }]);

        // Reset form fields
        setExpenseAmount('');
        setExpenseDescription('');
        setExpenseType('');
        setFile(null);
      } else {
        alert("Error uploading expense, please try again.");
      }

    } catch (error) {
      console.log("Error uploading expense:", error);
      alert("An error occurred while uploading the expense.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h4 className="text-2xl font-semibold text-center mb-4">Upload Expense Details</h4>

      <form onSubmit={submitExpense} className="space-y-4">
        <input
          type="text"
          placeholder="Expense Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Expense Description"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Expense Type"
          value={expenseType}
          onChange={(e) => setExpenseType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Submit Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseUpload;
