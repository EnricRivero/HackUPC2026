# HACKUPC 2026

# GitEase

GitEase es una herramienta diseñada para mejorar la comprensión del uso de Git. Surge de la necesidad de ofrecer mayor claridad sobre las acciones que se ejecutan en un repositorio, evitando que el usuario trabaje “a ciegas” con comandos cuyo impacto no siempre es evidente.

El proyecto propone una capa intermedia entre el usuario y Git, proporcionando explicaciones claras antes de ejecutar cualquier operación.

---

## Descripción

GitEase permite al usuario expresar acciones relacionadas con Git de forma natural. A partir de esa entrada, el sistema:

1. Interpreta la intención del usuario  
2. Traduce dicha intención a un comando de Git  
3. Explica qué efectos tendrá ese comando  
4. Solicita confirmación antes de ejecutarlo  

De este modo, se fomenta un uso más consciente y seguro de Git, especialmente útil en contextos de aprendizaje o en situaciones donde se desea evitar errores.

---

## Ejemplo de funcionamiento

Entrada del usuario:
> Quiero subir mis cambios al repositorio

Interpretación del sistema:
```bash
git push origin main
