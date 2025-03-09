'use client'

import DashboardStats from "@/components/DashboardStatus";
import { withAuth } from "@/components/HOC/with-auth";

function Home() {
  return (
    <>
      
        <DashboardStats />
    </>
  );
}


export default withAuth(Home)
 