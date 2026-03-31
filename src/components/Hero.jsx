import './Hero.css'

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-badge">Инновационное решение для дизайнеров</div>
        <h1 className="hero-title">
          Интеллектуальный ассистент генерации мудбордов
        </h1>
        <p className="hero-subtitle">
          Революционная система анализа визуальных характеристик и автоматической
          генерации мудбордов для повышения эффективности работы дизайнеров
        </p>
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <div className="feature-text">
              <h3>Анализ палитры</h3>
              <p>Автоматическое определение цветовых схем</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📐</div>
            <div className="feature-text">
              <h3>Композиция</h3>
              <p>Оценка визуальной структуры дизайна</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔤</div>
            <div className="feature-text">
              <h3>Типографика</h3>
              <p>Распознавание шрифтовых решений</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
