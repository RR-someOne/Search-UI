import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#features' },
        { text: 'API', href: '#api' },
        { text: 'Pricing', href: '#pricing' }
      ]
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#about' },
        { text: 'Blog', href: '#blog' },
        { text: 'Careers', href: '#careers' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { text: 'Documentation', href: '#docs' },
        { text: 'Support', href: '#support' },
        { text: 'Status', href: '#status' }
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-title">Search Tool with Gen AI</span>
            <p className="footer-description">Powered by advanced AI and modern web technologies</p>
          </div>
          <div className="footer-links">
            {footerSections.map((section, index) => (
              <div key={index} className="footer-section">
                <h4 className="footer-section-title">{section.title}</h4>
                {section.links.map((link, linkIndex) => (
                  <a key={linkIndex} href={link.href} className="footer-link">
                    {link.text}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Search Tool with Gen AI. Built with React and GitHub Actions CI/CD.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;