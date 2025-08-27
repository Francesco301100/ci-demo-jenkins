pipeline {
    agent { label 'bachelorarbeit' }

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
                    }
                }
            }
        }
    }
}