interface Options<T> {
    primary?: boolean;
    unique?: boolean;
    multiEntry?: boolean;
    default?: T;
    nullable?: boolean;
}

interface PropertyData<T> extends Options<T> {
    name: string,
    type: any,
}

type PropertyModelDatas = PropertyData<any>[]

export class Models {
    static propertyModelDatas: PropertyModelDatas;
    static database: IDBDatabase;

    public static get properties(): PropertyModelDatas {
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
            const iDBRequest = object.add(this.createItem(item));
            trans.commit();
            iDBRequest.onsuccess = (event) => {
                resolve(iDBRequest.result);
            };
            iDBRequest.onerror = (event) => {
                reject(event);
            };
        });
    }

    private static createItem(item: any): { [key: string]: any }{
        const tmpItem: { [key: string]: any } = {};
        this.properties.forEach((property) => {
            if (item[property.name] !== undefined) {
                tmpItem[property.name] = item[property.name];
            } else if (property.default !== undefined) {
                tmpItem[property.name] = property.default;
            } else if (property.nullable) {
                tmpItem[property.name] = null;
            } else {
                throw new Error(`Missing value for property name: ${property.name}`);
            }
        });
        return tmpItem;
    }
}

export function Fields<T>(options: Options<T>): (target: any, propertyName: any) => void {
    return (target: any, propertyName: any): void => {
        const propertyType = Reflect.getMetadata("design:type", target, propertyName);
        let propertyData: PropertyData<T>;
        propertyData = <PropertyData<T>>options;
        propertyData.name = propertyName;
        propertyData.type = propertyType;
        if (!target.propertyModelDatas) {
            target.propertyModelDatas = [propertyData];
        } else {
            target.propertyModelDatas.push(propertyData);
        }
    }
}
