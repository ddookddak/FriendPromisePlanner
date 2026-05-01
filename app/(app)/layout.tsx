'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [nickname, setNickname] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('nickname')
    if (!saved) {
      router.push('/')
    } else {
      setNickname(saved)
    }
  }, [router])

  if (!nickname) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-green-600">
            FriendPromisePlanner
          </Link>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{nickname}</span>
            <button
              onClick={() => {
                localStorage.removeItem('nickname')
                router.push('/')
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
