export async function openDB(name: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const dbOpenDBRequest = globalThis.indexedDB.open(name, version);
        dbOpenDBRequest.onsuccess = (event) => {
            resolve(dbOpenDBRequest.result)
        }
        dbOpenDBRequest.onerror = (event) => {
            reject(event)
        }
        dbOpenDBRequest.onupgradeneeded = (event) => {
            const db = dbOpenDBRequest.result
            // Test.createObjectStore(db);
        }
    });
}

export async function deleteDB(name: string): Promise<Event> {
    return new Promise((resolve, reject) => {
        const dbOpenDBRequest = globalThis.indexedDB.deleteDatabase(name);
        dbOpenDBRequest.onsuccess = (event) => {
            resolve(event)
        }
        dbOpenDBRequest.onerror = (event) => {
            reject(event)
        }
    });
}

export async function databases(): Promise<IDBDatabaseInfo[]> {
    return await globalThis.indexedDB.databases();
}
