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

		stage('RESTARTING PM2') {
			steps {
				sh '''
				sudo su - celo
				cd /home/celo/celoBackend
				sudo pm2 restart app
				'''
			}
		}
    
 
		}
}

