import { writable } from 'svelte/store';

// Objeto inicial para los metadatos
const defaultMeta = {
  title: 'Título Predeterminado',
  slug: 'slug-predeterminado',
};

// Store para manejar los metadatos
export const pageMeta = writable(defaultMeta);
