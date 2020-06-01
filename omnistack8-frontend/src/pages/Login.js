import React, { useState } from 'react';

import './Login.css';

import api from '../services/api';

import logo from '../assets/logo.svg';

export default function Login({ history }) {
  const [username, setUserName] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const { data } = await api.post('/devs', { username });

    await history.push(`/dev/${data._id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />
        <input
          placeholder="Digite o seu usuário do Github"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
