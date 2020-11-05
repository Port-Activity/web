import { version } from './package.json';
import fs from 'fs';

const build_id = fs
  .readFileSync('./build_id')
  .toString()
  .trim();

const hash = fs
  .readFileSync('./hash')
  .toString()
  .trim();

const data = {
  version,
  hash,
  build: build_id,
  ts: new Date().toISOString(),
};

fs.writeFileSync('./src/version.json', JSON.stringify(data, null, 2));
