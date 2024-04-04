# cipher-project-01

### Ejecución con Docker

Para ejecutar el proyecto utilizando Docker, sigue estos pasos:

1. Asegúrate de tener Docker instalado en tu máquina.

2. Clona el repositorio desde GitHub:

```bash
git clone https://github.com/SantiagoTaracena/cipher-project-01.git
```

3. Navega al directorio raíz del proyecto:

```bash
cd src/
```

4. Construye y ejecuta los servicios utilizando Docker Compose:

```bash
docker-compose up --build
```

Esto construirá las imágenes y ejecutará los contenedores para la API y el frontend de la aplicación.

### Ejecución sin Docker

Para ejecutar sin Docker, es necesario configurar el frontend y el backend por separado. Los pasos son los siguientes:

1. Asegúrate de tener instalado Python y Node.js en tu computadora.

2. Clona el repositorio desde GitHub:

```bash
git clone https://github.com/SantiagoTaracena/cipher-project-01.git
```

3. Navega a la carpeta del backend:

```bash
cd src/backend
```

4. Instala las librerías de Python necesarias:

```bash
pip install -r requirements.txt
```

5. Corre el código de Python:

```bash
python app.py
```

6. Navega a la carpeta del frontend:

```bash
cd ../frontend
```

7. Instala las librerías de Node.js necesarias:

```bash
npm install
```

8. Corre el código de React:

```bash
npm run dev
```

Esto instalará las dependencias necesarias en ambos proyectos y los correrá en los puertos 5000 y 5173 respectivamente.
