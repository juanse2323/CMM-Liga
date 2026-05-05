import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAU-ynA1gYrGGUk8lHbLtWblQc5sRaIbNs",
  authDomain: "ccm-liga.firebaseapp.com",
  projectId: "ccm-liga",
  storageBucket: "ccm-liga.firebasestorage.app",
  messagingSenderId: "956411275900",
  appId: "1:956411275900:web:97a3c6b1aeb0545da1f7f9"
};

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const REPO_OWNER = "juanse2323";
const REPO_NAME = "CMM-Liga";

let app;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✓ Firebase inicializado correctamente');
} catch (e: any) {
  console.error('✗ Error inicializando Firebase:', e.message || e);
}

export const saveToFirebase = async (collectionName: string, data: any): Promise<boolean> => {
  if (!db) {
    console.error('✗ Firestore no está disponible');
    return false;
  }
  try {
    const dataToSave = Array.isArray(data) ? { items: data } : data;
    await setDoc(doc(db, collectionName, 'data'), dataToSave, { merge: true });
    console.log(`✓ Guardado en Firebase ${collectionName}`);
    
    await commitToGitHub(collectionName, data);
    return true;
  } catch (error: any) {
    console.error(`✗ Error en ${collectionName}:`, error?.message || error);
    return false;
  }
};

const commitToGitHub = async (collectionName: string, data: any) => {
  if (!GITHUB_TOKEN) return;
  
  const content = JSON.stringify(data, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(content)));
  
  try {
    const existing = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/data/${collectionName}.json`, {
      headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const existingData = await existing.json();
    const sha = existingData.sha;
    
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/data/${collectionName}.json`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update ${collectionName} from admin panel`,
        content: encoded,
        sha: sha
      })
    });
    if (response.ok) {
      console.log(`✓ Guardado en GitHub: ${collectionName}.json`);
    }
  } catch (e) {
    console.error('✗ Error guardando en GitHub');
  }
};

export const loadFromFirebase = async (collectionName: string): Promise<any | null> => {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, collectionName, 'data'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.items || data;
    }
    return null;
  } catch (error) {
    console.error(`✗ Error cargando de ${collectionName}:`, error);
    return null;
  }
};

export const subscribeToFirebase = (collectionName: string, callback: (data: any) => void) => {
  if (!db) return () => {};
  return onSnapshot(doc(db, collectionName, 'data'), (doc) => {
    if (doc.exists()) callback(doc.data());
  });
};

export { db };