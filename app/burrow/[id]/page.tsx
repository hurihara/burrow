'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'

type Page = {
  id: string
  type: 'diary' | 'free'
  title: string
  createdAt: Date
}

export default function BurrowPage() {
  const router = useRouter()
  const params = useParams()
  const burrowId = params.id as string
  const [tab, setTab] = useState<'diary' | 'free'>('diary')
  const [pages, setPages] = useState<Page[]>([])
  const [partnerName, setPartnerName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push('/'); return }
      const burrowSnap = await getDoc(doc(db, 'burrows', burrowId))
      if (!burrowSnap.exists()) { router.push('/home'); return }
      const burrowData = burrowSnap.data()
      const partnerId = burrowData.members.find((m: string) => m !== user.uid)
      const partnerSnap = await getDoc(doc(db, 'users', partnerId))
      setPartnerName(partnerSnap.exists() ? partnerSnap.data().name : '名無し')
      const q = query(collection(db, 'burrows', burrowId, 'pages'))
      const snap = await getDocs(q)
      const list: Page[] = snap.docs.map(d => ({
        id: d.id,
        type: d.data().type,
        title: d.data().title,
        createdAt: d.data().createdAt?.toDate()
      }))
      setPages(list)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [burrowId, router])

  const handleAddPage = async (type: 'diary' | 'free') => {
    const user = auth.currentUser
    if (!user) return
    const title = type === 'diary'
      ? `${new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })} 日記`
      : 'フリーページ'
    const docRef = await addDoc(collection(db, 'burrows', burrowId, 'pages'), {
      type,
      title,
      createdBy: user.uid,
      createdAt: new Date()
    })
    router.push(`/burrow/${burrowId}/page/${docRef.id}`)
  }

  const filtered = pages.filter(p => p.type === tab)

  return (
    <main style={{ minHeight: '100vh', background: '#C3C4D8', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', color: '#8A7DB3', cursor: 'pointer', fontSize: '14px' }}>← 戻る</button>
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#7C7A86' }}>{partnerName}とのBurrow</div>
        </div>
        <div style={{ display: 'flex', background: 'rgba(124,122,134,0.08)', borderRadius: '8px', padding: '3px', gap: '3px', marginBottom: '1rem' }}>
          <button onClick={() => setTab('diary')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: tab === 'diary' ? '0.5px solid #C0BEC8' : 'none', background: tab === 'diary' ? '#FCFAEA' : 'transparent', color: tab === 'diary' ? '#8A7DB3' : '#A8A6B0', cursor: 'pointer', fontSize: '13px' }}>日記</button>
          <button onClick={() => setTab('free')} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: tab === 'free' ? '0.5px solid #C0BEC8' : 'none', background: tab === 'free' ? '#FCFAEA' : 'transparent', color: tab === 'free' ? '#8A7DB3' : '#A8A6B0', cursor: 'pointer', fontSize: '13px' }}>フリー</button>
        </div>
        {loading ? (
          <div style={{ color: '#A8A6B0', textAlign: 'center' }}>読み込み中…</div>
        ) : (
          <>
            {filtered.map(p => (
              <div key={p.id} onClick={() => router.push(`/burrow/${burrowId}/page/${p.id}`)} style={{ background: '#FCFAEA', borderRadius: '12px', padding: '12px 14px', marginBottom: '8px', cursor: 'pointer' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#7C7A86' }}>{p.title}</div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button onClick={() => handleAddPage(tab)} style={{ background: tab === 'diary' ? '#8A7DB3' : '#A8A6B0', color: '#fff', border: 'none', borderRadius: '99px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer' }}>
                + {tab === 'diary' ? '日記を書く' : 'フリーページを追加'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
