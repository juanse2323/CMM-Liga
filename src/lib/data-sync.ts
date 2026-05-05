/**
 * Sincronización centralizada entre Python, GitHub y React
 * IMPORTANTE: public/data.json es la fuente única de verdad
 */

export const DATA_PATHS = {
    source: '/data.json', // URL pública (React fetch desde aquí)
    github: 'public/data.json' // Ruta en repo (Python escribe aquí)
};

export type DataKey = 'clubes' | 'partidos' | 'noticias';

interface SyncOptions {
    token: string;
    message?: string;
}

/**
 * Sincroniza una sección de datos con GitHub
 * Lee public/data.json completo, actualiza una sección, guarda todo
 */
export async function syncDataWithGitHub(
    dataKey: DataKey,
    content: any,
    options: SyncOptions
): Promise<boolean> {
    const { token, message = `Update ${dataKey} - ${new Date().toISOString()}` } = options;

    if (!token) {
        console.warn('⚠️ No GitHub token provided, skipping sync');
        return false;
    }

    const REPO_OWNER = 'juanse2323';
    const REPO_NAME = 'CMM-Liga';
    const FILE_PATH = DATA_PATHS.github;

    try {
        // 1. Obtener SHA actual del archivo
        const fileUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

        const fileRes = await fetch(fileUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!fileRes.ok) {
            throw new Error(`Failed to fetch file: ${fileRes.status}`);
        }

        const fileData = await fileRes.json();
        const sha = fileData.sha;
        const currentContent = JSON.parse(atob(fileData.content));

        // 2. Actualizar solo la sección específica
        const updated = {
            ...currentContent,
            [dataKey]: content
        };

        // 3. Codificar y enviar a GitHub
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));

        const updateRes = await fetch(fileUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                content: encoded,
                sha
            })
        });

        if (!updateRes.ok) {
            throw new Error(`Failed to update file: ${updateRes.status}`);
        }

        console.log(`✅ Sincronizado ${dataKey} en GitHub`);
        return true;

    } catch (error) {
        console.error(`❌ Error sincronizando ${dataKey}:`, error);
        return false;
    }
}

/**
 * Fetch con no-cache para evitar problemas de cache del navegador
 */
export async function fetchDataWithNoCache(url: string = DATA_PATHS.source) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Error fetching data:', error);
        return null;
    }
}