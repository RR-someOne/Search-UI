import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">EHS</div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">Home</li>
          <li>Search</li>
          <li>Your Library</li>
        </ul>
      </nav>
      <div className="sidebar-footer">&copy; 2025 EHS Wireframe</div>
    </aside>
  );
}

export default Sidebar;
