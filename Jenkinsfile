pipeline {
  agent any

  environment {
    BACKEND_IMAGE = "france3011/ba-backend:latest"
    FRONTEND_IMAGE = "france3011/ba-frontend:latest"
    DOCKER_CREDENTIALS_ID = "dockerhub-credentials"
    POSTGRES_USER = "postgres"
    POSTGRES_PASSWORD = "password"
    POSTGRES_DB = "ba"
    POSTGRES_PORT = "5432"
  }

  tools {
    jdk 'jdk-17'
    maven 'Maven 3.8.8'
    nodejs 'node-18'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Test Backend') {
      steps {
        script {
          docker.image('postgres:16').withRun("-e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -e POSTGRES_DB=${POSTGRES_DB} -p ${POSTGRES_PORT}:5432") {
            sh 'sleep 10'
            dir('backend') {
              sh 'chmod +x mvnw'
              sh "./mvnw clean verify -Dspring.datasource.url=jdbc:postgresql://localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
            }
          }
        }
      }
    }

    stage('Test Frontend') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run test'
        }
      }
    }

    stage('Build Backend Docker Image') {
      steps {
        dir('backend') {
          sh "docker build -t ${BACKEND_IMAGE} ."
        }
      }
    }

    stage('Build Frontend Docker Image') {
      steps {
        dir('frontend') {
          sh "docker build -t ${FRONTEND_IMAGE} ."
        }
      }
    }

    stage('Push Docker Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh "docker push ${BACKEND_IMAGE}"
          sh "docker push ${FRONTEND_IMAGE}"
        }
      }
    }

    stage('(Optional) Deploy to Server') {
      when {
        branch 'master'
      }
      steps {
        echo "Deployment kann hier z.B. via SSH, Kubernetes oder Docker Compose erfolgen"
      }
    }
  }

  post {
    always {
      cleanWs()
    }
    success {
      echo "✅ CI/CD Pipeline erfolgreich abgeschlossen!"
    }
    failure {
      echo "❌ Pipeline fehlgeschlagen."
    }
  }
}
