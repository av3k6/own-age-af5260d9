
// Import the professionals by category
import { inspectors } from './inspectors';
import { electrical } from './electrical';
import { plumbing } from './plumbing';
import { hvac } from './hvac';
import { structural } from './structural';
import { roofing } from './roofing';
import { chimney } from './chimney';
import { pest } from './pest';
import { mold } from './mold';
import { asbestos } from './asbestos';
import { radon } from './radon';
import { septic } from './septic';
import { well } from './well';
import { oil } from './oil';
import { pool } from './pool';
import { contractor } from './contractor';

// Export a combined list of all professionals
export const professionalData = {
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
