import { useAccount } from 'wagmi'
import { Link } from 'react-router-dom'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>欢迎使用Web3钱包应用</h1>
      
      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '30px', 
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #bbdefb'
      }}>
        <h2>🚀 功能特色</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>💼 钱包管理</h3>
            <p>连接和管理您的Web3钱包，查看余额和交易历史</p>
          </div>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>👥 社交功能</h3>
            <p>与其他Web3用户互动，分享动态和消息</p>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7',
          marginBottom: '20px'
        }}>
          <h3>🔗 开始使用</h3>
          <p>请先连接您的钱包以使用所有功能</p>
          <Link 
            to="/wallet"
            style={{
              display: 'inline-block',
              marginTop: '15px',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            连接钱包
          </Link>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #c3e6cb',
          marginBottom: '20px'
        }}>
          <h3>✅ 钱包已连接</h3>
          <p>您现在可以使用所有功能了！</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px' }}>
            <Link 
              to="/wallet"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
            >
              查看钱包
            </Link>
            <Link 
              to="/social"
              style={{
                padding: '10px 20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
            >
              进入社交
            </Link>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📚 技术栈</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ 
            backgroundColor: '#61dafb', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            React
          </span>
          <span style={{ 
            backgroundColor: '#3178c6', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            TypeScript
          </span>
          <span style={{ 
            backgroundColor: '#646cff', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            Vite
          </span>
          <span style={{ 
            backgroundColor: '#ff6b35', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            Wagmi
          </span>
          <span style={{ 
            backgroundColor: '#4caf50', 
            color: 'white', 
            padding: '5px 10px', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            Viem
          </span>
        </div>
      </div>
    </div>
  )
}
