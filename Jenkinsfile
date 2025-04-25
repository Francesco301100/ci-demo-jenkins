pipeline {
  agent none

  environment {
    BACKEND_IMAGE = "france3011/ba-backend:latest"
    FRONTEND_IMAGE = "france3011/ba-frontend:latest"
    DOCKER_CREDENTIALS_ID = "dockerhub-credentials"
  }

  stages {

    stage('Checkout') {
      agent any
      steps {
        checkout scm
      }
    }

    stage('Build Backend') {
      agent {
        docker {
          image 'maven:3.9-eclipse-temurin-17'
          args '-v /root/.m2:/root/.m2'
        }
      }
      steps {
        dir('backend') {
          sh './mvnw clean package'
        }
      }
    }

    stage('Build Frontend') {
      agent {
        docker {
          image 'node:18'
        }
      }
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build & Push') {
      agent { label 'docker' }
      steps {
        script {
          withCredentials([usernamePassword(
            credentialsId: env.DOCKER_CREDENTIALS_ID,
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )]) {

            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

            dir('backend') {
              sh """
                docker build -t $BACKEND_IMAGE .
                docker push $BACKEND_IMAGE
              """
            }

            dir('frontend') {
              sh """
                docker build -t $FRONTEND_IMAGE .
                docker push $FRONTEND_IMAGE
              """
            }
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build & Push erfolgreich abgeschlossen!"
    }
    failure {
      echo "❌ Pipeline fehlgeschlagen."
    }
    always {
      cleanWs()
    }
  }
}

