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

    stage('Start Database') {
      steps {
        sh '''
          docker run --name postgres_ci_cd \
            -e POSTGRES_USER=$POSTGRES_USER \
            -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
            -e POSTGRES_DB=$POSTGRES_DB \
            -p $POSTGRES_PORT:5432 \
            -d postgres:16
          sleep 10
        '''
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'chmod +x mvnw'
          sh './mvnw clean package'
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

    stage('Stop Database') {
      steps {
        sh 'docker stop postgres_ci_cd || true'
        sh 'docker rm postgres_ci_cd || true'
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
