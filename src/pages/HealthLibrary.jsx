
import { useEffect, useState } from 'react'

const topics = [
  'Menstrual health',
  'Period pain',
  'Premenstrual syndrome',
  'Menstrual cycle'
]

function HealthLibrary() {
  const [topic, setTopic] = useState('Menstrual health')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      setError('')

      try {
        const url =
          'https://www.ebi.ac.uk/europepmc/webservices/rest/search' +
          '?query=' + encodeURIComponent(topic) +
          '&format=json&pageSize=8&resultType=lite'

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch articles')
        }

        const data = await response.json()
        setArticles(data.resultList?.result || [])
      } catch (err) {
        setError('Unable to load articles. Please try again.')
        setArticles([])
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [topic])

  return (
    <div>
      <h2>Health Library 📚</h2>
      <p>Explore research about menstrual health.</p>

      <section>
        <h3>Choose a Topic</h3>

        <label htmlFor="health-topic">Health topic</label>
        <select
          id="health-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          {topics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h3>Research Articles</h3>

        {loading && <p>Loading articles...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && articles.length === 0 && (
          <p>No articles found.</p>
        )}

        {!loading && !error && articles.map((article) => (
          <div className="article-card"
               key={`${article.source}-${article.id}`}>
            <h3>{article.title}</h3>

            <p>
              <strong>Authors:</strong>{' '}
              {article.authorString || 'Not available'}
            </p>

            <p>
              <strong>Year:</strong>{' '}
              {article.pubYear || 'Unknown'}
            </p>

            <a
              href={`https://europepmc.org/article/${article.source}/${article.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Article
            </a>
          </div>
        ))}
      </section>

      <p>
        Research articles are for information only
        and do not replace medical advice.
      </p>
    </div>
  )
}

export default HealthLibrary
