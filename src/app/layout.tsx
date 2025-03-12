"use client";

// import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import Navbar from "@/components/Navbar";
import { SidebarProvider } from '@/components/ui/sidebar'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";


const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideComponents = ["/login", "/signup"].includes(pathname);

  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {
              !hideComponents &&
              <SidebarProvider className="block">
                <Navbar />
                {children}
              </SidebarProvider>
            }
            {
              hideComponents && (
                <>
                  {children}
                </>
              )
            }
            <ToastContainer />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
