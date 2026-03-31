import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  extractColors,
  analyzeDesign,
  mockColorDescription,
  mockTypography
} from '../lib/imageAnalysis'
import { getRecommendedWebsites } from '../lib/awwardsData'
import WebsiteResults from './WebsiteResults'
import './AnalysisPanel.css'

function AnalysisPanel() {
  const { user } = useAuth()
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [colors, setColors] = useState(null)
  const [typography, setTypography] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedReferences, setSelectedReferences] = useState([])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const processFile = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 5 МБ.')
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Поддерживаются только JPG и PNG.')
      return
    }

    setLoading(true)
    const reader = new FileReader()

    reader.onload = async (e) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = async () => {
        try {
          setUploadedImage(e.target.result)

          const colorsData = await extractColors(img)
          setColors(colorsData)

          const designAnalysis = analyzeDesign(img)
          setAnalysis(designAnalysis)

          const typographyData = mockTypography()
          setTypography(typographyData)

          const recommendedSites = getRecommendedWebsites(designAnalysis, colorsData)
          setRecommendations(recommendedSites)

          setSelectedReferences([])
        } catch (error) {
          console.error('Ошибка анализа:', error)
          alert('Ошибка при анализе изображения')
        }
      }
      img.src = e.target.result
    }

    reader.readAsDataURL(file)
    setLoading(false)
  }

  const toggleReference = (id) => {
    setSelectedReferences(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const saveToCollection = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в аккаунт, чтобы сохранить референсы')
      return
    }

    if (selectedReferences.length === 0) {
      alert('Выберите хотя бы один референс')
      return
    }

    const collectionName = prompt('Назовите коллекцию:')
    if (!collectionName) return

    try {
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          user_id: user.id,
          name: collectionName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (collectionError) throw collectionError

      const references = recommendations
        .filter(site => selectedReferences.includes(site.id))
        .map(site => ({
          collection_id: collection.id,
          website_title: site.title,
          website_url: site.url,
          preview_url: site.preview,
          colors: site.colors,
          grid_type: site.gridType,
          tags: site.tags,
          typography: {
            family: typography.family,
            size: typography.bodySize,
            lineHeight: typography.lineHeight
          }
        }))

      const { error: referencesError } = await supabase
        .from('saved_references')
        .insert(references)

      if (referencesError) throw referencesError

      alert(`${selectedReferences.length} referencias сохранены в коллекцию "${collectionName}"`)
      setSelectedReferences([])
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      alert('Ошибка при сохранении коллекции: ' + error.message)
    }
  }

  return (
    <div className="analysis-panel">
      <div className="upload-section">
        <div
          className={`upload-area ${dragActive ? 'active' : ''} ${uploadedImage ? 'uploaded' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadedImage ? (
            <div className="preview-container">
              <img src={uploadedImage} alt="Загруженное изображение" className="preview-image" />
              <button
                className="btn-upload-new"
                onClick={() => document.getElementById('file-input').click()}
              >
                Загрузить другое
              </button>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📤</div>
              <h3>Загрузите скриншот вашего сайта</h3>
              <p>Перетащите файл или нажмите для выбора</p>
              <p className="upload-info">JPG или PNG, до 5 МБ</p>
              <button
                className="btn-upload-new"
                onClick={() => document.getElementById('file-input').click()}
              >
                Загрузить изображение
              </button>
            </div>
          )}
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleChange}
            className="file-input"
          />
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Анализирую дизайн...</p>
        </div>
      )}

      {analysis && colors && typography && (
        <>
          <div className="analysis-results">
            <div className="analysis-header">
              <h2>Анализ дизайна</h2>
              <p>Выявленные характеристики вашего сайта</p>
            </div>

            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-icon">🎨</div>
                <div className="analysis-content">
                  <h4>Цветовая палитра</h4>
                  <div className="color-palette">
                    {colors.palette.map((color, i) => (
                      <div
                        key={i}
                        className="color-chip"
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        <span className="color-code">{color}</span>
                      </div>
                    ))}
                  </div>
                  <p className="analysis-description">
                    {mockColorDescription(colors)}
                  </p>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-icon">📐</div>
                <div className="analysis-content">
                  <h4>Тип сетки</h4>
                  <p className="analysis-value">{analysis.gridType}</p>
                  <p className="analysis-description">
                    {analysis.whitespacePercent}% пространства пусто
                  </p>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-icon">✍️</div>
                <div className="analysis-content">
                  <h4>Типография</h4>
                  <p className="analysis-value">{typography.family}</p>
                  <p className="analysis-description">
                    {typography.bodySize} / {typography.lineHeight}
                  </p>
                </div>
              </div>

              <div className="analysis-card">
                <div className="analysis-icon">⚖️</div>
                <div className="analysis-content">
                  <h4>Баланс</h4>
                  <p className="analysis-value">{analysis.complexity}%</p>
                  <p className="analysis-description">
                    {analysis.darkPercent}% тёмных элементов
                  </p>
                </div>
              </div>
            </div>
          </div>

          {recommendations && recommendations.length > 0 && (
            <WebsiteResults
              websites={recommendations}
              selectedReferences={selectedReferences}
              onToggleReference={toggleReference}
              onSaveToCollection={saveToCollection}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AnalysisPanel;
