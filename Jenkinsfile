pipeline {
	agent {
		label 'pb-webapp-slave'
	}
		
	stages {
		stage('PULLING THE CHANGES') {
			steps {
				sh '''
				sudo su - celo
				cd /home/celo/celoBackend
				sudo git pull https://github.com/Kesholabs/celoBackend.git
				'''
			}
		}
		stage('INSTALLING DEPENDENCIES') {
			steps {
				sh '''
				sudo su - celo
				cd /home/celo/celoBackend
				sudo yarn
				'''
			}
		}
    
        stage('SERVING THE BUILD FOLDER') {
            steps {
                sh '''
                sudo su - pb-frontend-slave
                cd /home/celo/celoBackend
                pm2 start app.js -- watch
                '''
            }

}
		}
}
