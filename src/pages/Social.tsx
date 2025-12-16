import { useAccount } from 'wagmi'

export default function Social() {
  const { address, isConnected } = useAccount()

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>社交页面</h1>
      
      {!isConnected ? (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h2>请先连接钱包</h2>
          <p>要使用社交功能，请先前往钱包页面连接您的钱包。</p>
        </div>
      ) : (
        <div>
          <div style={{ 
            backgroundColor: '#d4edda', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            <p>✅ 钱包已连接: {address}</p>
          </div>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3>📝 发布动态</h3>
              <textarea 
                placeholder="分享您的想法..."
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
              <button style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                发布
              </button>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3>👥 好友列表</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: 'white', 
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  <strong>0x1234...5678</strong> - 在线
                </div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: 'white', 
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  <strong>0xabcd...efgh</strong> - 离线
                </div>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3>💬 消息</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: 'white', 
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  <strong>来自 0x1234...5678:</strong> 你好！最近怎么样？
                </div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: 'white', 
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  <strong>来自 0xabcd...efgh:</strong> 有空一起聊聊Web3吗？
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
