'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { auth, db } from '../../../../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

const TOPICS = [
  '最近ハマってることは？',
  '今日の気分を一言で表すと？',
  '最近見たアニメ・映画は？',
  '今一番欲しいものは？',
  '最近笑ったことは？',
  '好きな食べ物ベスト3は？',
  '最近あった嬉しいことは？',
  '今の推しを教えて！',
  '最近聴いてる曲は？',
  'もし明日休みだったら何する？',
  '最近買ってよかったものは？',
  '子供の頃の夢は何だった？',
  '得意なことと苦手なことは？',
  '最近気になってることは？',
  '今いちばん楽しみにしてることは？',
]

const MOODS = ['😊', '😴', '🥰', '😔', '🔥', '😤', '🥺', '😎', '🤔', '😇']

const DEFAULT_ITEMS = ['気分', 'ひとこと', 'BGM', '相手への質問']

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
  const [topic, setTopic] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>(['気分', 'ひとこと'])
  const [mood, setMood] = useState('')
  const [bgm, setBgm] = useState('')
  const [hitokoto, setHitokoto] = useState('')
  const [question, setQuestion] = useState('')
  const [customItem, setCustomItem] = useState('')
  const [customItems, setCustomItems] = useState<string[]>([])
  const [customValues, setCustomValues] = useState<{[key: string]: string}>({})

  useEffect(() => {
    setTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)])
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push('/'); return }
      const userSnap = await getDoc(doc(db, 'users', user.uid))
      setMyName(userSnap.exists() ? userSnap.data().name : '名無し')
      const pageSnap = await getDoc(doc(db, 'burrows', burrowId, 'pages', pageId))
      if (!pageSnap.exists()) { router.push(`/burrow/${burrowId}`); return }
      const data = pageSnap.data()
      setPageData(data)
      setContent(data.content || '')
      if (data.mood) setMood(data.mood)
      if (data.bgm) setBgm(data.bgm)
      if (data.hitokoto) setHitokoto(data.hitokoto)
      if (data.question) setQuestion(data.question)
      if (data.selectedItems) setSelectedItems(data.selectedItems)
      if (data.customItems) setCustomItems(data.customItems)
      if (data.customValues) setCustomValues(data.customValues)
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

  const toggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const addCustomItem = () => {
    if (!customItem.trim()) return
    setCustomItems(prev => [...prev, customItem.trim()])
    setCustomItem('')
  }

  const handleSave = async () => {
    await updateDoc(doc(db, 'burrows', burrowId, 'pages', pageId), {
      content, mood, bgm, hitokoto, question, selectedItems, customItems, customValues
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    const user = auth.currentUser
    if (!user) return
    const docRef = await addDoc(collection(db, 'burrows', burrowId, 'pages', pageId, 'comments'), {
      text: comment, authorId: user.uid, authorName: myName, createdAt: new Date()
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

        {pageData.type === 'diary' && (
          <>
            <div style={{ background: '#8A7DB3', borderRadius: '12px', padding: '12px 16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontSize: '14px', flex: 1 }}>📝 {topic}</div>
              <button onClick={() => setTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)])} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '99px', color: '#fff', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>別のお題</button>
            </div>

            <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1rem', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '8px' }}>書く項目を選ぶ</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {[...DEFAULT_ITEMS, ...customItems].map(item => (
                  <button key={item} onClick={() => toggleItem(item)} style={{ padding: '4px 12px', borderRadius: '99px', border: selectedItems.includes(item) ? '1.5px solid #8A7DB3' : '0.5px solid #C0BEC8', background: selectedItems.includes(item) ? '#EEEDFE' : '#fff', color: selectedItems.includes(item) ? '#8A7DB3' : '#A8A6B0', fontSize: '12px', cursor: 'pointer' }}>
                    {item}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input value={customItem} onChange={e => setCustomItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomItem()} placeholder="+ カスタム項目" style={{ flex: 1, padding: '5px 10px', border: '0.5px solid #C0BEC8', borderRadius: '99px', background: '#fff', color: '#7C7A86', outline: 'none', fontSize: '12px' }} />
                <button onClick={addCustomItem} style={{ background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '99px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>追加</button>
              </div>
            </div>

            {selectedItems.includes('気分') && (
              <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1rem', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '8px' }}>気分</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMood(m)} style={{ fontSize: '22px', background: mood === m ? '#C3C4D8' : 'transparent', border: 'none', borderRadius: '8px', padding: '4px', cursor: 'pointer' }}>{m}</button>
                  ))}
                </div>
              </div>
            )}

            {selectedItems.includes('ひとこと') && (
              <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1rem', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '8px' }}>ひとこと</div>
                <input value={hitokoto} onChange={e => setHitokoto(e.target.value)} placeholder="今日のひとこと…" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            )}

            {selectedItems.includes('BGM') && (
              <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1rem', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '8px' }}>今日のBGM 🎵</div>
                <input value={bgm} onChange={e => setBgm(e.target.value)} placeholder="曲名・アーティスト名…" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            )}

            {selectedItems.includes('相手への質問') && (
              <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1rem', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '8px' }}>相手への質問</div>
                <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="聞いてみたいこと…" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            )}

            {customItems.filter(i => selectedItems.includes(i)).map(item => (
              <div key={item} style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1rem', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '8px' }}>{item}</div>
                <input value={customValues[item] || ''} onChange={e => setCustomValues(prev => ({ ...prev, [item]: e.target.value }))} placeholder={`${item}について…`} style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            ))}
          </>
        )}

        <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '1.25rem', marginBottom: '12px' }}>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={pageData.type === 'diary' ? '本文を書いてみよう…' : '自由に書いてね！'} style={{ width: '100%', minHeight: '150px', border: 'none', background: 'transparent', color: '#7C7A86', fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
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
            <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleComment()} placeholder="返信を書く…" style={{ flex: 1, padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', fontSize: '14px' }} />
            <button onClick={handleComment} style={{ background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}>送る</button>
          </div>
        </div>
      </div>
    </main>
  )
}
