interface Options {
    primary?: boolean;
    unique?: boolean;
    multiEntry?: boolean;
    default?: any;
    nullable?: boolean;
}

interface PropertyData extends Options {
    name: string,
    type: any,
}

export class Models {
    static propertyModelDatas: PropertyData[];
    static database: IDBDatabase;

    public static get properties(): PropertyData[] {
        return (<typeof Models>this.prototype).propertyModelDatas;
    }

    public static get db(): IDBDatabase {
        return (<typeof Models>this.prototype).database;
    }

    public static set db(database: IDBDatabase) {
        (<typeof Models>this.prototype).database = database;
    }

    public static createObjectStore(db: IDBDatabase): IDBObjectStore {
        const options: IDBObjectStoreParameters = {};
        options.keyPath = this.properties
            .filter((property) => property.primary)
            .map((property) => property.name);
        return db.createObjectStore(this.name, options);
    }

    public static createIndex(objectStore: IDBObjectStore) {
        this.properties.forEach((propertyData) => {
            objectStore.createIndex(
                propertyData.name,
                propertyData.name,
                {
                    multiEntry: propertyData.multiEntry,
                    unique: propertyData.unique
                }
            );
        });
    }

    public static async getAll() {
        return new Promise((resolve, reject) => {
            const trans = this.db.transaction(this.name, 'readonly');
            const object = trans.objectStore(this.name);
            const iDBRequest: IDBRequest<typeof this[]> = object.getAll();
            trans.commit();
            iDBRequest.onsuccess = (event) => {
                resolve(iDBRequest.result);
            };
            iDBRequest.onerror = (event) => {
                reject(event);
            };
        });
    }

    public static async add(item: any) {
        return new Promise((resolve, reject) => {
            const trans = this.db.transaction(this.name, "readwrite");
            const object = trans.objectStore(this.name);
            const iDBRequest = object.add(item);
            trans.commit();
            iDBRequest.onsuccess = (event) => {
                resolve(iDBRequest.result);
            };
            iDBRequest.onerror = (event) => {
                reject(event);
            };
        });
    }
}

export function Fields(options: Options): (target: any, propertyName: any) => void {
    return (target: any, propertyName: any): void => {
        const propertyType = Reflect.getMetadata("design:type", target, propertyName);
        let propertyData: PropertyData;
        propertyData = <PropertyData>options;
        propertyData.name = propertyName;
        propertyData.type = propertyType;
        if (!target.propertyModelDatas) {
            target.propertyModelDatas = [propertyData];
        } else {
            target.propertyModelDatas.push(propertyData);
        }
    }
}
