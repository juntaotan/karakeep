pipeline {
    agent any

    stages {
        stage('Inspect Environment') {
            steps {
                sh '''
                    echo "Jenkins workspace:"
                    pwd

                    echo "Current commit:"
                    git log -1 --oneline

                    echo "Repository root:"
                    ls -la
                '''
            }
        }

        stage('Verify Docker') {
            steps {
                sh '''
                    docker version
                    docker info
                '''
            }
        }
    }

    post {
        success {
            echo 'Karakeep CI environment is ready.'
        }

        failure {
            echo 'Karakeep CI environment validation failed.'
        }
    }
}
