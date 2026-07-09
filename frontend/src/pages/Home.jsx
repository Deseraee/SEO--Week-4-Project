import { useState } from 'react'

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoggedIn(true)
    console.log("User logged in:", username)
  }

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p className="login-subtitle">Welcome User</p>
          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Log in</button>
          </form>
        </div>

        <div className="mission-container">
          <div className="mission-section">
            <h2>The soultion </h2>
            <p>
            To make nature accessible to everyone. 
            We help non-hikers identify the unfamiliar—from plants and animals to park conditions—so every outdoor moment is a chance to learn
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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {username}!</h1>
        </div>
        <button onClick={() => {
          setIsLoggedIn(false)
          setUsername("")
          setPassword("")
        }} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="welcome-section">
        <h2>Ready to Explore?</h2>
        <p>Go to the Scan page to start identifying!</p>
      </div>
    </div>
  )
}

export default Home

