
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Symptoms from './pages/Symptoms'
import './App.css'
import Statistics from './pages/Statistics'
import HealthLibrary from './pages/HealthLibrary'
import Settings from './pages/Settings'


function App() {
  return (
    <HashRouter>
      <div className="app">
        <header>
          <h1>🌸 Luna</h1>
          <p>Your personal period tracker</p>

          <nav>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/calendar">Calendar</NavLink>
            <NavLink to="/symptoms">Symptoms</NavLink>
            <NavLink to="/statistics">Statistics</NavLink>
            <NavLink to="/health">Health Library</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/health" element={<HealthLibrary />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
