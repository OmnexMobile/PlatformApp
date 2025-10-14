// src/database/inspectStorage.js
import { getDBConnection } from './dbService';
 
const CHUNK_SIZE = 1.5 * 1024 * 1024; // 1.5MB
 
export const createInspectTable = async () => {
    const db = await getDBConnection();
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS inspections (
            userId TEXT NOT NULL,
            siteId TEXT NOT NULL,
            uniqueId TEXT NOT NULL,
            chunkIndex INTEGER NOT NULL,
            inspectionData TEXT NOT NULL,
            PRIMARY KEY (uniqueId, chunkIndex)
        )`
    );
};
 
export const addInspectionData = async (userId, siteId, uniqueId, inspectionData) => {
    const db = await getDBConnection();
    const jsonData = JSON.stringify(inspectionData);
 
    const chunks = [];
    for (let i = 0; i < jsonData.length; i += CHUNK_SIZE) {
        chunks.push(jsonData.slice(i, i + CHUNK_SIZE));
    }
 
    await db.executeSql('DELETE FROM inspections WHERE uniqueId = ?', [uniqueId]);
 
    for (let index = 0; index < chunks.length; index++) {
        await db.executeSql(
            `INSERT INTO inspections (userId, siteId, uniqueId, chunkIndex, inspectionData)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, siteId, uniqueId, index, chunks[index]]
        );
    }
};
 
export const getInspectionDataByUserAndSite = async (userId, siteId) => {
    const db = await getDBConnection();
    const [results] = await db.executeSql(
        `SELECT uniqueId, inspectionData FROM inspections
         WHERE userId = ? AND siteId = ?
         ORDER BY uniqueId, chunkIndex`,
        [userId, siteId]
    );
 
    const inspectionsMap = {};
 
    for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const { uniqueId, inspectionData } = row;
        if (!inspectionsMap[uniqueId]) inspectionsMap[uniqueId] = '';
        inspectionsMap[uniqueId] += inspectionData;
    }
 
    return Object.values(inspectionsMap).map(jsonStr => JSON.parse(jsonStr));
};
export const getInspectionDataByUserAndSiteAndDownloadedBy = async (userId, siteId, downloadedBy) => {
    const db = await getDBConnection();
    const [results] = await db.executeSql(
        `SELECT uniqueId, inspectionData
         FROM inspections
         WHERE userId = ? AND siteId = ?
         ORDER BY uniqueId, chunkIndex`,
        [userId, siteId]
    );
 
    const inspectionsMap = {};
 
    // Reconstruct full JSON for each uniqueId
    for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const { uniqueId, inspectionData } = row;
        if (!inspectionsMap[uniqueId]) inspectionsMap[uniqueId] = '';
        inspectionsMap[uniqueId] += inspectionData;
    }
 
    // Convert to JSON objects
    let inspections = Object.values(inspectionsMap).map(jsonStr => JSON.parse(jsonStr));
 
    // Apply filter on the JSON field
    if (downloadedBy) {
        inspections = inspections.filter(item => item.downloadedBy === downloadedBy);
    }
 
    return inspections;
};
 
export const updateInspectionByUniqueId = async (uniqueId, updatedData) => {
    const db = await getDBConnection();
    await db.executeSql('DELETE FROM inspections WHERE uniqueId = ?', [uniqueId]);
 
    const jsonData = JSON.stringify(updatedData);
    const chunks = [];
    for (let i = 0; i < jsonData.length; i += CHUNK_SIZE) {
        chunks.push(jsonData.slice(i, i + CHUNK_SIZE));
    }
 
    for (let index = 0; index < chunks.length; index++) {
        await db.executeSql(
            `INSERT INTO inspections (userId, siteId, uniqueId, chunkIndex, inspectionData)
             VALUES (?, ?, ?, ?, ?)`,
            [updatedData.userId, updatedData.siteId, uniqueId, index, chunks[index]]
        );
    }
 
    return true;
};
 
export const getAllInspectionData = async () => {
    const db = await getDBConnection();
    const [results] = await db.executeSql(
        `SELECT * FROM inspections ORDER BY uniqueId, chunkIndex`
    );
 
    const groupedData = {};
 
    for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const key = `${row.userId}_${row.siteId}`;
 
        if (!groupedData[key]) {
            groupedData[key] = {
                userId: row.userId,
                siteId: row.siteId,
                inspectionList: {},
            };
        }
 
        const uniqueId = row.uniqueId;
        if (!groupedData[key].inspectionList[uniqueId]) {
            groupedData[key].inspectionList[uniqueId] = '';
        }
        groupedData[key].inspectionList[uniqueId] += row.inspectionData;
    }
 
    return Object.values(groupedData).map(group => ({
        ...group,
        inspectionList: Object.values(group.inspectionList).map(chunk => JSON.parse(chunk)),
    }));
};
 
export const deleteAllInspectionData = async () => {
    const db = await getDBConnection();
    await db.executeSql(`DELETE FROM inspections`);
};
 
export const deleteInspectionByUniqueId = async uniqueId => {
    const db = await getDBConnection();
    const [result] = await db.executeSql(`DELETE FROM inspections WHERE uniqueId = ?`, [uniqueId]);
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