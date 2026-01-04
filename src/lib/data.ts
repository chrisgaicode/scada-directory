import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Integrator {
  "Integrator Name": string;
  "Location": string;
  "Slug": string;
  [key: string]: string;
}

export function getIntegrators() {
  // 1. Target the file in src/data/
  const csvFilePath = path.join(process.cwd(), 'tools', 'Integrators.csv');
  
  console.log(`[Data Load] Reading from: ${csvFilePath}`);

  if (!fs.existsSync(csvFilePath)) {
    console.error(`[Data Load] ❌ ERROR: File not found at ${csvFilePath}`);
    return [];
  }

  try {
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // 2. Parse with BOM handling (bom: true removes hidden characters from headers)
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true, 
    });

    console.log(`[Data Load] ✅ SUCCESS: Loaded ${records.length} integrators.`);
    return records as Integrator[];
    
  } catch (error) {
    console.error(`[Data Load] ❌ CRITICAL: Parser failed.`);
    console.error(error);
    return [];
  }
}