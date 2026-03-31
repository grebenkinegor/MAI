import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import './ProfilePage.css'
import './CollectionsModal.css'

function ProfilePage({ onBack }) {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [collections, setCollections] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || authLoading) return

    const fetchCollections = async () => {
      setLoading(true)
      setError('')

      try {
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .order('created_at', { ascending: false })

        if (collectionsError) throw collectionsError

        if (!collectionsData || collectionsData.length === 0) {
          setCollections([])
          return
        }

        const collectionIds = collectionsData.map((collection) => collection.id)

        if (collectionIds.length === 0) {
          setCollections([])
          return
        }

        const { data: referencesData, error: referencesError } = await supabase
          .from('saved_references')
          .select('*')
          .in('collection_id', collectionIds)

        if (referencesError) throw referencesError

        const referencesByCollection = {}

        if (referencesData) {
          for (const reference of referencesData) {
            if (!referencesByCollection[reference.collection_id]) {
              referencesByCollection[reference.collection_id] = []
            }
            referencesByCollection[reference.collection_id].push(reference)
          }
        }

        const collectionsWithReferences = collectionsData.map((collection) => ({
          ...collection,
          references: referencesByCollection[collection.id] || []
        }))

        setCollections(collectionsWithReferences)
      } catch (err) {
        console.error('Ошибка загрузки коллекций:', err)
        setError(err.message || 'Не удалось загрузить коллекции')
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [user, authLoading])

  return (
    <section className="profile-page">
      <div className="profile-header-row">
        <div>
          <h1 className="profile-title">Профиль</h1>
          <p className="profile-subtitle">
            Ваши сохранённые коллекции с референсами из MoodBoard AI
          </p>
        </div>

        <button className="profile-back-button" type="button" onClick={onBack}>
          ← На главную
        </button>
      </div>

      {authLoading && (
        <div className="collections-state">Проверяем авторизацию...</div>
      )}

      {!authLoading && !user && (
        <div className="collections-empty">
          <p>Чтобы просматривать коллекции, войдите в аккаунт.</p>
        </div>
      )}

      {!authLoading && user && (
        <>
          {loading && (
            <div className="collections-state">Загружаем коллекции...</div>
          )}

          {error && <div className="collections-error">{error}</div>}

          {!loading && !error && collections.length === 0 && (
            <div className="collections-empty">
              <p>У вас ещё нет сохранённых коллекций.</p>
              <p>
                Сохраните сайты через кнопку «Сохранить в коллекцию» в блоке похожих
                сайтов.
              </p>
            </div>
          )}

          {!loading && !error && collections.length > 0 && (
            <div className="collections-list">
              {collections.map((collection) => (
                <div key={collection.id} className="collection-card">
                  <div className="collection-card-header">
                    <div>
                      <h3>{collection.name}</h3>
                      {collection.created_at && (
                        <p className="collection-date">
                          {new Date(collection.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className="collection-count">
                      {collection.references.length} референсов
                    </span>
                  </div>

                  {collection.references.length > 0 && (
                    <div className="references-grid">
                      {collection.references.map((reference) => (
                        <a
                          key={reference.id}
                          href={reference.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="reference-card"
                        >
                          {reference.preview_url && (
                            <div className="reference-image-wrapper">
                              <img
                                src={reference.preview_url}
                                alt={reference.website_title}
                              />
                            </div>
                          )}

                          <div className="reference-content">
                            <p className="reference-title">
                              {reference.website_title}
                            </p>

                            {Array.isArray(reference.tags) &&
                              reference.tags.length > 0 && (
                                <div className="reference-tags">
                                  {reference.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="reference-tag">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default ProfilePage

