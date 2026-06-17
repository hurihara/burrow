export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#C3C4D8',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: '#FCFAEA',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '22px', fontWeight: 500, color: '#7C7A86' }}>Burrow</div>
          <div style={{ fontSize: '13px', color: '#A8A6B0', marginTop: '3px' }}>2人だけの秘密基地</div>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
          <button style={{ flex: 1, padding: '6px', background: '#FCFAEA', border: '0.5px solid #8A7DB3', borderRadius: '6px', color: '#8A7DB3', cursor: 'pointer' }}>ログイン</button>
          <button style={{ flex: 1, padding: '6px', background: 'transparent', border: '0.5px solid #C0BEC8', borderRadius: '6px', color: '#A8A6B0', cursor: 'pointer' }}>新規登録</button>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '5px' }}>メールアドレス</div>
          <input type="email" placeholder="example@mail.com" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#A8A6B0', marginBottom: '5px' }}>パスワード</div>
          <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '8px 10px', border: '0.5px solid #C0BEC8', borderRadius: '8px', background: '#fff', color: '#7C7A86', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button style={{ width: '100%', padding: '9px', background: '#8A7DB3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>ログイン</button>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#A8A6B0' }}>
          パスワードを忘れた場合は<span style={{ color: '#8A7DB3', cursor: 'pointer' }}>こちら</span>
        </div>
      </div>
    </main>
  )
}
