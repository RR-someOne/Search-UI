

import './App.css';
import MemoryServiceHomePage from './components/MemoryServiceHomePage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
  <Route path="/memory-journaling" element={<MemoryServiceHomePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="spotify-app">
      <aside className="sidebar">
        <div className="sidebar-logo">Health and Wellness Personal Use</div>
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
             <div className="sidebar-logo">EHS Platform Personal Use</div>
          </div>
          <div className="header-right">
            <div className="profile-placeholder">Login</div>
          </div>
        </header>
        <section className="section">
          <h2>Systems</h2>
          <div className="card-row">
            <div className="card" style={{cursor: 'pointer'}} onClick={() => navigate('/memory-journaling')}>Memory System Journaling</div>
            <div className="card">Diet Tracking using LLM/Food based on illnesses</div>
            <div className="card">Memoir LLM's with GenAI for pictures IOS/Google</div>
            <div className="card">Advanced Task Manager based on memories/queries</div>
            <div className="card">Search System for AI based Models/Medical Research/Finance</div>
             <div className="card">EHS Records Systems</div>
            <div className="card">Travel Search Advisory/News</div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ...existing code...

export default App;
