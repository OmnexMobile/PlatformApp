import VersionCheck from 'react-native-version-check';

let updateShown = false;

// compare version strings like "1.1" and "1.10"
const isNewerVersion = (latest, current) => {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);
    const maxLen = Math.max(latestParts.length, currentParts.length);

    for (let i = 0; i < maxLen; i++) {
        const l = latestParts[i] || 0;
        const c = currentParts[i] || 0;
        if (l > c) return true;
        if (l < c) return false;
    }
    return false; // versions are equal
};

export const checkForUpdate = async () => {
    if (updateShown) return { showModal: false };

    try {
        const latestVersion = await VersionCheck.getLatestVersion();
        const currentVersion = VersionCheck.getCurrentVersion();

        if (isNewerVersion(latestVersion, currentVersion)) {
            updateShown = true;
            return { showModal: true, latestVersion };
        }
    } catch (err) {
        console.log('Error checking version:', err);
    }

    return { showModal: false };
};
