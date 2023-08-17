pipeline {
  agent {
    label 'worker'
  }
  options {
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    REPO_NAME = sh(returnStdout: true, script: 'basename `git remote get-url origin` .git').trim()
    LATEST_AUTHOR = sh(returnStdout: true, script: 'git show -s --pretty=%an').trim()
    LATEST_COMMIT_ID = sh(returnStdout: true, script: 'git describe --tags --long  --always').trim()
  }

  stages {
    stage ('Install') {
      steps {
        script {
          echo REPO_NAME
          echo LATEST_AUTHOR
          echo LATEST_COMMIT_ID

          echo env.BRANCH_NAME
          echo env.BUILD_NUMBER
          echo env.TAG_NAME
        }
        nodejs('NodeJS 18') {
          sh 'npm install'
        }
      }
    }

    stage ('Build') {
      steps {
        nodejs('NodeJS 18') {
          sh 'npm run build'
        }
      }
    }

    stage ('Test') {
      steps {
        nodejs('NodeJS 18') {
          sh 'npm run test-chromium-headless'
        }
      }
    }

    stage ('Reports and Statistics') {
      steps {
        script {
          def scannerHome = tool 'SonarScanner 4';
          withSonarQubeEnv('sonarcloud GIScience/ohsome') {
            if (env.CHANGE_ID) {
              SONAR_CLI_PARAMETER = " " +
                "-Dsonar.pullrequest.key=${env.CHANGE_ID} " +
                "-Dsonar.pullrequest.branch=${env.CHANGE_BRANCH} " +
                "-Dsonar.pullrequest.base=${env.CHANGE_TARGET}"
            } else {
              SONAR_CLI_PARAMETER = " " +
                "-Dsonar.branch.name=${env.BRANCH_NAME}"
            }
            nodejs('NodeJS 18') {
              sh "${scannerHome}/bin/sonar-scanner " + SONAR_CLI_PARAMETER
            }
          }
        }
      }
    }

  // TODO add RocketChat
  }
}
