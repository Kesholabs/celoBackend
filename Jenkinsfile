pipeline {
	agent {
		label 'deficon-slave'
	}
		
	stages {
		stage('PULLING THE CHANGES') {
			steps {
				sh '''
				sudo su - celo-dev
				cd /home/celo-dev/celoBackend
				sudo git pull https://github.com/Kesholabs/celoBackend.git
				'''
			}
		}
		stage('INSTALLING DEPENDENCIES') {
			steps {
				sh '''
				sudo su - celo-dev
				cd /home/celo-dev/celoBackend
				sudo yarn
				'''
			}
		}

	
    
 
		}
}

