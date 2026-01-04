import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// 1. Read the messy CSV
const input = fs.readFileSync('src/data/Integrators.csv', 'utf8'); // Adjust path if needed

const records = parse(input, {
  columns: true,
  skip_empty_lines: true
});

console.log(`Processing ${records.length} rows...`);

// 2. Clean the Data
const cleanedRecords = records.map(row => {
  let location = row.Location;
  let name = row["Integrator Name"];

  // FIX LOCATION
  // If location is missing or junk, look in the description
  if (!location || location.includes("matching locations") || location === "") {
    const desc = row.AI_Description || "";
    // Regex looks for "is a [City], [State]-based"
    const match = desc.match(/is (?:an|a) ([A-Za-z\s\.]+), ([A-Za-z\s\.]+)-based/);
    
    if (match && match.length >= 3) {
      location = `${match[1]}, ${match[2]}`;
      console.log(`✅ Fixed Location for ${name}: ${location}`);
    } else {
      console.log(`⚠️ Could not fix location for ${name}`);
    }
  }

  // FIX NAME (Fallback to website domain if empty)
  if (!name && row.Website) {
    try {
      const url = new URL(row.Website);
      name = url.hostname.replace('www.', '');
      console.log(`✅ Fixed Name for ${row.Website}: ${name}`);
    } catch (e) {}
  }

  return {
    ...row,
    "Integrator Name": name, // Update the column
    "Location": location     // Update the column
  };
});

// 3. Write the new CSV
const output = stringify(cleanedRecords, { header: true });
fs.writeFileSync('src/data/Integrators_Clean.csv', output);

console.log("\nDone! Created 'Integrators_Clean.csv'.");