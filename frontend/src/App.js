import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import MovieDetailPage from './components/MovieDetailPage';
import DiscussionPage from './components/DiscussionPage';
import { jwtDecode } from 'jwt-decode'; // Supprimer les accolades pour jwtDecode

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({
        userId: decodedToken.userId,
        firstName: decodedToken.firstName,
        role: decodedToken.role
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem('token', token);
    setUser({
      userId: decodedToken.userId,
      firstName: decodedToken.firstName,
      role: decodedToken.role
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={<HomePage user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/movie/:id"
          element={<MovieDetailPage user={user} />}
        />
        <Route
          path="/discussion/:discussionId"
          element={<DiscussionPage user={user} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
