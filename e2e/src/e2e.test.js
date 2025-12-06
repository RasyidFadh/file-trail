import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2eDir = join(__dirname, '..');

describe('e2e', () => {
  it('should run the testbed and match expected output', () => {
    // arrange
    const expectedOutputPath = join(__dirname, 'expected-e2e-output.txt');
    const expectedOutput = readFileSync(expectedOutputPath, 'utf-8');

    // act
    execSync('npm run testbed:setup', {
      cwd: e2eDir,
      stdio: 'inherit',
    });
    const actualOutput = execSync('npm run -s testbed:run', {
      cwd: e2eDir,
      encoding: 'utf-8',
    });

    // assert
    expect(actualOutput.trim()).toBe(expectedOutput.trim());
  });
});
