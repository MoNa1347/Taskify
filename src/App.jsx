import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Pages/LoginForm/LoginForm'
import LandingPage from './Pages/LandingPage/LandingPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import TasksPage from './Pages/TasksPage/TasksPage';
function App() {
  

  return <div className="app-container">
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </Router>
  </div>
}

export default App
