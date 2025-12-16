import { Link, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'

export default function Navigation() {
  const location = useLocation()
  const { address, isConnected } = useAccount()

  const navStyle = {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderBottom: '1px solid #dee2e6',
    marginBottom: '2rem'
  }

  const navListStyle = {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '2rem',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  }

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#007bff',
    color: 'white'
  }

  const walletStatusStyle = {
    marginLeft: 'auto',
    padding: '0.5rem 1rem',
    backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
    color: isConnected ? '#155724' : '#721c24',
    borderRadius: '4px',
    fontSize: '0.9rem'
  }

  return (
    <nav style={navStyle}>
      <ul style={navListStyle}>
        <li>
          <Link 
            to="/" 
            style={location.pathname === '/' ? activeLinkStyle : linkStyle}
          >
            首页
          </Link>
        </li>
        <li>
          <Link 
            to="/wallet" 
            style={location.pathname === '/wallet' ? activeLinkStyle : linkStyle}
          >
            钱包
          </Link>
        </li>
        <li>
          <Link 
            to="/social" 
            style={location.pathname === '/social' ? activeLinkStyle : linkStyle}
          >
            社交
          </Link>
        </li>
        <li>
          <Link 
            to="/email" 
            style={location.pathname === '/email' ? activeLinkStyle : linkStyle}
          >
            邮箱
          </Link>
        </li>
        <li style={walletStatusStyle}>
          {isConnected ? `已连接: ${address?.slice(0, 6)}...${address?.slice(-4)}` : '未连接钱包'}
        </li>
      </ul>
    </nav>
  )
}
