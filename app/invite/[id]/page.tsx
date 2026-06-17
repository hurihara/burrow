'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth, db } from '../../../lib/firebase'
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push(`/?redirect=/invite/${id}`)
        return
      }
      const inviteRef = doc(db, 'invites', id)
      const inviteSnap = await getDoc(inviteRef)
      if (!inviteSnap.exists()) {
        setStatus('error')
        return
      }
      const invite = inviteSnap.data()
      if (invite.from === user.uid) {
        setStatus('error')
        return
      }
      setStatus('ready')
    })
    return () => unsubscribe()
  }, [id, router])

  const handleAccept = async () => {
    const user = auth.currentUser
    if (!user) return
    const inviteRef = doc(db, 'invites', id)
    const inviteSnap = await getDoc(inviteRef)
    const invite = inviteSnap.data()!
    await addDoc(collection(db, 'burrows'), {
      members: [invite.from, user.uid],
      createdAt: new Date()
    })
    await updateDoc(inviteRef, { status: 'accepted' })
    router.push('/home')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C3C4D8' }}>
      <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
        {status === 'loading' && <div style={{ color: '#A8A6B0' }}>確認中…</div>}
        {status === 'error' && <div style={{ color: '#A8A6B0' }}>このリンクは使えないよ</div>}
        {status === 'ready' && (
          <>
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#7C7A86', marginBottom: '8px' }}>Burrowへの招待</div>
            <div style={{ fontSize: '13px', color: '#A8A6B0', marginBottom: '1.5rem' }}>友達があなたを秘密基地に招待してるよ！</div>
            <button onClick={handleAccept} style={{ width: '100%', padding: '9px', background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              Burrowに入る！
            </button>
          </>
        )}
      </div>
    </main>
  )
}
