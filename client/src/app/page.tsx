import Link from 'next/link'
import styles from './page.module.css'
import { Button } from '@mui/material'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/configs/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authConfig)
  // console.log(session?.user)

  if (!session?.user) {
    redirect('/auth')
  }

  return (
    <h1>You successfully signed in</h1>
  )
}
