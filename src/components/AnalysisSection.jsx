import Section from './Section'
import Card from './Card'

function AnalysisSection() {
  return (
    <Section
      id="analysis"
      title="Анализ существующих решений в области поиска по изображению"
      subtitle="Комплексное исследование современных технологий и платформ визуального поиска"
      variant="light"
    >
      <div className="cards-grid">
        <Card
          icon="🔍"
          title="Поисковые системы"
          description="Анализ возможностей современных поисковых систем по изображениям"
          items={[
            "Google Images с обратным поиском по изображению",
            "Yandex.Images с технологией распознавания объектов",
            "TinEye для поиска источника и вариаций изображений",
            "Bing Visual Search с интеграцией AI-анализа"
          ]}
        />
        <Card
          icon="🎨"
          title="Дизайн-платформы"
          description="Специализированные платформы для дизайнеров и креаторов"
          items={[
            "Behance для поиска дизайн-проектов",
            "Dribbble с фильтрацией по цветам и стилям",
            "Pinterest с визуальными рекомендациями",
            "Awwwards для анализа трендов веб-дизайна"
          ]}
        />
        <Card
          icon="🤖"
          title="AI-решения"
          description="Инновационные системы на основе машинного обучения"
          items={[
            "Технологии компьютерного зрения (Computer Vision)",
            "Нейронные сети для распознавания образов",
            "Алгоритмы глубокого обучения (Deep Learning)",
            "Системы семантического поиска по изображениям"
          ]}
        />
      </div>
    </Section>
  );
}

export default AnalysisSection;
