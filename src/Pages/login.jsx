import React from 'react'
import AuthForm from './AuthForm'

export default function login() {
  return (
    <section className='flex-center size-full'>
      <AuthForm authType='SignIn' />
    </section>
  )
}
