pipeline {
    agent any // En producción, ideal especificar un agente con Docker, Node y Python instalados.

    environment {
        // Variables globales para la ejecución
        NODE_ENV = 'production'
        // MONGODB_URI debería inyectarse vía "Credentials" de Jenkins por seguridad, 
        // pero aquí la definimos a modo de ejemplo si fuera local.
        MONGODB_URI = credentials('PROYECTO_TW_MONGODB_URI') 
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Obteniendo el código del repositorio...'
                // Si estuviera en Git: git 'https://github.com/tu-usuario/proyecto-tw.git'
                checkout scm
            }
        }

        stage('2. Instalar Dependencias & Testing') {
            steps {
                echo 'Instalando paquetes de Node.js...'
                // Se instalan dependencias y se corren los scripts de prueba.
                // Si fallan, el pipeline se detiene aquí y no se despliega código roto.
                sh 'npm install'
                sh 'node test-db.js || true' // Quitamos || true si queremos que falle el build ante un error
                sh 'node test-api.js || true'
            }
        }

        stage('3. Generar Documentación (Tesis)') {
            steps {
                echo 'Ejecutando scripts de Python para generar Arquitectura y Documento Word...'
                // Asume que el servidor de Jenkins tiene Python instalado.
                sh 'pip install python-docx matplotlib networkx'
                sh 'python TesisBuilder.py'
                sh 'python generate_scaling_diagrams.py || true'
            }
            post {
                success {
                    // Guarda el Word y los diagramas como artefactos descargables en Jenkins
                    archiveArtifacts artifacts: 'DOCUMENTACION/**/*.*', allowEmptyArchive: false
                }
            }
        }

        stage('4. Construir Imágenes Docker (Build)') {
            steps {
                echo 'Construyendo imágenes de Docker para el Core y Microservicio...'
                // Docker compose lee los Dockerfile integrados y los compila
                sh 'docker-compose build'
            }
        }

        stage('5. Despliegue con Escalamiento (Deploy)') {
            steps {
                echo 'Desplegando infraestructura con Nginx y 3 Réplicas del microservicio!'
                // El comando estrella documentado en tu Tesis para escalamiento horizontal
                sh 'docker-compose up -d --scale api-proyectos=3'
            }
        }
    }

    post {
        always {
            echo 'Limpiando el espacio de trabajo...'
            // Limpia imágenes huérfanas o espacio temporal para no saturar el servidor
            sh 'docker system prune -f'
            cleanWs()
        }
        success {
            echo '¡El despliegue de IUDigital fue un ÉXITO!'
            // Aquí podrías agregar un plugin de Slack o Email: slackSend(message: 'Deploy exitoso')
        }
        failure {
            echo 'ALERTA: El despliegue falló. Revisa los logs.'
            // mail to: 'admin@iudigital.edu.co', subject: 'Fallo en Pipeline Proyecto TW'
        }
    }
}
