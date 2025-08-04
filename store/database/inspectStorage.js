// src/database/inspectStorage.js
import { getDBConnection } from './dbService';
// import RNFS from 'react-native-fs';

export const createInspectTable = async () => {
    const db = await getDBConnection();
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS inspections (
      userId TEXT NOT NULL,
      siteId TEXT NOT NULL,
      uniqueId TEXT PRIMARY KEY NOT NULL,
      inspectionData TEXT NOT NULL
    )`,
    );
};

export const addInspectionData = async (userId, siteId, uniqueId, inspectionData) => {
    const db = await getDBConnection();
    const query = `
    INSERT OR REPLACE INTO inspections (userId, siteId, uniqueId, inspectionData)
    VALUES (?, ?, ?, ?)
  `;
    await db.executeSql(query, [userId, siteId, uniqueId, JSON.stringify(inspectionData)]);
};

export const getInspectionDataByUserAndSite = async (userId, siteId) => {
    const db = await getDBConnection();
    const [results] = await db.executeSql(`SELECT inspectionData FROM inspections WHERE userId = ? AND siteId = ?`, [userId, siteId]);

    const inspections = [];
    for (let i = 0; i < results.rows.length; i++) {
        inspections.push(JSON.parse(results.rows.item(i).inspectionData));
    }

    return inspections;
};

export const updateInspectionByUniqueId = async (uniqueId, updatedData) => {
    const db = await getDBConnection();
    const query = `
    UPDATE inspections SET inspectionData = ?
    WHERE uniqueId = ?
  `;

    const [result] = await db.executeSql(query, [JSON.stringify(updatedData), uniqueId]);

    // If a row was updated, return true
    return result.rowsAffected > 0;
};

export const getAllInspectionData = async () => {
    const db = await getDBConnection();

    const results = await db.executeSql(`SELECT * FROM inspections`);

    const groupedData = {};

    if (results[0].rows.length > 0) {
        for (let i = 0; i < results[0].rows.length; i++) {
            const row = results[0].rows.item(i);
            const key = `${row.userId}_${row.siteId}`;

            if (!groupedData[key]) {
                groupedData[key] = {
                    userId: row.userId,
                    siteId: row.siteId,
                    inspectionList: [],
                };
            }

            groupedData[key].inspectionList.push(JSON.parse(row.inspectionData));
        }
    }

    // Convert grouped object into array format
    return Object.values(groupedData);
};

export const deleteAllInspectionData = async () => {
    const db = await getDBConnection();
    await db.executeSql(`DELETE FROM inspections`);
};
export const deleteInspectionByUniqueId = async uniqueId => {
    const db = await getDBConnection();
    const [result] = await db.executeSql(`DELETE FROM inspections WHERE uniqueId = ?`, [uniqueId]);

    // If a row was deleted, return true; otherwise, return false
    return result.rowsAffected > 0;
};
export const getDatabaseSize = async () => {
    try {
        const db = await getDBConnection();

        const [pageCountResult] = await db.executeSql(`PRAGMA page_count`);
        const [pageSizeResult] = await db.executeSql(`PRAGMA page_size`);

        const pageCount = pageCountResult.rows.item(0).page_count;
        const pageSize = pageSizeResult.rows.item(0).page_size;

        const dbSizeInBytes = pageCount * pageSize;
        const sizeInKB = (dbSizeInBytes / 1024).toFixed(2);
        const sizeInMB = (dbSizeInBytes / (1024 * 1024)).toFixed(2);

        console.log(`📦 DB Size: ${sizeInKB} KB (${sizeInMB} MB)`);

        return { dbSizeInBytes, sizeInKB, sizeInMB };
    } catch (err) {
        console.error('❌ Failed to calculate DB size:', err.message);
        return null;
    }
};
