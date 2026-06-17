'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export default function Home() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/home')
    } catch (e) {
      setError('メールアドレスかパスワードが違います')
    }
  }

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/profile-setup')
    } catch (e) {
      setError('もう一度試してください')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C3C4D8' }}>
      <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '360px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '22px', fontWeight: 500, color: '#7C7A86' }}>Burrow</div>
          <div style={{ fontSize: '13px', color: '#A8A6B0', marginTop: '3px' }}>2人だけの秘密基地</div>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
          <button onClick={() => setTab('login')} style={{ flex: 1, padding: '6px', background: tab === 'login' ? '#FCFAEA' : 'transparent', border: tab === 'login' ? '0.5px solid #8A7DB3' : '0.5px solid #C0BEC8', borderRadius: '6px', color: tab === 'login' ? '#8A7DB3' : '#A8A6B0', cursor: 'pointer' }}>ログイン</button>
          <button onClick={() => setTab('signup')} style={{ flex: 1, padding: '6px', background: tab === 'signup' ? '#FCFAEA' : 'transparent', border: tab === 'signup' ? '0.5px solid #8A7DB3' : '0.5px solid #C0BEC8', borderRadius: '6px', color: tab === 'signup' ? '#8A7DB3' : '#A8A6B0', cursor: 'pointer' }}>新規登録</button>
        </div>
        {error && <div style={{ color: '#c0392b', fontSize: '12px', marginBottom: '8px' }}>{error}</div>}
        {tab === 'signup' && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '5px' }}>なまえ</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="例：ゆき" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '5px' }}>メールアドレス</div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '5px' }}>パスワード</div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={tab === 'login' ? handleLogin : handleSignup} style={{ width: '100%', padding: '9px', background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          {tab === 'login' ? 'ログイン' : 'アカウントを作る'}
        </button>
        {tab === 'login' && (
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#A8A6B0' }}>
            パスワードを忘れた場合は<span style={{ color: '#8A7DB3', cursor: 'pointer' }}>こちら</span>
          </div>
        )}
      </div>
    </main>
  )
}
