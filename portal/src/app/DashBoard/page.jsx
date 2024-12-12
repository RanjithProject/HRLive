
'use client';
import React, { useState } from 'react';
// import Attendance from '../pages/Attendance/page';
import Attendance from '../pages/Attentance/page';
import LeaveApplyPage from '../pages/LeaveApplyPage/page';
import ManagerEmployee from '../pages/ManagerEmployee/page';
// import HRApproval from "../pages/HRApproval/page";
import HRApproval from "../pages/HRApprovel/page";
// import ShiftManagement from '../pages/ShiftManagement/page';
// import ExpenseManager from '../pages/ExpenseDecline';

import ShiftMangement from '../pages/ShiftMangement/page';
import ExpenseDecline from '../pages/ExpenseDecline/page';

const DashBoard = () => {
  const [click, setClick] = useState('attendance');

  const menuItems = [
    { name: 'attendance' },
    { name: 'leaveapply' },
    { name: 'manageremployee' },
    { name: 'hrapproval' },
    { name: 'shiftchange' },
    { name: 'expensedecline' },
  ];

  // Handle the menu item click without causing a page refresh or navigation
  const handleMenuClick = (name) => {
    setClick(name);  // Update the state to change the displayed component
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-100 p-3 w-1/4 md:w-1/5 flex flex-col">
        <div className="text-xl font-bold mb-6">Dashboard</div>
        <ul className="flex flex-col gap-4">
          {menuItems.map(({ name }) => (
            <li
              key={name}
              className={`cursor-pointer p-2 rounded-lg transition-all flex items-center gap-2
                ${click === name ? 'bg-blue-500 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
              onClick={() => handleMenuClick(name)} // Using the handler to update the state
            >
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white">
        {click === 'attendance' && (
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Attendance Section</h2>
            <Attendance />
          </div>
        )}
        {click === 'leaveapply' && (
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Leave Application</h2>
            <LeaveApplyPage />
          </div>
        )}
        {click === 'manageremployee' && (
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Manager Employee</h2>
            <ManagerEmployee />
          </div>
        )}
        {click === 'hrapproval' && (
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">HR Approval</h2>
            <HRApproval />
          </div>
        )}
        {click === 'shiftchange' && (
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Shift Change</h2>
            <ShiftMangement/>
          </div>
        )}
        {click === 'expensedecline' && (
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Expense Decline</h2>
            <ExpenseDecline />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
