// src/services/scraperApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 300000 // 5 minutos (el scraping puede tardar)
});

export const getStatus = () => api.get('/api/status').then(r => r.data);

export const getHeroes = () => api.get('/api/heroes').then(r => r.data);

export const scrapeHero = (heroId) =>
  api.post(`/api/scrape/hero/${heroId}`).then(r => r.data);

export const scrapeNewHeroes = () =>
  api.post('/api/scrape/new-heroes').then(r => r.data);

export const scrapeHome = () =>
  api.post('/api/scrape/home').then(r => r.data);

export default {
  getStatus,
  getHeroes,
  scrapeHero,
  scrapeNewHeroes,
  scrapeHome
};