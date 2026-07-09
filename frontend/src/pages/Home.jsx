import { useState } from 'react'

function Home({username, onLogout}) {
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
  
      <div className="mission-container">
          <div className="mission-section">
            <h2>The soultion </h2>
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

