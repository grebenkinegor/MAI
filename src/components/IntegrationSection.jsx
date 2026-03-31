import Section from './Section'
import Card from './Card'

function IntegrationSection() {
  return (
    <Section
      id="integration"
      title="Интеграция с платформами дизайн-референсов"
      subtitle="Бесшовная связь с популярными источниками вдохновения и референсов"
      variant="gray"
    >
      <div className="cards-grid">
        <Card
          icon="🔗"
          title="API-интеграции"
          description="Подключение к ведущим платформам через официальные API"
          items={[
            "Behance API для доступа к проектам и коллекциям",
            "Dribbble API для получения шотов и трендов",
            "Pinterest API для визуального поиска",
            "Unsplash API для качественных фотографий",
            "Figma API для работы с дизайн-файлами"
          ]}
        />
        <Card
          icon="🌐"
          title="Веб-скрейпинг"
          description="Автоматизированный сбор данных с дизайн-платформ"
          items={[
            "Awwwards для трендов современного веб-дизайна",
            "SiteInspire для коллекций лучших сайтов",
            "Muzli для дизайнерского вдохновения",
            "Land-book для Landing Page референсов",
            "Httpster для минималистичных дизайнов"
          ]}
        />
        <Card
          icon="💾"
          title="Управление данными"
          description="Эффективная система хранения и обновления контента"
          items={[
            "Периодическая синхронизация с источниками",
            "Кеширование изображений и метаданных",
            "Дедупликация повторяющегося контента",
            "Версионирование и отслеживание изменений",
            "Резервное копирование критичных данных"
          ]}
        />
      </div>
    </Section>
  );
}

export default IntegrationSection;
