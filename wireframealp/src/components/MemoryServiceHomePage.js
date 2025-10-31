import React from 'react';
import '../App.css';

function MemoryServiceHomePage() {
  return (
    <div className="spotify-app">
      <aside className="sidebar">
        <div className="sidebar-logo">Health and Wellness Personal Use</div>
        <nav className="sidebar-nav">
          <ul>
            <li>Home</li>
            <li className="active">Memory System</li>
            <li></li>
          </ul>
        </nav>
        <div className="sidebar-footer">&copy; 2025 EHS Wireframe</div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
             <div className="sidebar-logo">EHS Platform Personal Use</div>
          </div>
          <div className="header-right">
            <div className="profile-placeholder">Login</div>
          </div>
        </header>
        <section className="section">
          <h2>Memory System Journaling</h2>
          <div className="card-row">
            <div className="card" style={{cursor: 'pointer'}}>Journaling</div>
            <div className="card" style={{cursor: 'pointer'}}>Memories Query Service</div>
            <div className="card" style={{cursor: 'pointer'}}>Memories Picture Service</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MemoryServiceHomePage;
