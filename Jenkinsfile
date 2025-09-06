pipeline {
    agent any

    environment {
        IMAGE_NAME_BACKEND  = "simonettifr/backend"
        IMAGE_NAME_FRONTEND = "simonettifr/frontend"
    }

    stages {
        stage('Pipelines') {
            parallel {
                stage('Backend') {
                    stages {
                        stage('Build Backend') {
                            steps {
                                dir('backend') {
                                    sh 'mvn clean package -DskipTests'
                                }
                            }
                        }
                        stage('Test Backend') {
                            steps {
                                dir('backend') {
                                    sh 'mvn test'
                                }
                            }
                        }
                        stage('SonarQube Backend') {
                            steps {
                                dir('backend') {
                                    withSonarQubeEnv('Sonar') {
                                        sh "mvn clean verify sonar:sonar"
                                    }
                                }
                            }
                        }
                        stage('Docker Backend') {
                            steps {
                                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                                    sh '''
                                        docker build -t $IMAGE_NAME_BACKEND:latest ./backend
                                        docker push $IMAGE_NAME_BACKEND:latest
                                    '''
                                }
                            }
                        }
                    }
                }

                stage('Frontend') {
                    stages {
                        stage('Build Frontend') {
                            steps {
                                dir('frontend') {
                                    sh 'npm ci && npm run build'
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
                        stage('SonarQube Frontend') {
                            steps {
                                dir('frontend') {
                                    withSonarQubeEnv('Sonar') {
                                        script {
                                            sh "${tool 'SonarScanner'}/bin/sonar-scanner"
                                        }
                                    }
                                }
                            }
                        }
                        stage('Docker Frontend') {
                            steps {
                                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                                    sh '''
                                        docker build -t $IMAGE_NAME_FRONTEND:latest ./frontend
                                        docker push $IMAGE_NAME_FRONTEND:latest
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        failure {
            mail to: "francescomnm@gmail.com",
                 subject: "Fehler in: ${currentBuild.fullDisplayName}",
                 body: "Pipeline ist fehlgeschlagen: ${env.BUILD_URL}"
        }
    }
}
