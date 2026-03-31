import { useAuth } from '../contexts/AuthContext'
import './WebsiteResults.css'

function WebsiteResults({ websites, selectedReferences, onToggleReference, onSaveToCollection }) {
  const { user } = useAuth()
  return (
    <div className="results-section">
      <div className="results-header">
        <div>
          <h2>Похожие сайты на Awwwards</h2>
          <p>Найдены лучшие совпадения по визуальным характеристикам</p>
        </div>
        {selectedReferences.length > 0 && (
          <button
            className={`btn-save-collection ${!user ? 'disabled' : ''}`}
            onClick={onSaveToCollection}
            title={!user ? 'Войдите в аккаунт для сохранения' : ''}
          >
            💾 Сохранить {selectedReferences.length} в коллекцию
          </button>
        )}
      </div>

      <div className="websites-grid">
        {websites.map(site => (
          <div
            key={site.id}
            className={`website-card ${selectedReferences.includes(site.id) ? 'selected' : ''}`}
          >
            <div className="card-image-container">
              <img src={site.preview} alt={site.title} className="card-image" />
              <div className="similarity-badge">{site.similarity}% совпадение</div>
              <div className="selection-checkbox">
                <input
                  type="checkbox"
                  id={`select-${site.id}`}
                  checked={selectedReferences.includes(site.id)}
                  onChange={() => onToggleReference(site.id)}
                />
              </div>
            </div>

            <div className="card-content">
              <h3 className="card-title">{site.title}</h3>

              <div className="card-meta">
                <div className="meta-item">
                  <span className="meta-label">Сетка:</span>
                  <span className="meta-value">{site.gridType}</span>
                </div>
              </div>

              <div className="color-tags">
                {site.colors.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="color-tag"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <div className="tags">
                {site.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>

              <div className="card-actions">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-link"
                >
                  Открыть ссылку →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedReferences.length > 0 && (
        <div className="bottom-action">
          <button className="btn-save-bottom" onClick={onSaveToCollection}>
            💾 Сохранить выбранные referencias ({selectedReferences.length})
          </button>
        </div>
      )}
    </div>
  );
}

export default WebsiteResults;
