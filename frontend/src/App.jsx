import { Routes, Route, NavLink } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Data from './pages/Data'
import Login from './pages/Login'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  
  const handleLogin = (username) => {
    setIsLoggedIn(true)
    setUsername(username)
    console.log("User logged in:", username)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>Wildfind</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>

          <NavLink to="/scan" className={({ isActive }) => isActive ? 'active' : ''}>
            Scan
          </NavLink>

          <NavLink to="/data" className={({ isActive }) => isActive ? 'active' : ''}>
            History
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Wildfind</h1>

        <Routes>
          <Route path="/" element={<Home username={username} onLogout={handleLogout} />} />
          <Route path="/scan" element={<Scan username={username} />} />
          <Route path="/data" element={<Data username={username} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App