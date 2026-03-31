import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './UserMenu.css'

function UserMenu({ onOpenProfile }) {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
  }

  const handleOpenProfile = () => {
    if (onOpenProfile) {
      onOpenProfile()
    }
    setIsOpen(false)
  }

  if (!user) return null

  const userEmail = user.email
  const userInitial = userEmail.charAt(0).toUpperCase()

  return (
    <div className="user-menu">
      <button
        className="user-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">{userInitial}</div>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-avatar-large">{userInitial}</div>
            <div className="user-details">
              <p className="user-email">{userEmail}</p>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <button
            className="collections-button"
            onClick={handleOpenProfile}
          >
            📁 Мои коллекции
          </button>

          <div className="dropdown-divider"></div>

          <button className="logout-button" onClick={handleLogout}>
            🚪 Выход
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
