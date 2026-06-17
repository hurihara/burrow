'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth, db } from '../../../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

type Comment = {
  id: string
  text: string
  authorId: string
  authorName: string
  createdAt: Date
}

export default function PageView() {
  const router = useRouter()
  const params = useParams()
  const burrowId = params.id as string
  const pageId = params.pageId as string
  const [pageData, setPageData] = useState<any>(null)
  const [content, setContent] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [myName, setMyName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push('/'); return }
      const userSnap = await getDoc(doc(db, 'users', user.uid))
      setMyName(userSnap.exists() ? userSnap.data().name : '名無し')
      const pageSnap = await getDoc(doc(db, 'burrows', burrowId, 'pages', pageId))
      if (!pageSnap.exists()) { router.push(`/burrow/${burrowId}`); return }
      setPageData(pageSnap.data())
      setContent(pageSnap.data().content || '')
      const q = query(collection(db, 'burrows', burrowId, 'pages', pageId, 'comments'), orderBy('createdAt'))
      const snap = await getDocs(q)
      setComments(snap.docs.map(d => ({
        id: d.id,
        text: d.data().text,
        authorId: d.data().authorId,
        authorName: d.data().authorName,
        createdAt: d.data().createdAt?.toDate()
      })))
    })
    return () => unsubscribe()
  }, [burrowId, pageId, router])

  const handleSave = async () => {
    await updateDoc(doc(db, 'burrows', burrowId, 'pages', pageId), { content })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    const user = auth.currentUser
    if (!user) return
    const docRef = await addDoc(collection(db, 'burrows', burrowId, 'pages', pageId, 'comments'), {
      text: comment,
      authorId: user.uid,
      authorName: myName,
      createdAt: new Date()
    })
    setComments([...comments, { id: docRef.id, text: comment, authorId: user.uid, authorName: myName, createdAt: new Date() }])
    setComment('')
  }

  if (!pageData) return <main style={{ minHeight: '100vh', background: '#C3C4D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#A8A6B0' }}>読み込み中…</div></main>

  return (
    <main style={{ minHeight: '100vh', background: '#C3C4D8', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <button onClick={() => router.push(`/burrow/${burrowId}`)} style={{ background: 'none', border: 'none', color: '#8A7DB3', cursor: 'pointer', fontSize: '14px' }}>← 戻る</button>
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#7C7A86' }}>{pageData.title}</div>
        </div>
        <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1.25rem', marginBottom: '12px' }}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={pageData.type === 'diary' ? '今日のこと、書いてみよう…' : '自由に書いてね！'}
            style={{ width: '100%', minHeight: '200px', border: 'none', background: 'transparent', color: '#7C7A86', fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={handleSave} style={{ background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '99px', padding: '6px 16px', fontSize: '13px', cursor: 'pointer' }}>
              {saved ? '保存したよ！' : '保存する'}
            </button>
          </div>
        </div>
        <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '12px' }}>返信欄</div>
          {comments.map(c => (
            <div key={c.id} style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: '#A8A6B0', marginBottom: '2px' }}>{c.authorName}</div>
              <div style={{ background: '#C3C4D8', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', color: '#7C7A86', display: 'inline-block', maxWidth: '100%' }}>{c.text}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
              placeholder="返信を書く…"
              style={{ flex: 1, padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', fontSize: '14px' }}
            />
            <button onClick={handleComment} style={{ background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}>送る</button>
          </div>
        </div>
      </div>
    </main>
  )
}
