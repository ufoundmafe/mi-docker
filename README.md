# Configuracion entorno — Contenedor
## Integrantes del grupo

| Nombre Completo                 | Código     | Rol           | Correo Electrónico                        |
|---------------------------------|------------|---------------|-------------------------------------------|
| María Fernanda González Ramírez | 202477325  | Colaborador   | maria.gonzalez.r@correounivalle.edu.co    |
| Laura Sofía Echeverry González  | 202477067  | Colaborador   | echeverry.laura@correounivalle.edu.co     |

## Descripción del Proyecto
Este proyecto implementa un entorno local controlado de alta disponibilidad y multi-contenedorizado utilizando **Docker Compose** sobre el Kernel nativo de Linux mediante **WSL2 (Windows Subsystem for Linux)**. 

El clúster automatiza el despliegue de 5 servicios independientes que interactúan entre sí a través de redes aisladas y puentes seguros, simulando una arquitectura moderna de microservicios en producción.

---

## Arquitectura del Entorno y Redes
El diseño se segmenta en dos redes virtuales internas (`bridge`):
1. **`dmz_frontend`**: Zona desmilitarizada expuesta que interconecta el Servidor Web (Nginx) y la API lógica (Node.js).
2. **`secure_backend`**: Red privada aislada de accesos externos directos, encargada de la intercomunicación segura entre la API, el motor relacional (PostgreSQL), la administración (pgAdmin) y el laboratorio de analítica (Jupyter Lab).

---

## Requisitos Previos e Instalación Base (WSL2 Linux)
Pasos sistemáticos ejecutados en la terminal de Ubuntu:
1. Actualización de dependencias principales del sistema: `sudo apt update && sudo apt upgrade -y`
2. Configuración de repositorios de Docker e instalación nativa de `docker-ce` y `docker-compose-plugin`.
3. Gestión de privilegios de usuario sin root: `sudo usermod -aG docker $USER`.
4. Inicialización manual del servicio en WSL2: `sudo service docker start`.

---

## Comandos Operativos Utilizados
* **Despliegue del entorno:** `docker compose up -d`
* **Validación de orquestación:** `docker ps`
* **Inspección de logs:** `docker logs api_node`
* **Conexión interactiva SQL:** `docker exec -it postgres_container psql -U dev_root -d production_db`

---

## Evidencias de Funcionamiento (Resultados del Laboratorio)

### 1. Estado del Clúster Local
El despliegue fue exitoso y los 5 contenedores se encuentran levantados y saludables (`Healthy` / `Running`).
<img width="1126" height="290" alt="image" src="https://github.com/user-attachments/assets/48365d1a-42a3-401b-bdb7-0300c33c2fa2" />

### 2. Capa Frontend - Servidor Web Nginx
Verificación del puerto `8080`, sirviendo el archivo HTML mapeado mediante volúmenes.
<img width="1067" height="154" alt="image" src="https://github.com/user-attachments/assets/d96fc01a-101b-4b72-b781-56481e25db0e" />

### 3. Capa Lógica - API Node.js (Health Check)
Verificación del puerto `3000` respondiendo de forma nativa en formato JSON.
<img width="564" height="179" alt="image" src="https://github.com/user-attachments/assets/34ab614b-a13a-47fd-989d-b0b71c10d210" />

### 4. Capa de Datos - Conexión Exitosa API — PostgreSQL
Demostración de la comunicación inter-contenedor. La API resuelve el DNS interno `postgres_container` y extrae la estampa de tiempo del motor relacional.
<img width="581" height="190" alt="image" src="https://github.com/user-attachments/assets/124bc5b1-69a1-413c-a5cf-da03cf4cc424" />

### 5. Capa Analítica - Jupyter Lab
Entorno científico persistente inicializado correctamente mediante Token de seguridad.
<img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/4c998689-faf5-4380-98b3-3b479de7ae48" />
