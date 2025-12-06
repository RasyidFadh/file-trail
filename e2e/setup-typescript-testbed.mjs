#!/usr/bin/env -S npx zx

import 'zx/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2eDir = __dirname;
const testbedDir = join(e2eDir, 'testbed');

// Remove testbed directory if it exists (ignore errors if it doesn't exist)
try {
  await $`rm -rf ${testbedDir}`;
} catch (e) {
  // Directory doesn't exist, that's fine
}

// Create testbed directory
await $`mkdir -p ${testbedDir}`;

// Change into testbed directory
cd(testbedDir);

// Run npm init with default values
await $`npm init -y`;

// Add "type": "module" to package.json
const packageJsonPath = join(testbedDir, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
packageJson.type = 'module';
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Install file-trail (from npm if post-deploy, from local path if pre-deploy) and typescript
const isPostDeploy = process.env.E2E_POST_DEPLOY === 'true';
const rootDir = join(e2eDir, '..');
const fileTrailSource = isPostDeploy ? 'file-trail' : rootDir;
await $`npm install ${fileTrailSource} typescript`;

// Copy typescript-harness.ts from e2e/src/typescript-harness.ts to testbed root
const harnessSource = join(e2eDir, 'src', 'typescript-harness.ts');
const harnessDest = join(testbedDir, 'harness.ts');
copyFileSync(harnessSource, harnessDest);
