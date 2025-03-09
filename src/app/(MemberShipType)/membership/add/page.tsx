'use client'

import React from 'react'
import AddMembershipForm from './AddMemberShipForm'
import { withAuth } from '@/components/HOC/with-auth'

const Page = () => {
  return (
    <>
      <AddMembershipForm />
    </>
  )
}

export default withAuth(Page)