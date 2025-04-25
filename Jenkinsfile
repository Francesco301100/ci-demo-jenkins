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

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Test Backend') {
      steps {
        script {
          docker.image('postgres:16').withRun("-e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -e POSTGRES_DB=${POSTGRES_DB} -p ${POSTGRES_PORT}:5432") { dbContainer ->
            sh "sleep 10" // kurze Pause, bis DB fertig ist

            dir('backend') {
              sh 'chmod +x mvnw'
              sh "./mvnw clean test -Dspring.datasource.url=jdbc:postgresql://localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
            }
          }
        }
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh './mvnw clean package -DskipTests'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build & Push') {
      steps {
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
