import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get the remote repository URL
const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();

// Remove the ".git" extension and add a trailing "/"
const correctedHomepage = remoteUrl.replace(/\.git$/, '') + '/';

// Read the package.json file
const packageJsonPath = './package.json';
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Update the homepage property
packageJson.homepage = correctedHomepage;

// Write the updated package.json back to the file
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`Updated homepage property in package.json to: ${correctedHomepage}`);
