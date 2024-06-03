import React from 'react'
import AuthForm from './AuthForm'
import { Link } from 'react-router-dom'

export default function login() {
  return (
    <section className='flex-center size-full'>
      <AuthForm authType='SignIn' />
      <div className='flex justify-center items-center pt-10'>
        <Link to="/reset-password" className='underline hover:text-gray-200'>Forgot your password?</Link>
      </div>
    </section>
  )
}
