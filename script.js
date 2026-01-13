// Configuración de la API
const API_BASE_URL = 'https://pinaresbackend-production.up.railway.app/api';

// Estado de la aplicación
let currentUser = null;
let authToken = null;

// Elementos del DOM
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const refreshBtn = document.getElementById('refresh-btn');
const interiorHouses = document.getElementById('interior-houses');
const exteriorHouses = document.getElementById('exterior-houses');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    refreshBtn.addEventListener('click', loadHouses);
}

// Verificar autenticación
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showMainApp();
        loadHouses();
    } else {
        showLoginModal();
    }
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const codigo = formData.get('codigo');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ codigo }),
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMainApp();
            loadHouses();
        } else {
            const error = await response.json();
            showLoginError(error.message || 'Código de acceso inválido');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showLoginError('Error de conexión. Intenta nuevamente.');
    }
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    showLoginModal();
}

// Mostrar modal de login
function showLoginModal() {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Ocultar modal de login
function hideLoginModal() {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    loginError.style.display = 'none';
    loginForm.reset();
}

// Mostrar aplicación principal
function showMainApp() {
    hideLoginModal();
    userName.textContent = currentUser.nombre;
}

// Mostrar error de login
function showLoginError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
}

// Cargar casas desde la API
async function loadHouses() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/houses`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            const houses = data.houses || []; // Extraer el array de casas del objeto
            console.log('Casas cargadas:', houses); // Debug
            renderHouses(houses);
        } else {
            console.error('Error al cargar casas:', response.statusText);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Renderizar casas
function renderHouses(houses) {
    console.log('Renderizando casas:', houses); // Debug
    
    // Separar casas por tipo - más flexible para diferentes clasificaciones
    const interiorHousesList = houses.filter(house => {
        const type = (house.type || '').toLowerCase();
        const classification = (house.classification || '').toLowerCase();
        return type.includes('indoor') || type.includes('interior') || 
               classification.includes('indoor') || classification.includes('interior') ||
               type.includes('adentro') || classification.includes('adentro') ||
               type.includes('dentro') || classification.includes('dentro');
    });
    
    const exteriorHousesList = houses.filter(house => {
        const type = (house.type || '').toLowerCase();
        const classification = (house.classification || '').toLowerCase();
        return type.includes('outdoor') || type.includes('exterior') || 
               classification.includes('outdoor') || classification.includes('exterior') ||
               type.includes('afuera') || classification.includes('afuera') ||
               type.includes('fuera') || classification.includes('fuera');
    });
    
    console.log('Casas interiores:', interiorHousesList); // Debug
    console.log('Casas exteriores:', exteriorHousesList); // Debug
    
    // Renderizar casas interiores
    interiorHouses.innerHTML = '';
    if (interiorHousesList.length === 0) {
        interiorHouses.innerHTML = '<p class="loading">No hay casas interiores disponibles</p>';
    } else {
        interiorHousesList.forEach(house => {
            interiorHouses.appendChild(createHouseCard(house));
        });
    }
    
    // Renderizar casas exteriores
    exteriorHouses.innerHTML = '';
    if (exteriorHousesList.length === 0) {
        exteriorHouses.innerHTML = '<p class="loading">No hay casas exteriores disponibles</p>';
    } else {
        exteriorHousesList.forEach(house => {
            exteriorHouses.appendChild(createHouseCard(house));
        });
    }
}

// Crear tarjeta de casa
function createHouseCard(house) {
    console.log('Creando tarjeta para casa:', house); // Debug
    const card = document.createElement('div');
    card.className = `house-card status-${house.status}`;
    
    const statusText = getStatusText(house.status);
    const checksText = getChecksText(house.Checks); // Usar 'Checks' con mayúscula
    const classificationText = getClassificationText(house.classification);
    const typeText = getTypeText(house.type);
    const checksIcon = getChecksIcon(house.Checks); // Usar 'Checks' con mayúscula
    
    console.log('Checks:', house.Checks, 'Texto:', checksText, 'Icono:', checksIcon); // Debug
    
    card.innerHTML = `
        <div class="house-name">${house.name} - ${typeText}</div>
        <div class="house-type">${classificationText}</div>
        <div class="house-status status-${house.status}">${statusText}</div>
        ${house.Checks && house.Checks !== 'Nada' ? `
            <div class="house-checks ${getChecksClass(house.Checks)}">
                <i class="${checksIcon}"></i>
                <span>${checksText}</span>
            </div>
        ` : ''}
        ${createStatusButtons(house)}
    `;
    
    // Agregar eventos a los botones de estado
    const buttons = card.querySelectorAll('.status-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newStatus = btn.dataset.status;
            // Solo hacer la petición si no es el estado actual
            if (newStatus !== house.status) {
                updateHouseStatus(house.id, newStatus);
            }
        });
    });
    
    return card;
}

// Crear botones de estado
function createStatusButtons(house) {
    return `
        <div class="house-status-buttons">
            <button class="status-btn clean ${house.status === 'clean' ? 'current' : ''}" data-status="clean">
                Limpia
            </button>
            <button class="status-btn dirty ${house.status === 'dirty' ? 'current' : ''}" data-status="dirty">
                Sucia
            </button>
            <button class="status-btn occupied ${house.status === 'occupied' ? 'current' : ''}" data-status="occupied">
                Ocupada
            </button>
        </div>
    `;
}

// Obtener icono de checks
function getChecksIcon(checks) {
    const iconMap = {
        'Nada': '',
        'Check-out': 'fas fa-sign-out-alt',
        'Check-in': 'fas fa-sign-in-alt',
        'Check-in Check-out': 'fas fa-exchange-alt'
    };
    return iconMap[checks] || '';
}

// Obtener clase CSS para checks
function getChecksClass(checks) {
    if (checks === 'Check-in') {
        return 'check-in';
    }
    if (checks === 'Check-out') {
        return 'check-out';
    }
    if (checks === 'Check-in Check-out') {
        return 'check-in check-out';
    }
    if (checks === 'Nada') {
        return 'no-checks';
    }
    return '';
}

// Obtener texto del estado
function getStatusText(status) {
    const statusMap = {
        'clean': 'Limpia',
        'dirty': 'Sucia',
        'occupied': 'Ocupada'
    };
    return statusMap[status] || status;
}

// Obtener texto del tipo
function getTypeText(type) {
    const typeMap = {
        'indoor': 'Interior',
        'outdoor': 'Exterior',
        'interior': 'Interior',
        'exterior': 'Exterior'
    };
    return typeMap[type] || type;
}

// Obtener texto de la clasificación
function getClassificationText(classification) {
    const classificationMap = {
        'gold_premium': 'Gold Premium',
        'gold_standard': 'Gold Standard',
        'gold': 'Gold'
    };
    return classificationMap[classification] || classification;
}

// Obtener texto de los checks
function getChecksText(checks) {
    const checksMap = {
        'Nada': '',
        'Check-out': 'Se va hoy',
        'Check-in': 'Llega hoy',
        'Check-in Check-out': 'Check-in Check-out'
    };
    return checksMap[checks] || checks || '';
}

// Actualizar estado de una casa
async function updateHouseStatus(houseId, newStatus) {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/houses/${houseId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        
        if (response.ok) {
            console.log(`Casa ${houseId} actualizada a ${newStatus}`);
            // Recargar todas las casas para actualizar la vista
            loadHouses();
        } else {
            console.error('Error al actualizar estado:', response.statusText);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Auto-refresh cada 30 segundos
setInterval(() => {
    if (authToken) {
        loadHouses();
    }
}, 30000);
