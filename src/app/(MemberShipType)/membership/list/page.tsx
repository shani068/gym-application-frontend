'use client'


import React from 'react'
import MembershipList from './MemberShipList'
import { withAuth } from '@/components/HOC/with-auth'

const Page = () => {
  return (
    <div className='mt-12'>
        <MembershipList />
    </div>
  )
}

export default withAuth(Page)