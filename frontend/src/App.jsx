import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import MyPosts from './pages/MyPosts';
import SearchUsers from './pages/SearchUsers';
import Profile from './pages/Profile';
// import Profile from './pages/Profile';
// import PostDetail from './pages/PostDetail';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('access'); // Simples exemplo de auth

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
        
        <Route path="/my-posts" element={isAuthenticated ? <MyPosts /> : <Navigate to="/login" />} />
        <Route path="/search-users" element={isAuthenticated ? <SearchUsers /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />

      </Routes>
    </Router>
  );
};

export default App;
