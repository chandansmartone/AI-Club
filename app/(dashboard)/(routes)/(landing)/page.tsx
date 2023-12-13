import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
const LandingPage = () => {
  return (
    <div>
      <Link href="/sign-in">
        <Button>Login</Button>
      </Link>
      <Link href="/sign-up">
        <Button>Register</Button>
      </Link>
    </div>
  )
}

export default LandingPage
