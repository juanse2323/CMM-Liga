const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const REPO_OWNER = "juanse2323";
const REPO_NAME = "CMM-Liga";

const LOCAL_STORAGE_KEY = 'ccm_data_';

export const saveToGitHub = async (key: string, data: any): Promise<boolean> => {
  localStorage.setItem(LOCAL_STORAGE_KEY + key, JSON.stringify(data));
  
  if (GITHUB_TOKEN) {
    await commitToGitHub(key, data);
  }
  return true;
};

const commitToGitHub = async (key: string, data: any) => {
  const content = JSON.stringify(data, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(content)));
  
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/data/${key}.json`;
  
  try {
    let sha = '';
    const existing = await fetch(url, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    if (existing.ok) {
      const existingData = await existing.json();
      sha = existingData.sha;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update ${key} from admin panel`,
        content: encoded,
        sha: sha || undefined
      })
    });
    if (response.ok) {
      console.log(`✓ Guardado en GitHub: ${key}.json`);
    }
  } catch (e) {
    console.error('✗ Error guardando en GitHub');
  }
};

export const loadFromLocal = (key: string): any => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY + key);
  return saved ? JSON.parse(saved) : null;
};