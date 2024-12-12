const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files")); // Serve files from the "files" folder

// MongoDB connection string
const mongoUrl = "mongodb+srv://ranjithdevwemo2:ranjithdevwemo2@cluster0.3ckmctb.mongodb.net/FilesManager1"; 

// MongoDB connection
mongoose.connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((error) => {
    console.error("MongoDB connection failed: ", error);
  });

// Define Mongoose schema for expense details
const expenseDetailsSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  expenseAmount: { type: Number, required: true },
  expenseDescription: { type: String, required: true },
  managerId: { type: String, required: true },
  managerEmail: { type: String, required: true },
  expenseType: { type: String, required: true },
  file: { type: String, required: true }, // Store filename for the uploaded file
  status: { type: String, default: 'Pending' }, // Status of the expense
  managerReason: { type: String }  // Manager's reason for approval/decline
}, {
  collection: "ExpenseDetails" // specify the collection name
});

// Create a model from the schema
const ExpenseDetails = mongoose.model('ExpenseDetails', expenseDetailsSchema);

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

// Multer middleware setup
const upload = multer({ storage: storage });

// File upload route
app.post('/upload-expense', upload.single('file'), async (req, res) => {
  try {
    const { employeeId, employeeEmail, expenseAmount, expenseDescription, managerId, managerEmail, expenseType } = req.body;
    const fileName = req.file.filename; // Get the filename

    const expense = new ExpenseDetails({
      employeeId,
      employeeEmail,
      expenseAmount,
      expenseDescription,
      managerId,
      managerEmail,
      expenseType,
      file: fileName
    });

    await expense.save();

    res.json({ success: true, message: 'Expense uploaded successfully' });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ success: false, message: "Error uploading expense", error });
  }
});

// Get all uploaded expenses
app.get("/get-files", async (req, res) => {
  try {
    const files = await ExpenseDetails.find();
    res.json({ success: true, files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.json({ success: false, message: "Error fetching files", error });
  }
});

// Update expense status and manager reason (approve/decline)
app.put("/update-expense/:id", async (req, res) => {
  const { id } = req.params;
  const { status, managerReason } = req.body;

  try {
    // Find the expense by ID and update it
    const expense = await ExpenseDetails.findByIdAndUpdate(
      id, 
      { status, managerReason },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense updated successfully', expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ success: false, message: "Error updating expense", error });
  }
});

// Download a file by filename
app.get("/files/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'files', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ success: false, message: "Error downloading file", err });
    }
  });
});

// Test route to check server connection
app.get('/', (req, res) => {
  res.json({ success: true, message: "Connected successfully" });
});

// Server listening on port 4000
app.listen(4000, () => {
  console.log("Server is running successfully at http://localhost:4000");
});
