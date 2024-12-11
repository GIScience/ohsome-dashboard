#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# PLEASE SET THE CORRECT DETAILS in .env.test BEFORE RUNNING THE SCRIPT

# solution to load .env from https://gist.github.com/mihow/9c7f559807069a03e302605691f85572?permalink_comment_id=3898844#gistcomment-3898844
# Get the directory of the current script
SCRIPT_DIR="$(dirname "$0")"
set -a
source <(cat "$SCRIPT_DIR/.test.env" | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
set +a

# Check if env variables have been set
: ${REMOTE_HOST:?}
: ${REMOTE_USER:?}
: ${REMOTE_PATH:?}
: ${TARGET_REPO:?}


# import user prompt
source "$SCRIPT_DIR/prompt_user_exit_or_continue.sh"

# Define repository URLs and paths
echo "Initializing TEST deployment script..."
echo

DASHBOARD_VERSION="$(git describe --tags --dirty)"
echo
prompt_user "Is this >>> $DASHBOARD_VERSION <<< the version, you want to deploy?"

# Check remote access details
# answering 'y' will continue, 'n' will exit the script
prompt_user "Did you set the following variables in this script correctly?
  REMOTE_HOST=\"$REMOTE_HOST\"
  REMOTE_USER=\"$REMOTE_USER\"
  REMOTE_PATH=\"$REMOTE_PATH\"
  TARGET_REPO=\"$TARGET_REPO\"
  TARGET_REPO_FOLDER=\"$TARGET_REPO_FOLDER\"
"

# Check ssh access to target server
echo "Checking your SSH connection..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$REMOTE_USER@$REMOTE_HOST" exit ; then
    echo "✘ Your SSH connection did NOT work.
    Please make sure that you ('$REMOTE_USER') have access to host '$REMOTE_HOST' via SSH.
    And then run this script again."
    echo "Exiting deployment script."
    exit 1
    else
      echo "✔ Your SSH connection to $REMOTE_HOST" works
      echo
fi


# Details for test deployment
GIT_ROOT_PATH=$(git rev-parse --show-toplevel)
DIST_PATH="$GIT_ROOT_PATH/dist"
TEMP_TEST_REPO_PATH="$GIT_ROOT_PATH/temp-test-repo"
TARGET_PATH="${TEMP_TEST_REPO_PATH}${TARGET_REPO_FOLDER:+/$TARGET_REPO_FOLDER}"

prompt_user "Is this the repo where the built dashboard should be pushed to?
Target repository: $TARGET_REPO
Local path: $TARGET_PATH"

# Clone or update the target repository
echo "Prepare local target repository..."
# Navigate to the Git root directory
cd "$GIT_ROOT_PATH"
if [ -d "$TEMP_TEST_REPO_PATH" ]; then
    echo "Temporary PROD repository already exists locally. Pulling latest changes..."
    echo
    cd "$TEMP_TEST_REPO_PATH"
    git switch master
    git pull
    cd "$GIT_ROOT_PATH"
else
    echo "Temporary PROD repository does not exist locally. Cloning repository..."
    echo
    git clone "$TARGET_REPO" "$TEMP_TEST_REPO_PATH"
fi

# Build the project
echo
echo "Installing dependencies and building the local project for the TEST environment..."
npm install
npm run build:test

# Replace old code in the local TEST repository
echo
prompt_user "To update the code in the local target repo ($TARGET_PATH), we need to copy it over.
Do you want to execute the following commands?

rm -rf ${TARGET_PATH:?}/*
cp -R $DIST_PATH/* $TARGET_PATH/
"
rm -rf "${TARGET_PATH:?}/"*
cp -R "$DIST_PATH"/* "$TARGET_PATH/"

# Commit and push changes to the TEST repository
prompt_user "Freshly built TEST version of ${DASHBOARD_VERSION} is ready to be pushed into local Git Repo. Continue?"
echo "Committing and pushing updates to the test repository..."
cd "$TEMP_TEST_REPO_PATH"
git add .
git commit -m "Update dashboard-test with ${DASHBOARD_VERSION}"
git push
echo
echo "Transfer to TEST repository completed successfully!"

# Remote update on the server
prompt_user "Continue to pull ${DASHBOARD_VERSION} to ${REMOTE_HOST} via SSH?"

echo "Connecting to the remote server ($REMOTE_HOST) to pull updates..."

DEPLOY_KEY="../../.ssh/deploy_website_id_ed25519"

ssh "$REMOTE_USER@$REMOTE_HOST" <<EOF
    set -e
    echo "Navigating to $REMOTE_PATH on the remote server..."
    cd "$REMOTE_PATH"
    echo "Pulling latest changes as www-data user..."
    sudo -u www-data GIT_SSH_COMMAND='ssh -i $DEPLOY_KEY' git pull
    echo "Remote update completed successfully!"
EOF
echo "Dashboard version ${DASHBOARD_VERSION} has been deployed to the TEST environment."

exit 0
