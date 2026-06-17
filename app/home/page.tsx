'use client'

import { useRouter } from 'next/navigation'
import { auth } from '../../lib/firebase'
import { signOut } from 'firebase/auth'

export default function HomePage() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#C3C4D8', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#7C7A86' }}>あなたのBurrow</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '99px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>+ 招待する</button>
            <button onClick={handleLogout} style={{ background: 'transparent', color: '#A8A6B0', border: '0.5px solid #C0BEC8', borderRadius: '99px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>ログアウト</button>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#A8A6B0', marginBottom: '8px' }}>つながってる人</div>
        <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#C3C4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7DB3', fontWeight: 500, flexShrink: 0 }}>み</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#7C7A86' }}>みほ</div>
            <div style={{ fontSize: '12px', color: '#A8A6B0' }}>「昨日ね、すごいことがあって…」</div>
          </div>
          <div style={{ background: '#8A7DB3', color: '#fff', borderRadius: '99px', fontSize: '11px', padding: '2px 7px' }}>新着</div>
        </div>
        <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#C3C4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7DB3', fontWeight: 500, flexShrink: 0 }}>り</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#7C7A86' }}>りな</div>
            <div style={{ fontSize: '12px', color: '#A8A6B0' }}>新しいページを作ったよ！</div>
          </div>
        </div>
      </div>
    </main>
  )
}
