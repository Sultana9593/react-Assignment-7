import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
  }, []);

  const login = (username, authToken, remember) => {
    setUser(username);
    setToken(authToken);
    if (remember) {
      localStorage.setItem('authUser', username);
      localStorage.setItem('authToken', authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  return (
    <BrowserRouter>
      <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px', color: '#334155' }}>
        
        <nav style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}> Auth & Taskify</h2>
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <Link to="/" style={navLinkStyle}>Home</Link>
            {user && <Link to="/dashboard" style={navLinkStyle}>Protected Dashboard</Link>}
            {!user ? (
              <Link to="/login" style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Login</Link>
            ) : (
              <button onClick={logout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>Logout ({user})</button>
            )}
          </div>
        </nav>

        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} token={token} /> : <Navigate to="/login" />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

const navLinkStyle = {
  color: '#cbd5e1',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '0.95rem'
};

function Home({ user }) {
  return (
    <div style={{ background: '#fff', padding: '50px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h1 style={{ color: '#0f172a', marginBottom: '20px',lineHeight:'1.3' }}>Welcome to Assignment 7 Authentication System</h1>
      <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '20px' }}>Manage secure routes, JWT token simulation, and user sessions seamlessly.</p>
      {user ? <p style={{ color: '#10b981', fontWeight: '600' }}>Logged in as: {user}</p> : <Link to="/login" style={{ background: '#0f172a', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}>Go to Login</Link>}
    </div>
  );
}

function Login({ login }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getPasswordStrength = (pass) => {
    if (!pass) return { text: '', color: '#cbd5e1' };
    if (pass.length < 6) return { text: 'Weak (Min 6 chars)', color: '#ef4444' };
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.match(/[^a-zA-Z0-9]/)) {
      return { text: 'Strong', color: '#10b981' };
    }
    return { text: 'Medium', color: '#f59e0b' };
  };

  const strength = getPasswordStrength(password);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required!');
      return;
    }
    if (!password) {
      setError('Password is required!');
      return;
    }

    const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token_' + Date.now();
    login(username, mockJwtToken, remember);
    navigate('/dashboard');
  };

  return (
    <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', maxWidth: '450px', margin: '0 auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '1.6rem' }}>User Login</h2>
      <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.9rem' }}>Enter your credentials to access the protected dashboard.</p>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '500' }}>{error}</div>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem' }}>Username</label>
          <input 
            type="text" 
            placeholder="Enter username..." 
            value={username} 
            onChange={e => { setUsername(e.target.value); setError(''); }} 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
          <input 
            type="password" 
            placeholder="Enter password..." 
            value={password} 
            onChange={e => { setPassword(e.target.value); setError(''); }} 
            style={inputStyle} 
          />
          {password && (
            <div style={{ marginTop: '6px', fontSize: '0.85rem', fontWeight: '600', color: strength.color }}>
              Password Strength: {strength.text}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="remember" 
            checked={remember} 
            onChange={e => setRemember(e.target.checked)} 
            style={{ width: '16px', height: '16px', cursor: 'pointer' }} 
          />
          <label htmlFor="remember" style={{ fontSize: '0.9rem', cursor: 'pointer', color: '#475569' }}>Remember User</label>
        </div>

        <button type="submit" style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', marginTop: '10px' }}>
          Login
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
};

function Dashboard({ user, token }) {
  return (
    <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>🛡️ Protected Dashboard</h2>
      <p style={{ color: '#64748b', marginBottom: '25px' }}>Welcome back, <strong>{user}</strong>! You have successfully accessed a secure route.</p>
      
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', wordBreak: 'break-all' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Simulated JWT Token:</h4>
        <code style={{ fontSize: '0.85rem', color: '#0369a1', background: '#e0f2fe', padding: '6px 10px', borderRadius: '4px', display: 'block' }}>{token}</code>
      </div>
    </div>
  );
}