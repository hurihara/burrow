'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function ProfileSetup() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSave = async () => {
    if (!name.trim()) return
    const user = auth.currentUser
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), {
      name,
      createdAt: new Date()
    })
    router.push('/home')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C3C4D8' }}>
      <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '360px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#7C7A86' }}>プロフィール設定</div>
          <div style={{ fontSize: '13px', color: '#A8A6B0', marginTop: '3px' }}>なまえを教えて！</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '5px' }}>なまえ（ニックネームでOK）</div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="例：ゆき"
            style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button
          onClick={handleSave}
          style={{ width: '100%', padding: '9px', background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
        >
          Burrowをはじめる！
        </button>
      </div>
    </main>
  )
}
