import { useState, useEffect } from 'react'

function Home({ username, onLogout }) {
  const [parks, setParks] = useState([])
  const [selectedPark, setSelectedPark] = useState("")
  const [parkInfo, setParkInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchParks()
  }, [])

  const fetchParks = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/parks')
      const data = await response.json()
      if (response.ok) {
        setParks(data.parks || [])
      }
    } catch (error) {
      console.error('Error fetching parks:', error)
    }
  }

  const fetchParkDashboard = async (parkCode) => {
    if (!parkCode) return

    setLoading(true)
    setError(null)
    setParkInfo(null)

    try {
      const response = await fetch(`http://localhost:5001/api/dashboard?park=${parkCode}`)
      const data = await response.json()
      if (response.ok) {
        setParkInfo(data)
      } else {
        setError(data.error || 'Failed to fetch park information')
      }
    } catch (error) {
      setError('An error occurred while fetching park information')
    } finally {
      setLoading(false)
    }
  }

  const handleParkSelect = (e) => {
    const parkCode = e.target.value
    setSelectedPark(parkCode)
    if (parkCode) {
      fetchParkDashboard(parkCode)
    } else {
      setParkInfo(null)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {username}!</h1>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="park-selection">
        <label htmlFor="park-select">Select a national Park:</label>
        <select id="park-select" value={selectedPark} onChange={handleParkSelect}>
          <option value="">-- Choose a Park --</option>
          {parks.map((p) => (
            <option key={p.parkCode} value={p.parkCode}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="park-loading">Loading information...</p>}
      {error && <p className="park-error">{error}</p>}

      {parkInfo && (
        <div className="park-info-container">
          {parkInfo.weather && (
            <div className="weather-section">
              <h3> Weather Overview</h3>
              <p>{parkInfo.weather}</p>
            </div>
          )}

          {parkInfo.alerts && parkInfo.alerts.length > 0 && (
            <div className="alerts-section">
              <h3> Alerts & Safety</h3>
              {parkInfo.alerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <strong>{alert.title}</strong>
                  <p>{alert.description}</p>
                  {alert.category && (
                    <span className="alert-category">Category: {alert.category}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {parkInfo.roads && parkInfo.roads.length > 0 && (
            <div className="roads-section">
              <h3> Road Conditions</h3>
              {parkInfo.roads.map((road, index) => (
                <div key={index} className="road-item">
                  <strong>{road.name}</strong>
                  <p>Condition: {road.condition}</p>
                </div>
              ))}
            </div>
          )}
          {(!parkInfo.alerts || parkInfo.alerts.length === 0) && 
           (!parkInfo.roads || parkInfo.roads.length === 0) && (
            <div className="no-alerts">
              <p> No current alerts or road closures for this national park.</p>
            </div>
          )}
        </div>
      )}

      <div className="mission-container">
        <div className="mission-section">
          <h2>The solution</h2>
          <p>
            To make nature accessible to everyone. 
            We help Novice Hikers or beginners hikers identify the unfamiliar—from plants and animals to park conditions—so every outdoor moment is a chance to learn
          </p>
        </div>

        <div className="features-section">
          <h2>How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Snap a Photo</h3>
              <p>Take a picture of any plant, animal, or insect you encounter on your hike.</p>
            </div>
            <div className="feature-card">
              <h3>AI Identification</h3>
              <p>Claude AI analyzes the image and extracts key information.</p>
            </div>
            <div className="feature-card">
              <h3>Learn & Explore</h3>
              <p>Get detailed info including origin, safety tips, and fun facts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home