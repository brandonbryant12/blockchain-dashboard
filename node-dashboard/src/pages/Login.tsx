import React, { useState } from 'react';
import apiClient from '../api/client';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await apiClient.post('/login', { password });
      // Redirect to dashboard or update state
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
