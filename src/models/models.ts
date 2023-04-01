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
    static options?: IDBObjectStoreParameters = undefined;
    static propertyModelDatas: PropertyData[];

    static createObjectStore(db: IDBDatabase): IDBObjectStore {
        return db.createObjectStore(this.name, this.options);
    }

    public static get properties(): PropertyData[] {
        return (<typeof Models>this.prototype).propertyModelDatas;
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
