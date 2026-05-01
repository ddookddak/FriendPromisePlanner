'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NicknameEntry } from '@/components/NicknameEntry'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const nickname = localStorage.getItem('nickname')
    if (nickname) {
      router.push('/dashboard')
    }
  }, [router])

  return <NicknameEntry />
}
