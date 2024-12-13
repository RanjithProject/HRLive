import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppWrapper } from "./Context";
import NavBar from "@/app/pages/NavBar/page";
// import SideBar from "./components/SideBar/page";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AppWrapper>
        <NavBar/>
        {/* <SideBar/> */}
        {children}
        </AppWrapper>
      </body>
    </html>
  );
}











// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// import { AppWrapper } from "./Context";
// import NavBar from "@/app/components/NavBar/page";
// import SideBar from "./components/SideBar/page";
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <AppWrapper>
//           <div className="flex min-h-screen">
//             <NavBar/>
//             {/* Sidebar/NavBar */}
//             <div className="w-64 bg-gray-800 text-white">
//              <SideBar/>
//             </div>

//             {/* Main Content */}
//             <div className="flex-1 bg-white p-6">
//               {children}
//             </div>
//           </div>
//         </AppWrapper>
//       </body>
//     </html>
//   );
// }
