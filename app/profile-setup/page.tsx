'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

const EMOJI_ICONS = ['🐱', '🐶', '🦊', '🐼', '🐨', '🐸', '🦋', '🌸', '🌙', '⭐', '🍀', '🎀', '🌈', '🍓', '🎮', '🎵']


export default function ProfileSetup() {
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🐱')
  const [uploadedImage, setUploadedImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setUploadedImage(data.secure_url)
    setUploading(false)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    const user = auth.currentUser
    if (!user) return
    await setDoc(doc(db, 'users', user.uid), {
      name,
      avatar: uploadedImage || selectedEmoji,
      avatarType: uploadedImage ? 'image' : 'emoji',
      createdAt: new Date()
    })
    router.push('/home')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C3C4D8' }}>
      <div style={{ background: '#FCFAEA', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '360px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#7C7A86' }}>プロフィール設定</div>
          <div style={{ fontSize: '13px', color: '#A8A6B0', marginTop: '3px' }}>なまえとアイコンを決めよう！</div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#C3C4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: uploadedImage ? '0' : '36px', overflow: 'hidden' }}>
            {uploadedImage ? <img src={uploadedImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : selectedEmoji}
          </div>
          <label style={{ background: '#8A7DB3', color: '#fff', borderRadius: '99px', padding: '5px 14px', fontSize: '12px', cursor: 'pointer' }}>
            {uploading ? 'アップロード中…' : '画像をアップロード'}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '8px' }}>またはアイコンを選ぶ</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {EMOJI_ICONS.map(emoji => (
              <button key={emoji} onClick={() => { setSelectedEmoji(emoji); setUploadedImage('') }} style={{ fontSize: '22px', padding: '4px', background: selectedEmoji === emoji && !uploadedImage ? '#C3C4D8' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{emoji}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '5px' }}>なまえ（ニックネームでOK）</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="例：ゆき" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '9px', background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          Burrowをはじめる！
        </button>
      </div>
    </main>
  )
}
