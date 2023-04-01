import {Fields, Models} from '../src/models/models';
import {deleteDB, openDB} from '../src/database';

describe('Model', () => {
    const name = 'test';
    const version = 1;
    let db: IDBDatabase | undefined = undefined;
    beforeEach(async () => {
        db = await openDB(name, version);
    });

    afterEach( async () => {
        db?.close();
        await deleteDB(name);
    });
    test('', async () => {
    });
});
