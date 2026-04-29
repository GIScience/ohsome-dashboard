pipeline {
  agent {
    label 'worker'
  }
  options {
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    // this variable defines which branches will be deployed
    SNAPSHOT_BRANCH_REGEX = /(^main$)/
    RELEASE_REGEX = /^([0-9]+(\.[0-9]+)*)(-(RC|beta-|alpha-)\.[0-9]+)?$/
    REPO_NAME = sh(returnStdout: true, script: 'basename `git remote get-url origin` .git').trim()
    VERSION = sh(returnStdout: true, script: 'grep -Po "\\"version\\": \\"\\K([^\\"]+)" package.json').trim()
    LATEST_AUTHOR = sh(returnStdout: true, script: 'git show -s --pretty=%an').trim()
    LATEST_COMMIT_ID = sh(returnStdout: true, script: 'git describe --tags --long  --always').trim()
    DOCKER_IMAGE_NAME = 'repo.heigit.org/heigit/ohsome-dashboard'
    DOCKER_CREDENTIALS_ID = 'docker-heigit-ci-service'
    DOCKER_REGISTRY_URL = 'https://repo.heigit.org'

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
        nodejs('NodeJS 24') {
          sh 'npm clean-install'
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
        nodejs('NodeJS 24') {
          sh 'npm run build:prod'
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
        nodejs('NodeJS 24') {
          sh 'ng test --karma-config karma-jenkins.conf.js --code-coverage --watch=false'
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
            nodejs('NodeJS 24') {
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

    stage('Build and publish Docker image') {
      steps {
        script {
          docker.withRegistry(DOCKER_REGISTRY_URL, DOCKER_CREDENTIALS_ID) {
            if (env.BRANCH_NAME ==~ SNAPSHOT_BRANCH_REGEX) {
              dockerImage = docker.build(DOCKER_IMAGE_NAME + ':' + env.BRANCH_NAME, '--build-arg build_config=test .')
              dockerImage.push()
            }
            if (VERSION ==~ RELEASE_REGEX && env.TAG_NAME ==~ RELEASE_REGEX) {
              dockerImage = docker.build(DOCKER_IMAGE_NAME + ':' + VERSION, '--build-arg build_config=prod .')
              dockerImage.push()
              dockerImage.push('latest')
            }
          }
        }
      }
      post {
        failure {
          rocket_buildfail()
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
