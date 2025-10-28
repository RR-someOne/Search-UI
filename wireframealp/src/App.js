

import './App.css';

function App() {
  return (
    <div className="spotify-app">
      <aside className="sidebar">
        <div className="sidebar-logo">EHS</div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">Home</li>
            <li>Memory System</li>
            <li></li>
          </ul>
        </nav>
        <div className="sidebar-footer">&copy; 2025 EHS Wireframe</div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
             <div className="sidebar-logo">EHS Platform</div>
          </div>
          <div className="header-right">
            <div className="profile-placeholder">Login</div>
          </div>
        </header>
        <section className="section">
          <h2>Systems</h2>
          <div className="card-row">
            <div className="card">Subsytem One</div>
            <div className="card">Subsytem Two</div>
            <div className="card">Subsytem Three</div>
            <div className="card">Subsytem Four</div>
            <div className="card">Subsytem Five</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
