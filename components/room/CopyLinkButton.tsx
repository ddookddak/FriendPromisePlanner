'use client'
import { useState } from 'react'

export function CopyLinkButton({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}/rooms/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
    >
      {copied ? '복사됨!' : '링크 복사'}
    </button>
  )
}
