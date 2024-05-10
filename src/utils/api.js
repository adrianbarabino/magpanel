import { openDB } from 'idb';
import { isOnline } from '../stores.js'; // Importa desde el archivo JS

// Importar funciones de db.js para interactuar con la base de datos
import { saveProjects, saveClients, loadClientsFromIDB, saveCategories, loadCategoriesFromIDB, loadProjectsFromIDB, saveReports, loadReportsFromIDB } from './db';
import { get } from 'svelte/store';
let dbInstance = null;
let online = get(isOnline);
async function setupDB() {
  if (!dbInstance) {
    dbInstance = await openDB('MagPanel', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id' });
        }
      },
    });
  }
  return dbInstance;
}

export async function getClients(id = null) {

  try {
    if (online) {
      if(id){
        const response = await fetch(`https://api.mag-servicios.com/clients/${id}`, {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        });
        const client = await response.json();
        return client;
      }else{
        const response = await fetch('https://api.mag-servicios.com/clients', {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        });
        const clients = await response.json();
        // save to indexedDB
        await saveClients(clients);
        return clients;
      }
    } else {
      clients = await loadClientsFromIDB();
      return clients;
    }
  } catch (error) {
    console.error("Error fetching clients: ", error);
    return [];
  }
}


export async function getCategories() {
  try {
    if (online) {
      const response = await fetch('https://api.mag-servicios.com/categories', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
      });
      const categories = await response.json();
      await saveCategories(categories);
      return categories;
    }else{
      const categories = await loadCategoriesFromIDB();
      return categories;

    }
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return [];
  }
}
export async function loadProjectReportsFromDB(projectId) {
  const db = await setupDB();
  const reports = await db.getAllFromIndex('reports', 'project_id', projectId);
  return reports;
}
export async function loadSingleProjectFromDB(id) {
  const db = await setupDB();
  const project = await db.get('projects', id);
  return project;
}
export async function loadProjectsAndReportsFromDB() {
  const db = await setupDB();
  const projectsTx = db.transaction('projects', 'readonly');
  const reportsTx = db.transaction('reports', 'readonly');
  const projects = await projectsTx.store.getAll();
  const reports = await reportsTx.store.getAll();

  return {projects, reports};
}
export async function fetchAndStoreInitialData() {
  const db = await setupDB();
  try {
    // Fetch the last 3 projects
    const projectsResponse = await fetch('https://api.mag-servicios.com/projects?limit=3', {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}
    });
    const projects = await projectsResponse.json();

    // Store projects in IndexedDB
    let projectsTx = db.transaction('projects', 'readwrite');
    projects.forEach(project => {
      projectsTx.store.put(project);
    });
    // Ensure transaction is complete before starting another
    await projectsTx.done;

    // Fetch and store reports for each project
    const reportsResponse = await fetch(`https://api.mag-servicios.com/reports/all`, {
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}
      });
      let reports = await reportsResponse.json();
      console.log(reports);
      let reportsTx = db.transaction('reports', 'readwrite');
      // if reports is null, return early
      if (!reports) {
        await reportsTx.done;
        // explain me how works the await here
        // await reportsTx.done; is a promise that resolves when the transaction is complete
        // if reports is null, there is no need to wait for the transaction to complete
        // so we can return early

      }else{
        // check if reports is an array
        if (!Array.isArray(reports)) {
          reports = [reports];
        }
        reports.forEach(report => {
          reportsTx.store.put(report);
        });
        // Ensure transaction is complete before moving to the next project
        await reportsTx.done;
      }

  } catch (error) {
    console.error('Failed to fetch or store initial data:', error);
  }
}


export async function fetchProjects() {
  try {
    const response = await fetch('https://api.mag-servicios.com/projects', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
    });
    const projects = await response.json();
    await saveProjects(projects);
    return projects;
    
  } catch (error) {
    console.error("Error fetching projects: ", error);
    // Intentar cargar desde IDB si hay un error
    return loadProjectsFromIDB();
  }
}

export async function fetchReports(projectId) {
  try {
    const response = await fetch(`https://api.mag-servicios.com/projects/${projectId}/reports`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
    });
    const reports = await response.json();
    await saveReports(reports);
    return reports;
  } catch (error) {
    console.error("Error fetching reports: ", error);
    // Intentar cargar desde IDB si hay un error
    return loadReportsFromIDB();
  }
}
