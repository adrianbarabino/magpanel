import { openDB } from 'idb';

export async function setupDB() {
  const db = await openDB('MagPanel', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('reports')) {

        db.createObjectStore('reports', { keyPath: 'id' });
        db.createObjectStore('reports', { keyPath: 'project_id' });

      }
    },
  });
  return db;
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
  
  const cursor = await store.openCursor();


  while (cursor) {
    console.log(cursor.value);
    if (cursor.value.id == id) { // Filtrar por ID
      console.log(cursor.value)
      project = cursor.value;
    }
    try {
      cursor.continue();
    } catch (error) {
      // Manejo de error cuando el cursor llega al final
      break;
    }
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
