import { writable } from 'svelte/store';

// Objeto inicial para los metadatos
const defaultMeta = {
  title: 'Título Predeterminado',
  slug: 'slug-predeterminado',
};

// Store para manejar los metadatos
export const pageMeta = writable(defaultMeta);
export const isOnline = writable(navigator.onLine);

// Añadir listeners para actualizar el store
window.addEventListener('online', () => isOnline.set(true));
window.addEventListener('offline', () => isOnline.set(false));
