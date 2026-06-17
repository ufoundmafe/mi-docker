FROM python:3.11-slim

# Instalamos las herramientas de estrés y monitoreo 
RUN apt-get update && apt-get install -y \
    stress \
    stress-ng \
    htop \
    cpulimit \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos el script que crearemos en el siguiente paso 
COPY carga_cpu.py .

CMD ["python", "carga_cpu.py"]
