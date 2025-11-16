import './App.css';
import { EventProvider } from './context/EventContext';
import { PomodoroProvider } from './context/PomodoroContext';
import Layout from './layout/Layout';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CalendarPage from './calendar/CalendarPage'
import EventsPage from './pages/EventsPage'
import SettingsPage from './pages/SettingsPage'
import PomodoroPage from './pages/PomodoroPage'
import WorldClockPage from './pages/WorldClockPage'

function App() {
  return (
    <EventProvider>
      <PomodoroProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/calendar" element={<CalendarPage/>} />
              <Route path="/events" element={<EventsPage/>} />
              <Route path="/pomodoro" element={<PomodoroPage/>} />
              <Route path="/world-clock" element={<WorldClockPage/>} />
              <Route path="/settings" element={<SettingsPage/>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </PomodoroProvider>
    </EventProvider>
  );
}

export default App;
