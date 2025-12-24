import { useMemo } from "react";
import { parseModuleLicenseString, hasModuleLicense } from "../helpers/moduleLicenseUtils";

export const useModuleLicenses = (rawModuleString) => {

  const moduleLicenses = useMemo(() => {
    if (!rawModuleString) return [];
    return parseModuleLicenseString(rawModuleString);
  }, [rawModuleString]);

  const isReady = moduleLicenses.length > 0;

  return useMemo(() => ({
    isReady,
    hasSupplierManagementLicense: hasModuleLicense(moduleLicenses, 21, "Supplier Management"),
    hasAuditProLicense: hasModuleLicense(moduleLicenses, 2, "Audit Pro"),
    hasApqpPpapLicense: hasModuleLicense(moduleLicenses, 10, "APQP PPAP Manager"),
    hasProblemSolverLicense: hasModuleLicense(moduleLicenses, 13, "Problem Solver"),
    hasInspectionControlLicense: hasModuleLicense(moduleLicenses, 17, "Inspection Control"),
    hasDocumentProLicense: hasModuleLicense(moduleLicenses, 4, "Document Pro")
  }), [moduleLicenses]);
};
