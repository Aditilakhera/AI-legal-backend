import { extractBrandMetadata } from './utils/brandScraper.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const url = 'https://uwo24.com/';
  console.log(`Testing metadata extraction for: ${url}`);
  try {
    const metadata = await extractBrandMetadata(url);
    console.log('--- METADATA RESULTS ---');
    console.log(JSON.stringify(metadata, null, 2));
  } catch (err) {
    console.error('Error during test:', err.message);
  }
}

test();
