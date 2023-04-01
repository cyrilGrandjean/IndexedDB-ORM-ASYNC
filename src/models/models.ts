export class Models {
    static createObjectStore(db: IDBDatabase) {
        const objectStore = db.createObjectStore(this.name);
        this.createIndex(objectStore);
    }

    private static get properties(): { [p: string]: PropertyDescriptor } {
        const instance = new this();
        return Object.getOwnPropertyDescriptors(instance);
    }

    private static createIndex(objectStore: IDBObjectStore) {
        for (let [name, value] of Object.entries(this.properties)) {
            console.log(name, value.value);
            // objectStore.createIndex(name, name, value.value.options)
        }
    }
}


interface Options {
    primary?: boolean;
    default?: any;
    nullable?: boolean;
}

export function Fields<T>(options: Options) {
    return (target: any, propertyName: string) => {
        const propertyType = Reflect.getMetadata("design:type", target, propertyName);
        console.log(target)
    }
}
