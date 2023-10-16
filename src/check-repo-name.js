const { exec } = require('child_process');

function getCurrentDirectory() {
  return new Promise((resolve, reject) => {
    exec('git rev-parse --show-toplevel', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function getRemoteRepoName() {
  return new Promise((resolve, reject) => {
    exec('git remote get-url origin', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const repoUrl = stdout.trim();
        const repoName = repoUrl.split('/').pop().replace('.git', '');
        resolve(repoName);
      }
    });
  });
}

async function checkRepoName() {
  try {
    const currentDirectory = await getCurrentDirectory();
    const projectName = currentDirectory.split('/').pop();
    const remoteRepoName = await getRemoteRepoName();

    if (projectName === remoteRepoName) {
      console.log('Local and remote repository names match. Proceeding with deployment.');
      // Add your deployment script here
    } else {
      console.error('Local and remote repository names do not match. Deployment canceled.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkRepoName();
