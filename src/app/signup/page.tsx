'use client'

import { withPublic } from "@/components/HOC/with-public";
import SignUpForm from "./components/SignupForm";



function SignUpPage() {
  return (
    <div className=" gym-bg bg-[rgb(1_75_136)] h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">Join Our Gym</h1> */}
        <div className="gym-card rounded-lg shadow-xl">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}

export default withPublic(SignUpPage)