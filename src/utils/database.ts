import {Models} from '../models/models.js';

interface Options {
    primary?: boolean;
    default?: any;
    nullable?: boolean;
}

function Fields<T>(options: Options) {
    return (target: any, propertyName: string) => {
        const propertyType = Reflect.getMetadata("design:type", target, propertyName);
        console.log(options);
        console.log(target);
        console.log(propertyName);
        console.log(propertyType);
    }
};

class Test extends Models {
    @Fields({}) name: string = 'chat';
    age!: number;
}

export async function openDB(name: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const dbOpenDBRequest = window.indexedDB.open(name, version);
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
        const dbOpenDBRequest = window.indexedDB.deleteDatabase(name);
        dbOpenDBRequest.onsuccess = (event) => {
            resolve(event)
        }
        dbOpenDBRequest.onerror = (event) => {
            reject(event)
        }
    });
}

export async function databases(): Promise<IDBDatabaseInfo[]> {
    return await window.indexedDB.databases();
}
