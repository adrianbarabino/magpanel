import { openDB } from 'idb';

let dbInstance = null;
export async function setupDB() {
  if (!dbInstance) {
    dbInstance = await openDB('MagPanel', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reports')) {
          const reportsStore = db.createObjectStore('reports', { keyPath: 'id' });
          reportsStore.createIndex('project_id', 'project_id', { unique: false });
        }
        if (!db.objectStoreNames.contains('locations')) {
          db.createObjectStore('locations', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('clients')) {
          db.createObjectStore('clients', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('projectStatuses')) {
          db.createObjectStore('projectStatuses', { keyPath: 'id' });
        }
        // Agregar el objectStore para archivos si aún no existe
        if (!db.objectStoreNames.contains('files')) {
          const filesStore = db.createObjectStore('files', { keyPath: 'id' });
          filesStore.createIndex('timestamp', 'timestamp', { unique: false });
          // Opcional: Agregar índices adicionales si es necesario
        }
      },
    });
  }
  return dbInstance;
}


export async function loadProjectReportsFromDB(projectId) {
    const db = await setupDB();

    const tx = db.transaction('reports', 'readonly');
    const allReports = await tx.store.getAll();
    console.log(allReports);
    let reports = [];
    for (const report of allReports) {
      if (report.project_id == projectId) {
        reports = [...reports, report];
      }
    }
    
    return reports;
  }

  export async function loadSingleReportFromDB(reportId) {
    const db = await setupDB();
    const tx = db.transaction('reports', 'readonly');
    const allReports = await tx.store.getAll();
    console.log(allReports);
    for (const report of allReports) {
      if (report.id == reportId) {
        return report;
      }
    }
    
  }



  export async function loadSingleProjectFromDB(id) {
    const db = await setupDB();
  
    const tx = db.transaction('projects', 'readonly');
    const store = tx.store;
    let project = {};
  
    // Iniciar el cursor
    let cursor = await store.openCursor();
  
    // Iterar sobre los elementos del cursor
    while (cursor) {
      console.log(cursor.value);
      if (cursor.value.id == id) { // Filtrar por ID
        console.log("Found project")
        console.log(cursor.value);
        project = cursor.value;
        break; // Salir del bucle si encontramos el proyecto deseado
      }
      cursor = await cursor.continue(); // Actualizar el cursor para el siguiente elemento
    }
  
    return project;
  }
  

export async function saveClients (clients) {
  const db = await setupDB();
  const tx = db.transaction('clients', 'readwrite');
  for (const client of clients) {
    tx.store.put(client);
  }
  await tx.done;
}

export async function saveContacts (contacts) {
  const db = await setupDB();
  const tx = db.transaction('contacts', 'readwrite');
  for (const contact of contacts) {
    tx.store.put(contact);
  }
  await tx.done;
}
export async function saveProviders (providers) {
  const db = await setupDB();
  const tx = db.transaction('providers', 'readwrite');
  for (const provider of providers) {
    tx.store.put(provider);
  }
  await tx.done;
}

export async function saveCategories (categories) {
  const db = await setupDB();
  const tx = db.transaction('categories', 'readwrite');
  for (const category of categories) {
    tx.store.put(category);
  }
  await tx.done;
}

export async function saveProjects(projects) {
  const db = await setupDB();
  const tx = db.transaction('projects', 'readwrite');
  for (const project of projects) {
    tx.store.put(project);
  }
  await tx.done;
}

export async function loadProjectsFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('projects', 'readonly');
  return tx.store.getAll();
}

export async function saveProjectStatuses(projectStatuses) {
  const db = await setupDB();
  const tx = db.transaction('projectStatuses', 'readwrite');
  for (const project of projectStatuses) {
    tx.store.put(project);
  }
  await tx.done;
}


export async function saveLocations(locations) {
  const db = await setupDB();
  const tx = db.transaction('locations', 'readwrite');
  for (const location of locations) {
    tx.store.put(location);
  }
  await tx.done;
}


export async function loadProjectStatusesFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('projectStatuses', 'readonly');
  return tx.store.getAll();
}

export async function loadLocationsFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('locations', 'readonly');
  return tx.store.getAll();
}

export async function loadClientsFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('clients', 'readonly');
  return tx.store.getAll();
}

export async function loadContactsFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('contacts', 'readonly');
  return tx.store.getAll();
}

export async function loadProvidersFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('providers', 'readonly');
  return tx.store.getAll();
}

export async function loadCategoriesFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('categories', 'readonly');
  return tx.store.getAll();
}


export async function saveReports(reports) {
  const db = await setupDB();
  // set and index for projectId
  const tx = db.transaction('reports', 'readwrite');
  for (const report of reports) {
    tx.store.put(report);
  }
  await tx.done;
}

export async function loadReportsFromIDB() {
  const db = await setupDB();
  const tx = db.transaction('reports', 'readonly');
  return tx.store.getAll();
}
