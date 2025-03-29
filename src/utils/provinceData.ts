
// Canadian provinces with abbreviations and full names
export const provinces = [
  { value: "BC", label: "BC", fullName: "British Columbia" },
  { value: "ON", label: "ON", fullName: "Ontario" },
  { value: "AB", label: "AB", fullName: "Alberta" },
  { value: "QC", label: "QC", fullName: "Quebec" },
  { value: "MB", label: "MB", fullName: "Manitoba" },
  { value: "SK", label: "SK", fullName: "Saskatchewan" },
  { value: "NS", label: "NS", fullName: "Nova Scotia" },
  { value: "NB", label: "NB", fullName: "New Brunswick" },
  { value: "NL", label: "NL", fullName: "Newfoundland and Labrador" },
  { value: "PE", label: "PE", fullName: "Prince Edward Island" },
  { value: "YT", label: "YT", fullName: "Yukon" },
  { value: "NT", label: "NT", fullName: "Northwest Territories" },
  { value: "NU", label: "NU", fullName: "Nunavut" },
];

// Function to find province by code or name
export const findProvinceByLocation = (stateCode?: string, stateName?: string): string => {
  if (!stateCode && !stateName) return "ON"; // Default
  
  // Try to match by code first (most reliable)
  if (stateCode) {
    const provinceByCode = provinces.find(p => p.value === stateCode);
    if (provinceByCode) return provinceByCode.value;
  }
  
  // Try to match by name if provided
  if (stateName) {
    // Normalize the state name for comparison
    const normalizedStateName = stateName.toLowerCase();
    
    // Try to find a match by full name or abbreviation
    const provinceByName = provinces.find(p => 
      p.fullName.toLowerCase() === normalizedStateName ||
      p.fullName.toLowerCase().includes(normalizedStateName) || 
      normalizedStateName.includes(p.fullName.toLowerCase()) ||
      p.label.toLowerCase() === normalizedStateName
    );
    
    if (provinceByName) return provinceByName.value;
  }
  
  return "ON"; // Default to Ontario if no match found
};
