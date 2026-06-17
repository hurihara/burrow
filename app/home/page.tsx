'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db, requestNotificationPermission } from '../../lib/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, doc, getDoc, addDoc, setDoc } from 'firebase/firestore'

type Burrow = {
  id: string
  partnerId: string
  partnerName: string
}

export default function HomePage() {
  const router = useRouter()
  const [burrows, setBurrows] = useState<Burrow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/')
        return
      }
      const token = await requestNotificationPermission()
      if (token) {
        await setDoc(doc(db, 'users', user.uid), { fcmToken: token }, { merge: true })
      }
      const q = query(collection(db, 'burrows'), where('members', 'array-contains', user.uid))
      const snap = await getDocs(q)
      const list: Burrow[] = []
      for (const d of snap.docs) {
        const data = d.data()
        const partnerId = data.members.find((m: string) => m !== user.uid)
        const partnerSnap = await getDoc(doc(db, 'users', partnerId))
        const partnerName = partnerSnap.exists() ? partnerSnap.data().name : '名無し'
        list.push({ id: d.id, partnerId, partnerName })
      }
      setBurrows(list)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/')
  }

  const handleInvite = async () => {
    const user = auth.currentUser
    if (!user) return
    const docRef = await addDoc(collection(db, 'invites'), {
      from: user.uid,
      createdAt: new Date(),
      status: 'pending'
    })
    const inviteUrl = `${window.location.origin}/invite/${docRef.id}`
    await navigator.clipboard.writeText(inviteUrl)
    alert('招待リンクをコピーしたよ！友達に送ってね！')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#C3C4D8', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#7C7A86' }}>あなたのBurrow</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleInvite} style={{ background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '99px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>+ 招待する</button>
            <button onClick={handleLogout} style={{ background: 'transparent', color: '#A8A6B0', border: '0.5px solid #C0BEC8', borderRadius: '99px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>ログアウト</button>
          </div>
        </div>
        {loading ? (
          <div style={{ color: '#A8A6B0', textAlign: 'center', marginTop: '2rem' }}>読み込み中…</div>
        ) : burrows.length === 0 ? (
          <div style={{ color: '#A8A6B0', textAlign: 'center', marginTop: '2rem' }}>
            <div style={{ marginBottom: '8px' }}>まだ誰とも繋がってないよ</div>
            <div style={{ fontSize: '12px' }}>招待リンクを送って友達を誘おう！</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: '#A8A6B0', marginBottom: '8px' }}>つながってる人</div>
            {burrows.map(b => (
              <div key={b.id} onClick={() => router.push(`/burrow/${b.id}`)} style={{ background: '#FCFAEA', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', cursor: 'pointer' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#C3C4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7DB3', fontWeight: 500, flexShrink: 0 }}>
                  {b.partnerName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#7C7A86' }}>{b.partnerName}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  )
}
