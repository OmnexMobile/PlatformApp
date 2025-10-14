import { successMessage } from 'helpers/utils';
import SQLite from 'react-native-sqlite-storage';
 
SQLite.enablePromise(true);
 
export const getDBConnection = async () => {
    try {
        const db = await SQLite.openDatabase({
            name: 'inspection.db',
            location: 'default',
        });
        console.log('✅ SQLite DB connected successfully!');
        return db;
    } catch (error) {
        console.error('❌ Failed to connect to SQLite DB:', error);
        throw Error('SQLite DB connection failed');
    }
};
 