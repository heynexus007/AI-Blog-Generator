pipeline {
  agent any
  environment {
    AWS_REGION = 'us-east-1'
    AWS_ACCOUNT_ID = '248547463735'
    ECR = '${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/myapp-ecr'
    CLUSTER = 'myapp-cluster'
    S3_BUCKET = 'myapp-flask-bucket'
  }

  stages {
    stage('Build') {
      steps {
        sh "docker build -t ${ECR}:${BUILD_NUMBER} ."
      }
    }
    stage('Push to ECR') {
      steps { 
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
        sh """
          aws ecr get-login-password --region ${AWS_REGION} |
          docker login --username AWS --password-stdin ${ECR}
          docker push ${ECR}:${BUILD_NUMBER}
        """
        }
      }
    }

    stage('Create Deployment') {
  steps {
    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
      sh """
        aws eks update-kubeconfig --name ${CLUSTER} --region ${AWS_REGION}
        kubectl apply -f k8s/deployment.yml
      """
        }
      }
    }
    
    stage('Deploy to EKS') {
      steps  {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
        sh """
          aws eks update-kubeconfig --name ${CLUSTER} --region ${AWS_REGION}
          kubectl get pods
          kubectl set image deployment/flask-app flask-app=$ECR:${BUILD_NUMBER} --record
          kubectl rollout status deployment/flask-app --timeout=120s
        """
        }
      }
    }

    stage('Expose Service') {
  steps {
    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
      sh """
        aws eks update-kubeconfig --name ${CLUSTER} --region ${AWS_REGION}
        kubectl apply -f k8s/service.yml
      """
    }
  }
}

    stage('Smoke Test') {
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
        
      sh """
        aws eks update-kubeconfig --name ${CLUSTER} --region ${AWS_REGION}
        HOSTNAME=\$(kubectl get svc flask-app-svc -o jsonpath="{.status.loadBalancer.ingress[0].hostname}")
        curl -f http://\${HOSTNAME}:5000
      """

        }
      }
    }
  }
  post {
  success {
    echo "Deployed ${BUILD_NUMBER}"
  }
  failure {
    echo "Deploy failed, rolling back"
    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
      sh """
        aws eks update-kubeconfig --name ${CLUSTER} --region ${AWS_REGION}
        kubectl rollout undo deployment/flask-app
      """
      }
    }
  }
}

