import React from 'react';
import '../App.css';

function JournalPage() {
  return (
    <div className="spotify-app">
      <aside className="sidebar">
        <div className="sidebar-logo">Health and Wellness Personal Use</div>
        <nav className="sidebar-nav">
          <ul>
            <li>Home</li>
            <li className="active">Journaling</li>
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
          <h2>Journal Page</h2>
          <div style={{marginTop: '24px', fontSize: '1.1rem'}}>Add word document style notebook</div>
        </section>
      </main>
    </div>
  );
}

export default JournalPage;
