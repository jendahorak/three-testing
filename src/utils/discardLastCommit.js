import { exec } from 'child_process';

// Function to get the commit hash of the last commit
function getLastCommitHash(callback) {
  exec('git rev-parse HEAD', (error, stdout, stderr) => {
    if (error) {
      callback(`Error: ${error.message}`);
    } else if (stderr) {
      callback(`Git Error: ${stderr}`);
    } else {
      const commitHash = stdout.trim();
      callback(null, commitHash);
    }
  });
}

// Function to check the commit message and perform reset if needed
function checkAndResetCommit() {
  getLastCommitHash((error, commitHash) => {
    if (error) {
      console.error(error);
      return;
    }

    // Get the commit message
    exec(`git log --format=%B -n 1 ${commitHash}`, (logError, logStdout) => {
      if (logError) {
        console.error(`Error getting commit message: ${logError.message}`);
      } else {
        const commitMessage = logStdout.trim();
        console.log(`Last commit message: ${commitMessage}`);

        if (commitMessage === 'deployed-from-script') {
          // If the commit message matches, perform a soft reset
          exec(`git reset --soft ${commitHash}`, (resetError, resetStdout) => {
            if (resetError) {
              console.error(`Error resetting commit: ${resetError.message}`);
            } else {
              console.log(`Commit ${commitHash} reset successfully.`);
            }
          });
        } else {
          console.log(`Commit message does not match 'deployed-from-script'. No reset performed.`);
        }
      }
    });
  });
}

checkAndResetCommit();
