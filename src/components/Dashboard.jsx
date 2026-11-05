// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import * as scraperApi from '../services/scraperApi';

const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [heroesCount, setHeroesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [heroIdInput, setHeroIdInput] = useState('');

  useEffect(() => {
    loadStatus();
    loadHeroesCount();
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setLogs(prev => [`[${timestamp}] ${icon} ${message}`, ...prev]);
  };

  const loadStatus = async () => {
    try {
      const data = await scraperApi.getStatus();
      setStatus(data);
    } catch (error) {
      setStatus({ error: error.message });
    }
  };

  const loadHeroesCount = async () => {
    try {
      const data = await scraperApi.getHeroes();
      setHeroesCount(data.count);
    } catch (error) {
      console.error('Error cargando héroes:', error);
    }
  };

  const handleScrapeHero = async () => {
    if (!heroIdInput) return;
    setLoading(true);
    addLog(`Iniciando scraping del héroe ${heroIdInput}...`);

    try {
      const res = await scraperApi.scrapeHero(heroIdInput);
      addLog(`Héroe ${res.details.name || heroIdInput} scrapeado correctamente`, 'success');
      setHeroIdInput('');
      loadHeroesCount();
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeNewHeroes = async () => {
    setLoading(true);
    addLog('Buscando héroes nuevos...');

    try {
      const res = await scraperApi.scrapeNewHeroes();
      if (res.newHeroes === 0) {
        addLog('No hay héroes nuevos', 'info');
      } else {
        addLog(`${res.newHeroes} héroes nuevos encontrados y scrapeados`, 'success');
      }
      loadHeroesCount();
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeHome = async () => {
    setLoading(true);
    addLog('Scrapeando home...');

    try {
      const res = await scraperApi.scrapeHome();
      addLog(`Home scrapeado: ${res.data.slider.length} héroes en slider`, 'success');
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎯 ML Scraper Admin</h1>
        <span className="version">v1.0</span>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Estado del Backend</h3>
          {status?.error ? (
            <p className="error">❌ {status.error}</p>
          ) : status ? (
            <p className="success">✅ Conectado</p>
          ) : (
            <p>⏳ Verificando...</p>
          )}
        </div>

        <div className="stat-card">
          <h3>Héroes en Firebase</h3>
          <p className="big-number">{heroesCount}</p>
        </div>
      </div>

      <div className="actions-grid">
        <button
          className="action-btn primary"
          onClick={handleScrapeNewHeroes}
          disabled={loading}
        >
          🔍 Scrapear Héroes Nuevos
        </button>

        <button
          className="action-btn secondary"
          onClick={handleScrapeHome}
          disabled={loading}
        >
          🏠 Scrapear Home
        </button>
      </div>

      <div className="hero-scraper">
        <h2>Scrapear Héroe Individual</h2>
        <div className="input-group">
          <input
            type="number"
            placeholder="Hero ID (ej. 133)"
            value={heroIdInput}
            onChange={e => setHeroIdInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScrapeHero()}
            disabled={loading}
          />
          <button onClick={handleScrapeHero} disabled={loading || !heroIdInput}>
            Scrapear
          </button>
        </div>
      </div>

      <div className="logs">
        <div className="logs-header">
          <h2>Logs</h2>
          <button onClick={() => setLogs([])}>Limpiar</button>
        </div>
        <div className="logs-content">
          {logs.length === 0 ? (
            <p className="empty">No hay logs todavía</p>
          ) : (
            logs.map((log, i) => <div key={i} className="log-line">{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;