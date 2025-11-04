import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning algorithms provide contextual and relevant search results.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get instant results with our optimized search infrastructure and real-time processing.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Enterprise-grade security with privacy-first design and data protection.'
    }
  ];

  return (
    <div className="features" id="features">
      <div className="features-container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;