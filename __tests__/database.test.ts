import {databases, deleteDB, openDB} from '../src/database';

describe('databases', () => {
    const name = 'test';
    const version = 1;
    test('Open Database', async () => {
        const db = await openDB(name, version);
        expect(db).not.toEqual(undefined);
        db.close()
    });
    test('Get All Databases', async () => {
        const result = await databases();
        expect(result).toEqual([{name, version}])
    });
    test('Delete Database', async () => {
        await deleteDB(name);
    });
});


