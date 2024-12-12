
// // const mongoose = require('mongoose');

// // // Define the Expense schema
// // const expenseSchema = new mongoose.Schema({
// //   employeeId: { type: mongoose.Schema.Types.String, ref: 'Employee', required: true },
// //   employeeEmail: { type: String, required: true },
// //   expenseAmount: { type: Number, required: true },
// //   managerId: { type: String, required: true },
// //   managerEmail: { type: String, required: true },
// //   managerReason: { type: String, required: false },
// //   expenseType: { type: String, required: true },
// //   status: { type: String, default: 'Pending' },
// //   reason: { type: String }, // Reason provided by the manager when the expense is declined or approved
// //   file: { type: String, required: true }, // File path of the uploaded expense file
// //   fixedAmount: { type: Number, default: 4000 }, // Default fixed amount for expenses
// // });

// // const Expense = mongoose.model('ExpenseEmployeeDemo', expenseSchema);

// // module.exports = Expense;




// const mongoose = require('mongoose');

// // Define the Expense schema
// const expenseSchema = new mongoose.Schema({
//   employeeId: { type: mongoose.Schema.Types.String, ref: 'Employee', required: true },
//   employeeEmail: { type: String, required: true },
//   expenseAmount: { type: Number, required: true },
//   managerId: { type: String, required: true },
//   managerEmail: { type: String, required: true },
//   managerReason: { type: String, required: false },
//   expenseType: { type: String, required: true },
//   status: { type: String, default: 'Pending' },
//   reason: { type: String },  // Reason provided by the manager when the expense is declined or approved
// });

// // Create the Expense model
// const Expense = mongoose.model('ExpenseEmployee', expenseSchema);

// module.exports = Expense;






const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.String, ref: 'Employee', required: true },
  employeeEmail: { type: String, required: true },
  expenseAmount: { type: Number, required: true },
  expenseDescription: { type: String, required: true },
  managerId: { type: String, required: true },
  managerEmail: { type: String, required: true },
  expenseType: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  reason: { type: String },  // Reason provided by the manager when the expense is declined or approved
  file: { type: String, required: true }, // Store the filename of the uploaded file
});

const Expense = mongoose.model('ExpenseDemo', expenseSchema);

module.exports = Expense;
