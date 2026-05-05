/**
 * Resuelve URLs de assets según el entorno
 * Maneja rutas relativas e imágenes locales
 */
export function getAssetUrl(path: string): string {
    // Si es URL externa, retornar tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Si es ruta relativa local (/images/...), usar tal cual
    if (path.startsWith('/')) {
        return path;
    }

    // Si es ruta relativa, añadir /
    return `/${path}`;
}

/**
 * Genera nombre único para imágenes
 */
export function generateImageName(clubId: string, extension: string = 'webp'): string {
    return `club-${clubId}-${Date.now()}.${extension}`;
}