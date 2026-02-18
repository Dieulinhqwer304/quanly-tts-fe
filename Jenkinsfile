pipeline {
    agent any

    /* 
       Lưu ý: Đảm bảo Jenkins đã cài đặt Nodejs Plugin 
       và cấu hình công cụ với tên "node22" 
    */
    tools {
        nodejs "node22"
    }

    environment {
        YARN_CACHE = ".yarn"
    }

    stages {
        stage('Cleanup') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'yarn install --frozen-lockfile'
            }
        }

        stage('Quality Check') {
            steps {
                sh 'yarn format:check'
                sh 'yarn lint'
            }
        }

        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fileName: 'tts-learning-build.zip'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to web server...'
                // Thêm lệnh sh deploy của bạn tại đây
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'CI/CD Pipeline succeeded!'
        }
        failure {
            echo 'CI/CD Pipeline failed!'
        }
    }
}
