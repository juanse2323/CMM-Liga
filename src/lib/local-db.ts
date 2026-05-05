import { DataKey, syncDataWithGitHub } from './data-sync';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const LOCAL_STORAGE_KEY = 'ccm_';

/**
 * Guarda en localStorage + intenta sincronizar con GitHub
 */
export const saveToGitHub = async (key: DataKey, data: any): Promise<boolean> => {
  // 1. Guardar en localStorage siempre
  localStorage.setItem(LOCAL_STORAGE_KEY + key, JSON.stringify(data));
  
  // 2. Sincronizar con GitHub si hay token
  if (GITHUB_TOKEN) {
    try {
      await syncDataWithGitHub(key, data, { token: GITHUB_TOKEN });
    } catch (error) {
      console.error(`Error syncing ${key} to GitHub:`, error);
    }
  } else {
    console.warn('⚠️ VITE_GITHUB_TOKEN no configurado en .env.local');
  }
  
  return true;
};

export const loadFromLocal = (key: string): any => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY + key);
  return saved ? JSON.parse(saved) : null;
};
