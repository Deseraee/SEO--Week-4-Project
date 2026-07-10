import { useEffect, useState } from 'react'

function Data({ username }) {
  const [discoveries, setDiscoveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

    const date = new Date(dateString.replace(' ', 'T'))

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  useEffect(() => {
    const fetchDiscoveries = async () => {
      try {
        const response = await fetch(`/api/discoveries/${username}`)
        const data = await response.json()

        if (response.ok) {
          setDiscoveries(data)
        } else {
          setError(data.error || 'Failed to load history')
        }
      } catch (err) {
        console.error('Error loading history:', err)
        setError('Could not connect to backend.')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchDiscoveries()
    }
  }, [username])

  if (loading) {
    return <p className="placeholder-text">Loading history...</p>
  }

  if (error) {
    return <p className="placeholder-text">Error: {error}</p>
  }

  return (
    <div className="data-page">
      <h2>{username}'s Discovery History</h2>

      {discoveries.length === 0 ? (
        <p className="placeholder-text">No discoveries saved yet.</p>
      ) : (
        <div className="history-list">
          {discoveries.map((item) => (
            <div className="history-card" key={item.id}>
              <div><strong>Common Name:</strong> {item.common_name || 'N/A'}</div>
              <div><strong>Scientific Name:</strong> {item.scientific_name || 'N/A'}</div>
              <div><strong>Description:</strong> {item.description || 'N/A'}</div>
              <div><strong>Origin:</strong> {item.region_or_origin || 'N/A'}</div>
              <div><strong>Safety:</strong> {item.hazard_warning || 'N/A'}</div>
              <div><strong>Fun Fact:</strong> {item.fun_fact || 'N/A'}</div>
              <div className="saved-time">Saved {formatDate(item.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Data