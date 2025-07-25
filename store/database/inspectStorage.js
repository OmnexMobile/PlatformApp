// src/database/inspectStorage.js
import { getDBConnection } from './dbService';

export const createInspectTable = async () => {
  const db = await getDBConnection();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS inspectList (
      userId TEXT NOT NULL,
      siteId TEXT NOT NULL,
      inspectionList TEXT,
      PRIMARY KEY (userId, siteId)
    );
  `);
};

export const addInspectionData = async (userId, siteId, inspectionData) => {
  const db = await getDBConnection();
  const result = await db.executeSql(
    `SELECT inspectionList FROM inspectList WHERE userId = ? AND siteId = ?`,
    [userId, siteId]
  );

  let updatedList = [];

  if (result[0].rows.length > 0) {
    const existingList = JSON.parse(result[0].rows.item(0).inspectionList || '[]');
    updatedList = [...existingList, inspectionData];
  } else {
    updatedList = [inspectionData];
  }

  await db.executeSql(
    `INSERT OR REPLACE INTO inspectList (userId, siteId, inspectionList) VALUES (?, ?, ?)`,
    [userId, siteId, JSON.stringify(updatedList)]
  );
};

export const getInspectionDataByUserAndSite = async (userId, siteId) => {
  const db = await getDBConnection();
  const results = await db.executeSql(
    `SELECT inspectionList FROM inspectList WHERE userId = ? AND siteId = ?`,
    [userId, siteId]
  );

  if (results[0].rows.length > 0) {
    return JSON.parse(results[0].rows.item(0).inspectionList);
  }

  return [];
};

export const updateInspectionByUniqueId = async (userId, siteId, updatedInspection) => {
  const db = await getDBConnection();

  try {
    const result = await db.executeSql(
      `SELECT * FROM inspectList WHERE userId = ? AND siteId = ?`,
      [userId, siteId]
    );

    if (result[0].rows.length === 0) {
      console.warn('No matching userId + siteId record found');
      return false;
    }

    const row = result[0].rows.item(0);
    let inspectionList = JSON.parse(row.inspectionList || '[]');

    const index = inspectionList.findIndex(item => item.uniqueId === updatedInspection.uniqueId);

    if (index === -1) {
      console.warn('No matching uniqueId found in inspectionList');
      return false;
    }

    inspectionList[index] = {
      ...inspectionList[index],
      ...updatedInspection, // merge updated fields
    };

    const updatedListJson = JSON.stringify(inspectionList);

    await db.executeSql(
      `UPDATE inspectList SET inspectionList = ? WHERE userId = ? AND siteId = ?`,
      [updatedListJson, userId, siteId]
    );

    console.log(`✅ Inspection item with uniqueId ${updatedInspection.uniqueId} updated.`);
    return true;
  } catch (err) {
    console.error('❌ Error updating inspection:', err);
    return false;
  }
};

export const getAllInspectionData = async () => {
  const db = await getDBConnection();

  const results = await db.executeSql(`SELECT * FROM inspectList`);

  const data = [];

  if (results[0].rows.length > 0) {
    for (let i = 0; i < results[0].rows.length; i++) {
      const row = results[0].rows.item(i);
      data.push({
        userId: row.userId,
        siteId: row.siteId,
        inspectionList: JSON.parse(row.inspectionList || '[]'),
      });
    }
  }

  return data;
};

export const deleteAllInspectionData = async () => {
  const db = await getDBConnection();
  try {
    await db.executeSql(`DELETE FROM inspectList`);
    console.log('🧹 All inspection data cleared.');
  } catch (error) {
    console.error('❌ Failed to clear inspection data:', error);
  }
};

