
// Import the professionals categories
import { professionalCategories as categories } from './categories';

// Import the professionals by category
import { homeInspectors as inspectors } from './inspectors';
import { electricians as electrical } from './electrical';
import { plumbers as plumbing } from './plumbing';
import { hvacTechnicians as hvac } from './hvac';
import { structuralEngineers as structural } from './structural';
import { roofInspectors as roofing } from './roofing';
import { wettInspectors as chimney } from './chimney';
import { pestInspectors as pest } from './pest';
import { moldSpecialists as mold } from './mold';
import { asbestosInspectors as asbestos } from './asbestos';
import { radonTesters as radon } from './radon';
import { septicInspectors as septic } from './septic';
import { wellWaterTesters as well } from './well';
import { oilTankInspectors as oil } from './oil';
import { poolInspectors as pool } from './pool';
import { generalContractors as contractor } from './contractor';

// Export a combined list of all professionals
export const professionalData = {
  categories,
  professionals: [
    ...inspectors,
    ...electrical,
    ...plumbing,
    ...hvac,
    ...structural,
    ...roofing,
    ...chimney,
    ...pest,
    ...mold,
    ...asbestos,
    ...radon,
    ...septic,
    ...well,
    ...oil,
    ...pool,
    ...contractor
  ]
};
