pipeline{
    agent { label 'slave02' }
    environment{
        BITBUCKET_ID = 'bitbucket-credentials'
        HELM_DIR_PATH = 'helmchart/chart/shrink-analyzer-ui'
        BUCKET_NAME = 'shrink-analyzer-ui'
        DOCKER_IMAGE_NAME = 'shrink-analyzer-ui'
    }
     parameters{
        booleanParam(name: "VERACODE", defaultValue: true, description: "Executing veracode")
        booleanParam(name: "SONACLOUD", defaultValue: true, description: "Executing sonacloud")
        string(name: "BRANCH_NAME_BUILD", defaultValue: "develop", trim: true, description: "Branch name for application build")
    }
    stages{
        stage("init dependencies"){
            steps{
                script{ 
                    commitMessage=""
                    DOCKER_TAG_VERSION=""
                    COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']
                    def gitCommitHash = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    def imageType
                    branch_name= GIT_BRANCH.replace("origin/","")
                    switch(GIT_BRANCH){
                        case "origin/test":
                            imageType = "QA"
                        case "origin/staging":
                            imageType="TC"
                            break
                        case "origin/master":
                            imageType = "RC"
                            break
                        default:
                            imageType = "DC"
                    }
                    DOCKER_TAG_VERSION = "${imageType}-${BUILD_NUMBER}-${gitCommitHash}"
                    currentBuild.displayName = "#${DOCKER_TAG_VERSION} ${GIT_BRANCH}"
                    commitMessage = "new tag by jenkins-build " + "${DOCKER_TAG_VERSION}"
                    echo "BRANCHNAME - ${branch_name}"
                    dir ('pipeline-tools') {
                        git branch: 'develop',credentialsId: "${BITBUCKET_ID}",url: 'git@bitbucket.org:shoppertrak/pipeline-tools.git'
                    }
                }
            }
        }
        stage("Build package node application"){
            steps{
                script{
                    withDockerContainer(image: "node:lts-alpine",args: "--user=root -v /var/run/docker.sock:/var/run/docker.sock -v ${WORKSPACE}:/app"){
                        sh('''
                            cd /app
                            npm i --package-lock-only
                            npm ci
                        ''')
                    }
                }
            }
        }
        stage("Test application"){
            steps{
                script{
                    withDockerContainer(image: "node:lts-alpine",args: "--user=root -v /var/run/docker.sock:/var/run/docker.sock -v ${WORKSPACE}:/app"){
                        sh (''' 
                            cd /app
                            apk add chromium
                            export CHROME_BIN=/usr/bin/chromium-browser
                            npm run test-ci
                        ''')
                    }
                }
            }
        }
        stage('sonarcloud-analysis'){
            when {
                expression { params.SONACLOUD }
            }
            steps{
                script{
                    withCredentials([string(credentialsId: 'SONAR_IO_TOKEN', variable: 'credID')]) {
                        withDockerContainer(image: "sonarsource/sonar-scanner-cli:4.8",args: "--user=root -v /var/run/docker.sock:/var/run/docker.sock -v ${WORKSPACE}:/app"){
                            sh("cd /app && sonar-scanner -Dsonar.token=${credID}")
                        }
                    }
                }
            }
        }
        stage('Veracode'){
            when {
                expression { params.VERACODE }
            }
            steps{
                script{
                    sh "zip -r shrink-analzyer-ui-dist.zip src/ package-lock.json package.json"
                    withCredentials([usernamePassword(credentialsId: 'veracode-credentials', passwordVariable: 'VERACODE_KEY', usernameVariable: 'VERACODE_ID')]) {
                        veracode applicationName: 'SS: RFID Overhead 360 System - shrink-analyzer-ui', canFailJob: true, criticality: 'VeryHigh', debug: true, fileNamePattern: "shrink-analzyer-ui-dist.zip", replacementPattern: '', sandboxName: 'R1.0_shrink-analyzer-ui', scanExcludesPattern: '', scanIncludesPattern: '', scanName: 'shrink-analyzer-ui scan $BUILD_NUMBER', teams: '', timeout: 90, uploadExcludesPattern: '', uploadIncludesPattern: "*.zip", vid: "$VERACODE_ID", vkey: "$VERACODE_KEY", waitForScan: true
                    }
                }
            }
        }
        stage("Build application"){
            steps{
                script{
                    withDockerContainer(image: "node:lts-alpine",args: "--user=root -v /var/run/docker.sock:/var/run/docker.sock -v ${WORKSPACE}:/app"){
                        sh('''
                            cd /app
                            npm run build
                        ''')
                    }
                }
            }
        }
        stage('build docker image'){
            steps{
                script{
                    sh("""
                        docker build . -t us-docker.pkg.dev/shoppertrak-repo/shoppertrak-repo/shrink-analyzer-ui:${DOCKER_TAG_VERSION}
                        docker image ls | grep shrink-analyzer-ui
                        docker push us-docker.pkg.dev/shoppertrak-repo/shoppertrak-repo/shrink-analyzer-ui:${DOCKER_TAG_VERSION}
                    """)

                }
            }
        }
        stage('create-upload-charts'){
            steps{
                script{
                   sh("python3 pipeline-tools/scripts/createHelmCharts.py --helm-dir-path '${HELM_DIR_PATH}' --bucket-name '${BUCKET_NAME}' --docker-image 'us-docker.pkg.dev/shoppertrak-repo/shoppertrak-repo/${DOCKER_IMAGE_NAME}' --docker-tag '${DOCKER_TAG_VERSION}'")
                   archiveArtifacts 'build.properties'
               }
            }
        }
        stage("Push git tags"){
            steps{
                script{
                    sh("git tag -a '${DOCKER_TAG_VERSION}' -m '${commitMessage}'")
                    sh("git push --tags")
                }
            }
        }
    }
    post {
        always {
            cleanWs()
            deleteDir()
            dir("${WORKSPACE}@tmp") 
            {
                deleteDir()
            }
            dir("${WORKSPACE}@script")
            {
                deleteDir()
            }
        }
        failure{
            slackSend channel: '#jenkins-build-status',
                color: COLOR_MAP["${currentBuild.currentResult}"],
                message: "*BUILD-NAME:* ${JOB_NAME} *${currentBuild.currentResult}* \n *BUILD-NUMBER:* ${DOCKER_TAG_VERSION} \n More info at: ${BUILD_URL}"
        }
    }
}
