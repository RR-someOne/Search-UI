import React from 'react';
import './App.css';
import Navigation from './components/client/Navigation';
import Hero from './components/client/Hero';
import SearchInterface from './components/client/SearchInterface';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <div className="chat-container">
          <Hero />
          <SearchInterface />
        </div>
      </main>
    </div>
  );
}

export default App;
