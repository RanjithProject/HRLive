// import mongoose, { Schema } from 'mongoose';

// // Define the shift schema
// const shiftSchema = new Schema({
//   shiftType: {
//     type: String,
//     enum: ['morning', 'midshift', 'nightshift'],
//     required: true,
//     default: 'morning',
//   },
//   startTime: {
//     type: Date,
//     required: true,
//     default: function() {
//       const date = new Date();
//       switch (this.shiftType) {
//         case 'morning':
//           date.setHours(9, 0, 0, 0);
//           break;
//         case 'midshift':
//           date.setHours(14, 0, 0, 0);
//           break;
//         case 'nightshift':
//           date.setHours(18, 0, 0, 0);
//           break;
//         default:
//           date.setHours(9, 0, 0, 0);
//           break;
//       }
//       return date;
//     }
//   },
//   endTime: {
//     type: Date,
//     required: true,
//     default: function() {
//       const date = new Date();
//       switch (this.shiftType) {
//         case 'morning':
//           date.setHours(18, 0, 0, 0);
//           break;
//         case 'midshift':
//           date.setHours(23, 0, 0, 0);
//           break;
//         case 'nightshift':
//           date.setHours(3, 0, 0, 0);
//           break;
//         default:
//           date.setHours(18, 0, 0, 0);
//           break;
//       }
//       return date;
//     }
//   },
//   shiftName: {
//     type: String,
//     required: true,
//     default: function() {
//       switch (this.shiftType) {
//         case 'morning':
//           return 'Morning Shift';
//         case 'midshift':
//           return 'Mid Shift';
//         case 'nightshift':
//           return 'Night Shift';
//         default:
//           return 'Morning Shift';
//       }
//     }
//   },
// });

// // Define the user schema
// const userSchema = new Schema({
//   employeeId: {
//     type: String,
//     required: [true, "Please provide an Employee Id"],
//     unique: true,
//   },
//   username: {
//     type: String,
//     required: [true, "Please provide a username"],
//   },
//   userrole: {
//     type: String,
//     required: [true, "Please provide a role"],
//     enum: ['employee', 'hr', 'manager'],
//     message: '{VALUE} is not a valid role',
//   },
//   email: {
//     type: String,
//     required: [true, "Please provide an email address"],
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Please provide a password"],
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   forgotPasswordToken: String,
//   forgotPasswordTokenExpiry: Date,
//   verifyToken: String,
//   verifyTokenExpiry: Date,
//   shift: {
//     type: shiftSchema,
//     required: false,
//   },
// });

// // Define the User model using the schema
// let User;

// if (mongoose.modelNames().includes("EmployeeModelDemo12")) {
//   User = mongoose.model("EmployeeModelDemo12");
// } else {
//   User = mongoose.model("EmployeeModelDemo12", userSchema);
// }

// export default User;













import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Shift Schema (with TypeScript type annotations)
const shiftSchema = new Schema(
  {
    shiftType: {
      type: String,
      enum: ['morning', 'midshift', 'nightshift'],
      required: true,
      default: 'morning',
    },
    startTime: {
      type: Date,
      required: true,
      default: function (this: { shiftType: string }) {
        const date = new Date();
        switch (this.shiftType) {
          case 'morning':
            date.setHours(9, 0, 0, 0);
            break;
          case 'midshift':
            date.setHours(14, 0, 0, 0);
            break;
          case 'nightshift':
            date.setHours(18, 0, 0, 0);
            break;
          default:
            date.setHours(9, 0, 0, 0);
            break;
        }
        return date;
      },
    },
    endTime: {
      type: Date,
      required: true,
      default: function (this: { shiftType: string }) {
        const date = new Date();
        switch (this.shiftType) {
          case 'morning':
            date.setHours(18, 0, 0, 0);
            break;
          case 'midshift':
            date.setHours(23, 0, 0, 0);
            break;
          case 'nightshift':
            date.setHours(3, 0, 0, 0);
            break;
          default:
            date.setHours(18, 0, 0, 0);
            break;
        }
        return date;
      },
    },
    shiftName: {
      type: String,
      required: true,
      default: function (this: { shiftType: string }) {
        switch (this.shiftType) {
          case 'morning':
            return 'Morning Shift';
          case 'midshift':
            return 'Mid Shift';
          case 'nightshift':
            return 'Night Shift';
          default:
            return 'Morning Shift';
        }
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Define the User Schema with TypeScript types
interface IShift {
  shiftType: 'morning' | 'midshift' | 'nightshift';
  startTime: Date;
  endTime: Date;
  shiftName: string;
}

interface IUser extends Document {
  employeeId: string;
  username: string;
  userrole: 'employee' | 'hr' | 'manager';
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  shift?: IShift;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  employeeId: {
    type: String,
    required: [true, 'Please provide an Employee Id'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
  },
  userrole: {
    type: String,
    required: [true, 'Please provide a role'],
    enum: ['employee', 'hr', 'manager'],
    message: '{VALUE} is not a valid role',
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  shift: {
    type: shiftSchema,
    required: false, // optional shift information
  },
});

// Define and export the User model
const User: Model<IUser> =
  mongoose.modelNames().includes('EmployeeModelDemo12')
    ? mongoose.model<IUser>('EmployeeModelDemo12')
    : mongoose.model<IUser>('EmployeeModelDemo12', userSchema);

export default User;
