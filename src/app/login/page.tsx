'use client'

import { withPublic } from '@/components/HOC/with-public'
import LoginForm from '@/components/LoginForm'
import React from 'react'
// import gym from "@/../public/gym-bg.jpg" hsl(200.72deg 100% 38.04%)bg-[hsl(200.72,100%,38.04%)]

const page = () => {
  return (
    <div className=" h-screen bg-[rgb(1_75_136)] flex items-center justify-center bg-no-repeat">
      <div className="max-w-6xl w-full">
        {/* <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">Welcome Back</h1> */}
        <div className="">
          <LoginForm />
          {/* <img src="backgroundGym.avif" alt="gym" className="w-full h-full object- object-center" /> */}
        </div>
      </div>
    </div>  
  )
}

export default withPublic(page)