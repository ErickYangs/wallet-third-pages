import { useState, useEffect } from 'react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (email: string) => void
  title?: string
}

export default function Dialog({ isOpen, onClose, onConfirm, title = "输入邮箱" }: DialogProps) {
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)

  // 验证邮箱格式
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 当邮箱输入变化时验证
  useEffect(() => {
    setIsValid(validateEmail(email))
  }, [email])

  // 处理确认
  const handleConfirm = () => {
    if (isValid) {
      onConfirm(email)
      setEmail('')
      onClose()
    }
  }

  // 处理取消
  const handleCancel = () => {
    setEmail('')
    onClose()
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleConfirm()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        animation: 'dialogSlideIn 0.3s ease-out'
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#333'
        }}>
          {title}
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#555'
          }}>
            邮箱地址
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入您的邮箱地址"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${isValid ? '#28a745' : email ? '#dc3545' : '#ddd'}`,
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            autoFocus
          />
          {email && !isValid && (
            <p style={{
              margin: '8px 0 0 0',
              fontSize: '12px',
              color: '#dc3545'
            }}>
              请输入有效的邮箱地址
            </p>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: isValid ? '#007bff' : '#ccc',
              color: 'white',
              cursor: isValid ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            确认
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dialogSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
