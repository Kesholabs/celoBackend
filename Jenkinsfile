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
				sudo git pull origin dev
				'''
			}
		}
		stage('INSTALLING DEPENDENCIES') {
			steps {
				sh '''
				sudo su - celo-dev
				cd /home/celo-dev/celoBackend
				sudo yarn
                                echo "done"
				'''
			}
		}

	
    
 
		}
}

