function Home() {
   return (
     <div className="login-page">
       <div className="login-card">
         <p className="login-subtitle">Welcome User</p>
         <form className="login-form">
           <div>
             <label>Username</label>
             <input type="text" name="username" placeholder="Enter your username" />
           </div>
           <div>
             <label>Password</label>
             <input type="password" name="password" placeholder="Enter your password" />
           </div>
           <button type="submit" className="login-btn">Log in</button>
         </form>
       </div>
     </div>
   )
 }
 
 export default Home

