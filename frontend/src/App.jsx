import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Data from './pages/Data'
import './App.css'

function App() {
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
          <NavLink to="/Data" className={({ isActive }) => isActive ? 'active' : ''}>
            History
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Wildfind</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/data" element={<Data />} />
        </Routes>
      </main>
    </div>
  )
}

export default App