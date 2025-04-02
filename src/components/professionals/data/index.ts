
import { professionalCategories } from './categories';
import { homeInspectors } from './inspectors';
import { structuralEngineers } from './structural';
import { roofingInspectors } from './roofing';
import { electricians } from './electrical';
import { plumbers } from './plumbing';
import { hvacTechnicians } from './hvac';
import { wettInspectors } from './chimney';
import { pestInspectors } from './pest';
import { moldSpecialists } from './mold';
import { asbestosInspectors } from './asbestos';
import { radonTesters } from './radon';
import { septicInspectors } from './septic';
import { wellInspectors } from './well';
import { oilTankInspectors } from './oil';
import { poolInspectors } from './pool';
import { generalContractors } from './contractor';

// Combine all professionals into a single array
const allProfessionals = [
  ...homeInspectors,
  ...structuralEngineers,
  ...roofingInspectors,
  ...electricians,
  ...plumbers,
  ...hvacTechnicians,
  ...wettInspectors,
  ...pestInspectors,
  ...moldSpecialists,
  ...asbestosInspectors,
  ...radonTesters,
  ...septicInspectors,
  ...wellInspectors,
  ...oilTankInspectors,
  ...poolInspectors,
  ...generalContractors
];

// Export as professionalData to maintain the same interface
export const professionalData = {
  categories: professionalCategories,
  professionals: allProfessionals
};

// Export each category separately for more granular imports
export {
  professionalCategories,
  homeInspectors,
  structuralEngineers,
  roofingInspectors,
  electricians,
  plumbers,
  hvacTechnicians,
  wettInspectors,
  pestInspectors,
  moldSpecialists,
  asbestosInspectors,
  radonTesters,
  septicInspectors,
  wellInspectors,
  oilTankInspectors,
  poolInspectors,
  generalContractors
};
