#!/usr/bin/env -S npx zx

import 'zx/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2eDir = __dirname;
const testbedDir = join(e2eDir, 'testbed');

// Change into testbed directory
cd(testbedDir);

// Compile TypeScript with strict type checking (will fail on errors)
// --noEmitOnError ensures no output if there are type errors
// --strict and --noImplicitAny ensure missing types cause failures
await $`npx tsc harness.ts --module esnext --target es2020 --moduleResolution node --strict --noImplicitAny --noEmitOnError --esModuleInterop`;
