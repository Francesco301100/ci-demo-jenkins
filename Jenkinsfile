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
                            sh 'he'
                        }
                    }
                }
            }
        }

        stage('Test Backend & Frontend') {
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
    }
}
