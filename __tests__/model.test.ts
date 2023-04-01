import {deleteDB, openDB} from '../src/database';
import {Fields, Models} from '../src/models/models';
class TestModel extends Models {
    @Fields({}) name: string = 'test';
    @Fields({}) age: number = 132;
}

describe('Model', () => {
    const name = 'test';
    const version = 1;
    let db: IDBDatabase | undefined = undefined;
    beforeEach(async () => {
        db = await openDB(name, version, [TestModel]);
    });

    afterEach( async () => {
        db?.close();
        await deleteDB(name);
    });
    test('Create Object Store', async () => {
        if (db) {
            expect(db.objectStoreNames).toContain(TestModel.name)
        }
    });
    test('Create Index', async () => {
        if (db) {
            const trans1 = db.transaction(TestModel.name, "readwrite");
            const objectStore1 = trans1.objectStore(TestModel.name);
            const valueVerify =  TestModel.properties.map((property) => property.name);
            valueVerify.forEach((name) =>{
                expect(objectStore1.indexNames).toContain(name)
            });
        }
    });
});
