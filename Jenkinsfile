pipeline {
  agent any
  environment {
    AWS_REGION = 'us-east-1'
    AWS_ACCOUNT_ID = '325204716520'
    ECR = '${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-blog-ecr'
    CLUSTER = 'ai-blog-cluster'
    S3_BUCKET = 'ai-blog-bucket'
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

  //   stage('Create Deployment') {
  // steps {
  //   withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
  //     sh """
  //       aws eks update-kubeconfig --name ${CLUSTER} --region ${AWS_REGION}
  //       kubectl apply -f k8s/deployment.yml
  //     """
  //       }
  //     }
  //   }
    
    stage('Deploy to ECS') {
  steps {
    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
      sh """
        TASK_DEF=\$(aws ecs describe-task-definition --task-definition ${ECS_TASK_FAMILY})
        NEW_IMAGE="${ECR}:${BUILD_NUMBER}"
        echo \$TASK_DEF | jq --arg IMAGE "\$NEW_IMAGE" '.taskDefinition |
          .containerDefinitions[0].image = \$IMAGE |
          del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)' > new-task-def.json

        NEW_TASK_DEF_ARN=\$(aws ecs register-task-definition --cli-input-json file://new-task-def.json | jq -r ".taskDefinition.taskDefinitionArn")

        aws ecs update-service --cluster ${ECS_CLUSTER} --service ${ECS_SERVICE} --task-definition \$NEW_TASK_DEF_ARN --force-new-deployment
        aws ecs wait services-stable --cluster ${ECS_CLUSTER} --service ${ECS_SERVICE}
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

