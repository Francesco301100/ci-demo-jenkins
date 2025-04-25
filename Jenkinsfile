pipeline {
  agent none

  environment {
    BACKEND_IMAGE = "france3011/ba-backend:latest"
    FRONTEND_IMAGE = "france3011/ba-frontend:latest"
    DOCKER_CREDENTIALS_ID = "dockerhub-credentials"
    POSTGRES_USER = "postgres"
    POSTGRES_PASSWORD = "password"
    POSTGRES_DB = "ba"
    POSTGRES_PORT = "5432"
    POSTGRES_CONTAINER_NAME = "ci-postgres"
  }

  stages {

    stage('Checkout') {
      agent any
      steps {
        checkout scm
      }
    }

    stage('Start Database') {
      agent { label 'docker' }
      steps {
        echo '🚀 Starte PostgreSQL-Datenbank für Tests...'
        sh '''
          docker run --name $POSTGRES_CONTAINER_NAME \
            -e POSTGRES_USER=$POSTGRES_USER \
            -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
            -e POSTGRES_DB=$POSTGRES_DB \
            -p $POSTGRES_PORT:5432 \
            -d postgres:16

          echo "⏳ Warte auf PostgreSQL-Start..."
          sleep 10
        '''
      }
    }

    stage('Build & Test Backend') {
      agent {
        docker {
          image 'maven:3.9-eclipse-temurin-17'
          args '-v /root/.m2:/root/.m2'
        }
      }
      steps {
        dir('backend') {
          sh 'chmod +x mvnw'
          sh './mvnw clean verify'
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
            echo '🔑 Docker Login...'
            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

            dir('backend') {
              sh """
                echo '🛠 Baue Backend-Image...'
                docker build -t $BACKEND_IMAGE .
                docker push $BACKEND_IMAGE
              """
            }

            dir('frontend') {
              sh """
                echo '🛠 Baue Frontend-Image...'
                docker build -t $FRONTEND_IMAGE .
                docker push $FRONTEND_IMAGE
              """
            }
          }
        }
      }
    }

    stage('Stop Database') {
      agent { label 'docker' }
      steps {
        echo '🧹 Stoppe und lösche PostgreSQL-Datenbank...'
        sh '''
          docker stop $POSTGRES_CONTAINER_NAME
          docker rm $POSTGRES_CONTAINER_NAME
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Build, Test und Push erfolgreich abgeschlossen!"
    }
    failure {
      echo "❌ Pipeline fehlgeschlagen."
    }
    always {
      cleanWs()
    }
  }
}
