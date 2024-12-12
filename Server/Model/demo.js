const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./Model/Employee');
const config = require('./DBConfig/Config');
const app = express();
const { Client } = require('pg');
const bcrypt = require('bcrypt');
//import the postgreSQL

// const {connection}=require('./DBConfig/PostgreSQL');
const port = 4000;
// const moment=require('moment');
const moment = require('moment-timezone');
const Employee = require('./Model/Employee');
const Expense=require("./Model/Expense");
app.use(cors());
app.use(express.json());

// Database connection
config();

//PostgreSQL connections
// connection;

// PostgreSQL client setup
const connection = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'devwemo',
  database: 'HRPORTAL',
});

// Connect to PostgreSQL
connection.connect()
    .then(() => console.log('PostgreSQL is connected'))
    .catch((err) => console.error('Connection error: ', err));


// Sign Up endpoint (create a new employee)
app.post('/signup', async (req, res) => {
  try {
      const { employee_id, username, userrole, email, password } = req.body;

      if (!employee_id || !username || !userrole || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if the email or username already exists
      const checkUserQuery = 'SELECT * FROM Employee WHERE email = $1 OR username = $2';
      const result = await connection.query(checkUserQuery, [email, username]);

      if (result.rows.length > 0) {
          return res.status(400).json({ message: 'Email or username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new employee into the database
      const insertQuery = 'INSERT INTO Employee (employee_id, username, userrole, email, password) VALUES ($1, $2, $3, $4, $5)';
      const insertResult = await connection.query(insertQuery, [employee_id, username, userrole, email, hashedPassword]);

      res.status(201).json({
          message: 'Employee signed up successfully',
          success:true,
          employee: {
              employee_id: employee_id,
              username: username,
              userrole: userrole,
              email: email
          }
      });
  } catch (error) {
      console.error('Error during signup: ', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



// Login endpoint (authenticate employee)
app.post('/login', async (req, res) => {
  try {
      const { employee_id, username, email, password } = req.body;

      // Ensure that either employee_id, username, or email is provided
      if (!employee_id && !username && !email) {
          return res.status(400).json({ message: 'Employee ID, username, or email is required' });
      }

      // Query to find the employee by employee_id, username, or email
      let query = 'SELECT * FROM Employee WHERE ';
      let values = [];

      if (employee_id) {
          query += 'employee_id = $1';
          values.push(employee_id);
      } else if (username) {
          query += 'username = $1';
          values.push(username);
      } else if (email) {
          query += 'email = $1';
          values.push(email);
      }

      // Execute the query
      const result = await connection.query(query, values);

      // Check if employee exists
      if (result.rows.length === 0) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const employee = result.rows[0];

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, employee.password);

      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Return the authenticated employee's details
      res.status(200).json({
          message: 'Login successful',
          success:true,
          employee: {
              employee_id: employee.employee_id,
              username: employee.username,
              userrole: employee.userrole,
              email: employee.email
          }
      });
  } catch (error) {
      console.error('Error during login: ', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Home route
app.get('/', async (req, res) => {
  try {
    res.json({ success: true, message: 'API is working' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/getAllEmployees',async(req,res)=>{
  try{
    const allEmployee=await User.find({});
    if(!allEmployee){
      res.json({message:"not found"});
    }
    res.json({success:true,message:"get all values",data:allEmployee});
  }catch(error){
    res.json({success:false,message:"server error",error});
  }
})


// Update the leave status (approved/rejected) and record the approver's role
app.patch('/api/updateLeaveStatus/:employeeId/:leaveId', async (req, res) => {
  const { employeeId, leaveId } = req.params;
  const { leaveStatus, approvedByRole } = req.body; // The new leave status and the approver's role

  // Validate leaveStatus
  if (!['approved', 'rejected'].includes(leaveStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid leave status. It must be "approved" or "rejected".'
    });
  }

  // Validate that approvedByRole is provided and is either 'hr' or 'manager'
  if (!approvedByRole || !['hr', 'manager'].includes(approvedByRole)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid approver role. It must be "hr" or "manager".'
    });
  }

  try {
    // Find the employee by employeeId
    const employee = await User.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.'
      });
    }

    // Find the leave application in the employee's leave array
    const leaveIndex = employee.leave.findIndex(leave => leave._id.toString() === leaveId);

    if (leaveIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found.'
      });
    }

    // Update the leave status and approvedByRole (instead of approvedBy ID)
    employee.leave[leaveIndex].leaveStatus = leaveStatus;
    employee.leave[leaveIndex].approvedBy = approvedByRole;  // Store the role of the approver (hr or manager)
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Leave status updated to ${leaveStatus}`,
      data: employee.leave[leaveIndex]  // Return the updated leave entry
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, unable to update leave status.',
      error: error.message
    });
  }
});





// Get the current login status of a user
app.get('/api/login-status', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const lastLogin = user.worktimestamp[user.worktimestamp.length - 1];
    const status = lastLogin ? lastLogin.action : 'Sign Out';

    res.status(200).json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching login status' });
  }
});

const shiftFormats = ['Morning', 'Evening', 'Night'];

// Middleware to check if the user exists
const checkUserExists = async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



app.get('/api/todayLeaveApplications/:managerId', async (req, res) => {
  try {
    const { managerId } = req.params; // Get managerId from request parameters

    if (!managerId) {
      return res.status(400).json({
        success: false,
        message: 'Manager ID is required.',
      });
    }

    const currentDate = moment().format('YYYY-MM-DD');

    // Fetch employees who are linked to the provided manager and whose leave is applied today
    const employeesWithTodaysLeave = await User.find({
      userrole: 'employee', // Only fetch employees
      'managerId': managerId, 
      'leave.appliedAt': {
        $gte: new Date(`${currentDate}T00:00:00.000Z`),
        $lt: new Date(`${currentDate}T23:59:59.999Z`),
      },
    });

    if (employeesWithTodaysLeave.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No leave applications for today from the managed employees.',
        data: [],
      });
    }

    // Filter and map employee data with leave status for today
    const todaysLeaveApplications = employeesWithTodaysLeave.map((employee) => {
      // Filter leaves only applied today
      const todaysLeaves = employee.leave.filter((leave) =>
        moment(leave.appliedAt).format('YYYY-MM-DD') === currentDate
      );
      return {
        employeeId: employee.employeeId,
        username: employee.username,
        email: employee.email,
        todaysLeaves, // Include only today's leave applications
      };
    });

    res.status(200).json({
      success: true,
      message: "Successfully fetched today's leave applications from managed employees.",
      data: todaysLeaveApplications,
    });
  } catch (error) {
    console.error('Error fetching today\'s leave applications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
});





app.patch('/api/employee/shift/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const { shiftFormat } = req.body;

  // Validate shift format
  if (!shiftFormats.includes(shiftFormat)) {
    return res.status(400).json({
      success: false,
      message: `Invalid shift format. Choose one from ${shiftFormats.join(', ')}`
    });
  }

  try {
    const employee = await User.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Update the shift format
    employee.shiftFormat = shiftFormat;
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Shift format updated to ${shiftFormat} for employee ${employeeId}`,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});



app.patch('/api/login', checkUserExists, async (req, res) => {
  const { username, action, timestamp } = req.body;

  try {
    const user = req.user; // Access user object from middleware

    // Get current time in IST and format it in the desired format (DD/MM/YYYY hh:mm A)
    const currentTime = moment().tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm A');
    
    // Fetch shift details from the user's shift object
    const shift = user.shift; 
    const shiftName = shift ? shift.shiftName : 'No shift assigned';
    const startTime = shift ? moment(shift.startTime).tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm A') : 'N/A';
    const endTime = shift ? moment(shift.endTime).tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm A') : 'N/A'; 

    // Log shift details and current time
    console.log(`Employee: ${username}, Action: ${action}, Shift: ${shiftName}, Shift Start: ${startTime}, Shift End: ${endTime}, Current Time: ${currentTime}`);

    // Format the provided timestamp to "DD/MM/YYYY hh:mm A"
    const formattedTimestamp = moment(timestamp).tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm A');

    // Validate action
    if (!['Sign In', 'Sign Out'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Use "Sign In" or "Sign Out".' });
    }

    // Ensure the user is signing in according to their shift
    if (action === 'Sign In') {
      // Check if the timestamp is after or equal to the shift start time
      const now = moment(timestamp).tz('Asia/Kolkata'); // Current time in IST
      const shiftStart = moment(shift.startTime).tz('Asia/Kolkata');

      // Check if current time is before the shift start time
      if (now.isBefore(shiftStart)) {
        return res.status(400).json({
          message: `You cannot sign in before your shift starts at ${startTime}`
        });
      }
    }

    // Validate if the user already performed the same action consecutively
    const lastAction = user.worktimestamp[user.worktimestamp.length - 1]; // Get the last action logged
    if (lastAction && lastAction.action === action) {
      return res.status(400).json({ error: 'Action is already the same' });
    }

    // Log the action and timestamp to the user's worktimestamp
    user.worktimestamp.push({
      action,
      timestamp: new Date(timestamp),
      breaktimestamp: [] 
    });

    // Save the updated user data to the database
    await user.save();

    // Respond with success
    res.status(200).json({
      message: 'Action logged successfully',
      shiftName,
      shiftStart: startTime,
      shiftEnd: endTime,
      currentTimestamp: currentTime, 
      actionTimestamp: formattedTimestamp, 
    });

  } catch (error) {
    // Handle errors
    console.error('Error logging action:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






app.patch('/api/break', checkUserExists, async (req, res) => {
  const { username, status, timestamp } = req.body;

  if (!['Break In', 'Break Out'].includes(status)) {
    return res.status(400).json({ error: 'Invalid break status. Must be "Break In" or "Break Out".' });
  }

  try {
    const user = req.user; // Access user object from middleware
    const lastAction = user.worktimestamp[user.worktimestamp.length - 1];

    if (!lastAction || lastAction.action !== 'Sign In') {
      return res.status(400).json({ error: 'User must be signed in to take a break.' });
    }

    const currentShift = user.shiftFormat;
    if (currentShift === 'Morning' && moment(timestamp).hour() < 9) {
      return res.status(400).json({ error: 'Breaks are not allowed before 9:00 AM for morning shift.' });
    }

    if (currentShift === 'Evening' && (moment(timestamp).hour() < 17 || moment(timestamp).hour() > 23)) {
      return res.status(400).json({ error: 'Breaks are not allowed between 5:00 PM and 11:59 PM for evening shift.' });
    }

    if (currentShift === 'Night' && moment(timestamp).hour() < 18) {
      return res.status(400).json({ error: 'Breaks are not allowed before 6:00 PM for night shift.' });
    }

    // Handle Break In / Break Out logic
    if (status === 'Break In') {
      lastAction.breaktimestamp.push({ status: 'Break In', timestamp: new Date(timestamp) });
    } else {
      lastAction.breaktimestamp.push({ status: 'Break Out', timestamp: new Date(timestamp) });
    }

    await user.save();
    res.status(200).json({ message: `${status} action recorded successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Server error occurred while logging break action.', message: error.message });
  }
});




// Get the login history of a user
app.get('/api/login-history', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Return the user's worktimestamp (login/logout history)
    res.status(200).json({ history: user.worktimestamp });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/employee/leavestatus", async (req, res) => {
  try {
    // Get the employeeId from the query parameters
    const { employeeId } = req.query;
    console.log("Employee ID:", employeeId); 
    
    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required" });
    }

    // Find the employee by their employeeId
    const employee = await User.findOne({ employeeId: employeeId });  // Corrected this line
    
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Return the leave data of the employee
    res.json({
      success: true,
      data: employee.leave,  // Assuming `leave` is an array field containing the leave details
    });
  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


app.post('/api/leave/request', async (req, res) => {
  try {
    // Extract leave request data from the request body
    const {name, employeeId, leaveType, fromDate, toDate, reason } = req.body;
console.log(name, employeeId, leaveType, fromDate, toDate, reason);

    // Validate input fields
    if (!name||!employeeId || !leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new leave request object
    const leaveRequest = {
      employeeId,
      name,
      leaveType,
      fromDate,
      toDate,
      reason,
      leaveStatus: 'pending', 
    };

    // Find the employee by their employeeId
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Add leave request to the employee's leave array
    user.leave.push(leaveRequest);
    await user.save(); 

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Leave request submitted successfully',
      leaveRequest: leaveRequest,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// HR Update Employee Profile Endpoint: PUT /hr/update-employee
app.put('/hr/update-employee', async (req, res) => {
  const { hrId, hrEmail, employeeId, employeeEmail } = req.body;

  if (!hrId || !hrEmail || !employeeId || !employeeEmail) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: hrId, hrEmail, employeeId, employeeEmail',
    });
  }

  try {
    // Find the employee by employeeId and employeeEmail
    const employee = await Employee.findOne({ employeeId, email: employeeEmail });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found with the provided employeeId and employeeEmail',
      });
    }

    // Check if the employee is already associated with the HR by employeeId
    const existingHrByEmployeeId = await Employee.findOne({ 'hrEmployees.employeeId': employeeId });
    if (existingHrByEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'This employee is already assigned.',
      });
    }

    // Check if the employee is already associated with the HR by employeeEmail
    const existingHrByEmployeeEmail = await Employee.findOne({ 'hrEmployees.employeeEmail': employeeEmail });
    if (existingHrByEmployeeEmail) {
      return res.status(400).json({
        success: false,
        message: 'This employee is already assigned.',
      });
    }

    // Find the HR record
    const hr = await Employee.findOne({ userrole: 'hr', employeeId: hrId, email: hrEmail });

    if (!hr) {
      return res.status(404).json({
        success: false,
        message: 'HR not found with the provided hrId and hrEmail',
      });
    }

    // Step 3: Update the HR's hrEmployees array with the employee's info
    const hrUpdateResult = await Employee.updateOne(
      { _id: hr._id, userrole: 'hr' },
      { $push: { hrEmployees: { employeeId, employeeEmail } } }
    );

    if (hrUpdateResult.nModified === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update HR employees list.',
      });
    }

    // Step 4: Update the employee's profile with the HR info
    const employeeUpdateResult = await Employee.updateOne(
      { _id: employee._id, userrole: 'employee' },
      { $set: { hrId, hrEmail } }
    );

    if (employeeUpdateResult.nModified === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update employee profile.',
      });
    }

    // Step 5: Respond with success
    res.status(200).json({
      success: true,
      message: 'Employee profile updated successfully by HR.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating employee details.',
    });
  }
});


// Manager Update Employee Profile Endpoint: PUT /manager/update-employee
app.put('/manager/update-employee', async (req, res) => {
  const { managerId, managerEmail, employeeId, employeeEmail } = req.body;
console.log(managerId, managerEmail, employeeId, employeeEmail);

  try {
    // Step 1: Find the employee by using employeeId and employeeEmail
    const employee = await Employee.findOne({ employeeId, email: employeeEmail });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found. Please provide the correct employeeId and employeeEmail.',
      });
    }

    // Check if the employee is already associated with the Manager by employeeId
    const existingManagerByEmployeeId = await Employee.findOne({ 'managerEmployees.employeeId': employeeId });
    if (existingManagerByEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'This employee is already assigned .',
      });
    }

    // Check if the employee is already associated with the Manager by employeeEmail
    const existingManagerByEmployeeEmail = await Employee.findOne({ 'managerEmployees.employeeEmail': employeeEmail });
    if (existingManagerByEmployeeEmail) {
      return res.status(400).json({
        success: false,
        message: 'This employee is already assigned .',
      });
    }

    // Step 2: Find the Manager by managerId and managerEmail
    const manager = await Employee.findOne({ userrole: 'manager', employeeId: managerId, email: managerEmail });

    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found. Please provide the correct managerId and managerEmail.',
      });
    }

    // Step 3: Update the manager's managerEmployees list with employeeId and employeeEmail
    const managerUpdateResult = await Employee.updateOne(
      { _id: manager._id, userrole: 'manager' },
      { $push: { managerEmployees: { employeeId, employeeEmail } } }
    );

    if (managerUpdateResult.nModified === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update manager employees list.',
      });
    }

    // Step 4: Update the employee's profile with managerId and managerEmail
    const employeeUpdateResult = await Employee.updateOne(
      { _id: employee._id, userrole: 'employee' },
      { $set: { managerId, managerEmail } }
    );

    if (employeeUpdateResult.nModified === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update employee profile.',
      });
    }

    // Step 5: Return success response
    res.status(200).json({
      success: true,
      message: 'Employee profile updated successfully by Manager.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});


app.put('/leave/approve/:leaveRequestId', async (req, res) => {
  try {
    // const { leaveRequestId } = req.params;
    const { status, adminComments, approvedBy ,leaveRequestId} = req.body;  // Expected status: 'approved' or 'rejected'

    // Validate input fields
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. It should be either approved or rejected' });
    }

    // Find the leave request by its ID
    const leaveApproval = await LeaveApproval.findById(leaveRequestId);
    if (!leaveApproval) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Check if leave is already approved or rejected
    if (leaveApproval.status !== 'pending') {
      return res.status(400).json({ error: 'Leave request has already been processed' });
    }

    // Update the leave status
    leaveApproval.status = status;  // 'approved' or 'rejected'
    leaveApproval.adminComments = adminComments || '';  // Optional comments
    leaveApproval.approvedBy = approvedBy;  // HR/Manager ID
    leaveApproval.approvalDate = new Date();  // Set the approval date

    // Save the updated leave approval document
    await leaveApproval.save();

    // Also update the employee's leave status
    const user = await User.findById(leaveApproval.user);
    const leaveIndex = user.leave.findIndex((leave) => leave._id.toString() === leaveRequestId);
    if (leaveIndex !== -1) {
      user.leave[leaveIndex].leaveStatus = status; // Update the employee's leave status
      await user.save();  // Save the updated user document
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: `Leave request ${status}`,
      leaveRequest: leaveApproval,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.put('/api/changeEmployeeShift', async (req, res) => {
  try {
    // Destructure the request body to get the employeeId and the new shift type
    const { employeeId, shiftType } = req.body;

    // Basic validation for the required fields
    if (!employeeId || !shiftType) {
      return res.status(400).json({
        success: false,
        message: "employeeId and shiftType are required."
      });
    }

    // Validate the shiftType (it should be one of the valid shift types)
    const validShiftTypes = ['morning', 'midshift', 'nightshift'];
    if (!validShiftTypes.includes(shiftType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shiftType. Allowed values are 'morning', 'midshift', or 'nightshift'."
      });
    }

    // Find the employee by employeeId
    const employee = await User.findOne({ employeeId });

    // If employee not found, return an error message
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID ${employeeId} not found.`
      });
    }

    // Determine the shift timings and shift name based on the selected shift type
    let startTime, endTime, shiftName;

    switch (shiftType) {
      case 'morning':
        shiftName = 'Morning Shift';
        startTime = new Date().setHours(9, 0, 0, 0); // 9:00 AM
        endTime = new Date().setHours(18, 0, 0, 0);  // 6:00 PM
        break;
      case 'midshift':
        shiftName = 'Mid Shift';
        startTime = new Date().setHours(14, 0, 0, 0); // 2:00 PM
        endTime = new Date().setHours(23, 0, 0, 0);  // 11:00 PM
        break;
      case 'nightshift':
        shiftName = 'Night Shift';
        startTime = new Date().setHours(18, 0, 0, 0); // 6:00 PM
        endTime = new Date().setHours(3, 0, 0, 0);   // 3:00 AM (next day)
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid shiftType provided."
        });
    }

    // Update the employee's shift information
    const updatedShift = {
      shiftType,
      shiftName,
      startTime,
      endTime
    };

    // Update the shift information in the database
    employee.shift = updatedShift;

    // Save the updated employee document
    await employee.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: `Employee's shift has been successfully updated to ${shiftName}.`,
      data: employee
    });

  } catch (error) {
    console.error('Error updating employee shift:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message
    });
  }
});


const multer = require('multer');
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files'); // Set destination folder for the uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Generate unique file name
  }
});

//Multer middleware setup
const upload = multer({ storage: storage });


// Route to apply for an expense
app.post('/upload-expense', upload.single('file'), async (req, res) => {
  const { employeeId, employeeEmail, expenseAmount, expenseDescription, managerId, managerEmail, expenseType } = req.body;
  const fileName = req.file.filename; // Get the filename

  // Validate required fields
  if (!employeeId || !employeeEmail || !expenseAmount || !expenseDescription || !managerId || !managerEmail || !expenseType || !req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: employeeId, employeeEmail, expenseAmount, expenseDescription, managerId, managerEmail, expenseType, file.',
    });
  }

  try {
    // Verify if the employee exists in the database
    const employee = await Employee.findOne({ employeeId, email: employeeEmail });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Check if the manager matches
    if (employee.managerId !== managerId || employee.managerEmail !== managerEmail) {
      return res.status(403).json({ success: false, message: 'Unauthorized: The specified manager is not assigned to the given employee.' });
    }

    // Create a new expense request with status 'Pending'
    const expense = new Expense({
      employeeId,
      employeeEmail,
      expenseAmount,
      expenseDescription,
      managerId,
      managerEmail,
      expenseType,
      status: 'Pending',
      file: req.file.filename, 
    });

    // Save the new expense record to the database
    await expense.save();

    res.status(201).json({
      success: true,
      message: 'Expense application submitted successfully.',
      expense,
    });
  } catch (error) {
    console.error('Error while applying for expense:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while applying for the expense.',
    });
  }
});




