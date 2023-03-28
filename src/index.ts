import {databases, deleteDB, openDB} from './utils/database.js';

async function main() {
    await deleteDB('test').catch(console.error);
    const db = await openDB('test',1);
    console.log(await databases());
}

main().catch(console.error)
