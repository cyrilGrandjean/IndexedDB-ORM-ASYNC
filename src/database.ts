import {Models} from './models';

export async function openDB(name: string, version: number, models: typeof Models[] = []): Promise<IDBDatabase> {
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
            models.forEach((model) => {
                const objectStore = model.createObjectStore(db);
                model.createIndex(objectStore);
            });
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
