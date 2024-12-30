import AsyncStorage from '@react-native-community/async-storage';

module.exports = {
    storeJsonValues: function storeJsonValues(key, jsonObject) {
        try {
            this.setItem(key, JSON.stringify(jsonObject));
        } catch (error) {}
    },

    setItem: async function storeStringValues(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {}
    },

    mergeItem: async function mergeItem(key, value) {
        try {
            await AsyncStorage.mergeItem(key, JSON.stringify(value));
        } catch (error) {}
    },

    getAllKeys: async function getAllKeys(callback) {
        try {
            await AsyncStorage.getAllKeys((error, result) => {
                if (callback) {
                    callback(error, result);
                }
            });
        } catch (error) {}
    },

    getItem: async function getItem(key) {
        try {
            const result = await AsyncStorage.getItem(key);
            if (JSON.parse(result)) {
                return JSON.parse(result);
            } else {
                return result;
            }
        } catch (error) {}
    },

    getStringItem: async function getItem(key) {
        try {
            const result = await AsyncStorage.getItem(key);
            return result;
        } catch (error) {}
    },

    getJsonObject: async function getJsonObject(key, callback) {
        try {
            await AsyncStorage.getItem(key, (error, result) => {
                if (result !== null) {
                    result = JSON.parse(result);
                }
                if (callback) {
                    callback(result);
                }
            });
        } catch (error) {}
    },

    clearAll: async function clearValues() {
        try {
            await AsyncStorage.clear();
        } catch (error) {}
    },

    removeItem: async function removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {}
    },

    storeData: async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            // saving error
        }
    },

    getData: async key => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    },
};
