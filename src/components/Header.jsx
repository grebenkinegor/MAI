import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'
import UserMenu from './UserMenu'
import './Header.css'

function Header({ onOpenProfile }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { user } = useAuth()

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsNavOpen(false)
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">MoodBoard AI</div>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Меню"
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`nav ${isNavOpen ? 'nav-open' : ''}`}>
            <button onClick={() => scrollToSection('hero')}>Главная</button>
            <button onClick={() => scrollToSection('analysis')}>Анализ</button>
            <button onClick={() => scrollToSection('methods')}>Методы</button>
            <button onClick={() => scrollToSection('algorithms')}>Алгоритмы</button>
            <button onClick={() => scrollToSection('integration')}>Интеграция</button>
            <button onClick={() => scrollToSection('interface')}>Интерфейс</button>
          </nav>
          <div className="header-actions">
            {user ? (
              <UserMenu onOpenProfile={onOpenProfile} />
            ) : (
              <button
                className="btn-login"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Вход
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default Header;
