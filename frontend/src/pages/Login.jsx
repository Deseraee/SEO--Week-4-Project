import { useState } from 'react'

function Login({onLogin}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    onLogin(username)
  }
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
                </div>
                )
            }
export default Login 