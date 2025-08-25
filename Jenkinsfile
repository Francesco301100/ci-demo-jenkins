pipeline {
    agent any

    stages {
        stage('Build Backend & Frontend') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'mvn clean install -DskipTests'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Test Backen & Frontend') {
            parallel {
                stage('Test Backend') {
                    steps {
                        dir('backend') {
                            sh 'mvn test'
                        }
                    }
                }
                stage('Test Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run test'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('Sonar') {
                        sh "mvn clean verify sonar:sonar"
                    }
                }
            }
        }
    }

    post {
        failure {
            mail to: "francesco.simonetti@hm.edu",
                 subject: "Fehler in: ${currentBuild.fullDisplayName}",
                 body: "Pipeline ist fehlgeschlagen ${env.BUILD_URL}"
        }
    }
}
