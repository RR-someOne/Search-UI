import React from 'react';

const Navigation = () => {
  const sidebarItems = [
    'Research'
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-text">Finance Search Tool</span>
        </div>
      </div>
      <div className="sidebar-menu">
        {sidebarItems.map((item, index) => (
          <a key={index} href={`#${item.toLowerCase().replace(' ', '-')}`} className="sidebar-link">
            {item}
          </a>
        ))}
      </div>
      <div className="sidebar-footer">
        <button className="sidebar-login">Log in</button>
      </div>
    </nav>
  );
};

export default Navigation;