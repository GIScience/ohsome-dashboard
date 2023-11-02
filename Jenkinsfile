pipeline {
  agent {
    label 'worker'
  }
  options {
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    REPO_NAME = sh(returnStdout: true, script: 'basename `git remote get-url origin` .git').trim()
    VERSION = sh(returnStdout: true, script: 'grep -Po "\\"version\\": \\"\\K([^\\"]+)" package.json').trim()
    LATEST_AUTHOR = sh(returnStdout: true, script: 'git show -s --pretty=%an').trim()
    LATEST_COMMIT_ID = sh(returnStdout: true, script: 'git describe --tags --long  --always').trim()
    PATH = "${WORKSPACE}/node_modules/.bin:${env.PATH}"
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
      post {
        failure {
          basicsend("*${REPO_NAME}*-build nr. ${env.BUILD_NUMBER} *failed* to install packages, check your packages.json file (<${env.BUILD_URL}|Open Build in Jenkins>). Latest commit from  ${LATEST_AUTHOR}.")
        }
      }
    }

    stage ('Build') {
      steps {
        nodejs('NodeJS 18') {
          sh 'npm run build'
        }
      }
      post {
        failure {
          rocket_buildfail()
        }
      }
    }

    stage ('Test') {
      steps {
        nodejs('NodeJS 18') {
          sh 'ng test --karma-config karma-jenkins.conf.js --code-coverage'
        }
      }
      post {
        failure {
          rocket_testfail()
        }
      }
    }

    stage ('Reports and Statistics') {
      steps {
        script {
          def scannerHome = tool 'SonarScanner 4';
          withSonarQubeEnv('sonarcloud GIScience/ohsome') {
            SONAR_CLI_PARAMETER = "-Dsonar.projectVersion=${VERSION} "
            if (env.CHANGE_ID) {
              SONAR_CLI_PARAMETER +=
                "-Dsonar.pullrequest.key=${env.CHANGE_ID} " +
                "-Dsonar.pullrequest.branch=${env.CHANGE_BRANCH} " +
                "-Dsonar.pullrequest.base=${env.CHANGE_TARGET}"
            } else {
              SONAR_CLI_PARAMETER += "-Dsonar.branch.name=${env.BRANCH_NAME}"
            }
            nodejs('NodeJS 18') {
              sh "${scannerHome}/bin/sonar-scanner " + SONAR_CLI_PARAMETER
            }
          }
        }
      }
      post {
        failure {
          rocket_reportfail()
        }
      }
    }
    stage('Wrapping Up') {
         steps {
            encourage()
            status_change()
        }
    }
  }
}
