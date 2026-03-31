import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import AnalysisPanel from './components/AnalysisPanel'
import AnalysisSection from './components/AnalysisSection'
import MethodsSection from './components/MethodsSection'
import AlgorithmsSection from './components/AlgorithmsSection'
import IntegrationSection from './components/IntegrationSection'
import InterfaceSection from './components/InterfaceSection'
import ProfilePage from './components/ProfilePage'
import './App.css'
import './styles/grid.css'

function App() {
  const [page, setPage] = useState('home')

  const openProfile = () => {
    setPage('profile')
  }

  const openHome = () => {
    setPage('home')
  }

  return (
    <div className="app">
      <Header onOpenProfile={openProfile} />
      <main>
        {page === 'home' ? (
          <>
            <Hero />
            <section className="tool-section">
              <div className="tool-container">
                <AnalysisPanel />
              </div>
            </section>
            <AnalysisSection />
            <MethodsSection />
            <AlgorithmsSection />
            <IntegrationSection />
            <InterfaceSection />
          </>
        ) : (
          <ProfilePage onBack={openHome} />
        )}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 MoodBoard AI. Интеллектуальный ассистент для дизайнеров</p>
        </div>
      </footer>
    </div>
  )
}

export default App
