// Parse ModuleLicense string
export const parseModuleLicenseString = (str) => {
  if (!str || typeof str !== "string") return [];

  return str.split("],").map(item => {
    const clean = item.replace(/[\[\]]/g, "").trim();
    const parts = clean.split(",");

    if (parts.length < 2) return null;

    return {
      id: Number(parts[0].trim()),
      name: parts[1].trim().toLowerCase()
    };
  }).filter(Boolean);
};

// Generic license check
export const hasModuleLicense = (licenses, targetId, targetName) => {
  if (!Array.isArray(licenses)) return false;

  const nameLower = targetName.toLowerCase();
  return licenses.some(item =>
    Number(item.id) === targetId || item.name === nameLower
  );
};
