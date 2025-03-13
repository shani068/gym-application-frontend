"use client"

import React from 'react'
import EditMembershipForm from '../EditMemberShipForm'
import { withAuth } from '@/components/HOC/with-auth'



const Page = () => {
  return (
    <>
        <EditMembershipForm />
    </>
  )
}

export default withAuth(Page)