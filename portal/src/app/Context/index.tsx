// 'use client';
// import { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// // Create a Context for the app
// const AppContext = createContext(null);

// // Context Provider component
// export function AppWrapper({ children }) {
//   const [userName, setUserName] = useState(null);
//   const [employeeId,setEmployeeId]=useState(null);
// const [userEmail,setUserEmail]=useState(null);
// const [userRole,setuserRole]=useState(null);
// const [managerEmail,setManagerEmail]=useState(null);
// const [managerId,setManagerId]=useState(null);
//   // Fetch user details
//   const fetchUserDetails = async () => {
//     try {
//       const res = await axios.get('/api/users/me');
// setManagerId(res.data.data.managerId);
//       setManagerEmail(res.data.data.managerEmail);
//       setUserName(res.data.data.username); 
//       setEmployeeId(res.data.data.employeeId);
//       setUserEmail(res.data.data.email);
//       setuserRole(res.data.data.userrole);
//     } catch (error) {
//       console.log(error.message);
//       setUserName(null); 
//     }
//   };

// console.log("managerEmail : ",managerEmail);
// console.log("managerId : ",managerId);



//   // Update the user details by calling the fetch function
//   const updateUserDetails = () => {
//     fetchUserDetails();
//   };

//   // Fetch user details when the component mounts
//   useEffect(() => {
//     fetchUserDetails();
//   }, []);


//   // const API="http://localhost:4000";
//   const API="https://hrprojectlive-server.onrender.com";

//   return (
//     <AppContext.Provider value={{employeeId, userName, updateUserDetails ,userEmail,userRole,
//     managerEmail,managerId,API}}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// // Custom hook to use the app context
// export function useAppContext() {
//   return useContext(AppContext);
// }




'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Define the type for the context value
interface AppContextType {
  employeeId: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  managerEmail: string | null;
  managerId: string | null;
  API: string;
  updateUserDetails: () => void;
}

// Create a Context for the app with the type AppContextType
const AppContext = createContext<AppContextType | null>(null); // Default to null

// Define the type for the props of AppWrapper to include children
interface AppWrapperProps {
  children: ReactNode;
}

// Context Provider component
export function AppWrapper({ children }: AppWrapperProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setuserRole] = useState<string | null>(null);
  const [managerEmail, setManagerEmail] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string | null>(null);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setManagerId(res.data.data.managerId);
      setManagerEmail(res.data.data.managerEmail);
      setUserName(res.data.data.username); 
      setEmployeeId(res.data.data.employeeId);
      setUserEmail(res.data.data.email);
      setuserRole(res.data.data.userrole);
    } catch (error: unknown) {
      if (error instanceof Error) {
      console.log(error.message);
      }else {
        console.log('An unexpected error occurred');
      }
    }
  };

  console.log("managerEmail : ", managerEmail);
  console.log("managerId : ", managerId);

  // Update the user details by calling the fetch function
  const updateUserDetails = () => {
    fetchUserDetails();
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const API = "https://hrprojectlive-server.onrender.com";
  // const API="http://localhost:4000";

  return (
    <AppContext.Provider value={{ employeeId, userName, updateUserDetails, userEmail, userRole, managerEmail, managerId, API }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppWrapper');
  }
  return context;
}