// Route for the manager to decline/approve an expense
app.put('/update-expense/:id', async (req, res) => {
  const { expenseId, managerId, managerEmail, status, reason } = req.body;

  // Validate required fields
  if (!expenseId || !managerId || !managerEmail || !status) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: expenseId, managerId, managerEmail, status',
    });
  }

  try {
    // Find the expense in the database
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found.',
      });
    }

    // Verify if the manager is authorized to update the expense status
    if (expense.managerId !== managerId || expense.managerEmail !== managerEmail) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You are not the correct manager for this expense.',
      });
    }

    // If the status is 'Declined', we need to set the reason
    if (status === 'Declined' && !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for declining the expense.',
      });
    }

    // If the status is 'Approved', reason can be left blank
    if (status === 'Approved') {
      expense.managerReason = 'Approved'; // Optional reason for approved status
    } else if (status === 'Declined' && reason) {
      expense.managerReason = reason; // Store the reason for decline
    }

    // Update the status of the expense
    expense.status = status;

    // Save the updated expense
    await expense.save();

    // Respond with success and updated expense data
    res.status(200).json({
      success: true,
      message: `Expense has been ${status.toLowerCase()}.`,
      expense,
    });
  } catch (error) {
    console.error('Error while updating expense status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the expense.',
    });
  }
});




// Route to fetch all expenses by managerId
app.get('/getAll/expenses', async (req, res) => {
  try {
    const { managerId } = req.query;

    // Filter expenses by managerId if provided
    let filter = {};
    if (managerId) {
      filter.managerId = managerId;
    }

    const allExpenses = await Expense.find(filter);
    if (allExpenses.length === 0) {
      return res.json({ success: false, message: 'No expenses found for the provided manager.' });
    }

    res.json({
      success: true,
      message: 'Fetched all expense details.',
      allExpenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching expenses.',
    });
  }
});

// Get all uploaded expenses
app.get("/get-files", async (req, res) => {
  try {
    const files = await Expense.find();
    res.json({ success: true, files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.json({ success: false, message: "Error fetching files", error });
  }
});




// Route for downloading expense files
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ success: false, message: "Error downloading file", err });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




