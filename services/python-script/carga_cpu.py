# Código Python para sobrecarga de procesador (controlado).

import multiprocessing
import time
import argparse

# -----------------------------
# consumir_cpu: Pensada en un loop infinito que consuma recursos
# del procesador.
# -----------------------------
def consumir_cpu():
    x = 0
    while True:
        x += 1
        x *= 2
        x /= 2


# -----------------------------
# Consumo de RAM: Pensada en una sobrecarga en la memoria RAM.
# (Tener en cuenta otros procesos activos de la computadora!).
# -----------------------------
def consumir_ram(mb):
    print(f"Reservando {mb} MB de RAM...")

    datos = bytearray(mb * 1024 * 1024)

    for i in range(0, len(datos), 4096):
        datos[i] = 1

    while True:
        time.sleep(1)


# -----------------------------
# Programa principal
# -----------------------------
if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Generador de carga artificial para CPU y RAM"
    )

    parser.add_argument(
        "--cpu",
        type=int,
        default=1,
        help="Cantidad de procesos consumidores de CPU"
    )

    parser.add_argument(
        "--ram",
        type=int,
        default=0,
        help="RAM a consumir en MB"
    )

    parser.add_argument(
        "--time",
        type=int,
        default=60,
        help="Tiempo de ejecución en segundos"
    )

    args = parser.parse_args()

    procesos = []

    # Procesos CPU
    for _ in range(args.cpu):
        p = multiprocessing.Process(target=consumir_cpu)
        p.start()
        procesos.append(p)

    # Proceso RAM
    if args.ram > 0:
        p = multiprocessing.Process(
            target=consumir_ram,
            args=(args.ram,)
        )
        p.start()
        procesos.append(p)

    print("Carga artificial iniciada...")
    print(f"CPU: {args.cpu} procesos")
    print(f"RAM: {args.ram} MB")
    print(f"Duración: {args.time} segundos")

    time.sleep(args.time)

    print("Finalizando procesos...")

    for p in procesos:
        p.terminate()

    for p in procesos:
        p.join()

    print("Prueba terminada.")
