import {deleteDB, openDB} from '../src/database';
import {Fields, Models} from '../src/models';

class TestModel extends Models {
    @Fields({primary: true}) name!: string;
    @Fields({default: 10}) age?: number;
}

class TestAddModel extends Models {
    @Fields({primary: true}) prenom!: string;
    @Fields({}) hauteur!: number;
}

describe('Model', () => {
    const name = 'test';
    const version = 1;
    let db: IDBDatabase | undefined = undefined;
    beforeEach(async () => {
        db = await openDB(name, version, [TestModel, TestAddModel]);
    });

    afterEach(async () => {
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
            const valueVerify = TestModel.properties.map((property) => property.name);
            valueVerify.forEach((name) => {
                expect(objectStore1.indexNames).toContain(name)
            });
        }
    });
    test('Add Item In Database', async () => {
        if (db) {
            const item: TestModel = {
                name: "cyril",
                age: 15
            }
            await TestModel.add(item);
        }
    });
    test('Get All object in Table', async () => {
        if (db) {
            const itemTestModel: TestModel = {
                name: "cyril",
                age: 15
            }
            await TestModel.add(itemTestModel);
            const itemTestModel2: TestModel = {
                name: "carlos",
                age: 15
            }
            await TestModel.add(itemTestModel2);
            const itemTestModel3: TestModel = {
                name: "mika"
            }
            await TestModel.add(itemTestModel3);
            const itemTestAddModel: TestAddModel = {
                prenom: "cyril",
                hauteur: 15
            }
            await TestAddModel.add(itemTestAddModel);
            console.log(await TestModel.getAll());
        }
    });
});
