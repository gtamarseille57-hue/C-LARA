/**
 * C++LARA Main JavaScript
 * Blood Strike Weapon Modifier
 */

// State management
const state = {
    currentWeapon: null,
    currentSkin: null,
    currentLoadout: {
        barrel: null,
        optic: null,
        stock: null,
        muzzle: null
    },
    savedLoadouts: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('🚀 C++LARA Initialized');
    
    // Load weapons
    loadWeapons();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load saved presets
    loadSavedPresets();
}

/**
 * Load weapons from data
 */
function loadWeapons() {
    const weaponsGrid = document.getElementById('weaponsGrid');
    const weaponList = document.getElementById('weaponList');
    
    weaponsData.forEach(weapon => {
        // Add to grid
        const card = document.createElement('div');
        card.className = 'weapon-card';
        card.innerHTML = `
            <div class="weapon-icon">${weapon.icon}</div>
            <div class="weapon-name">${weapon.name}</div>
            <div class="weapon-type">${weapon.type}</div>
        `;
        card.addEventListener('click', () => selectWeapon(weapon.id, weapon));
        weaponsGrid.appendChild(card);
        
        // Add to modifier list
        const item = document.createElement('div');
        item.className = 'weapon-list-item';
        item.textContent = `${weapon.icon} ${weapon.name}`;
        item.addEventListener('click', () => {
            selectWeapon(weapon.id, weapon);
            document.querySelectorAll('.weapon-list-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
        weaponList.appendChild(item);
    });
}

/**
 * Select a weapon
 */
function selectWeapon(weaponId, weaponData) {
    state.currentWeapon = weaponId;
    console.log(`🔫 Selected: ${weaponData.name}`);
    
    // Load skins for this weapon
    loadSkins(weaponData);
    
    // Show modifier section
    showModifierSection();
}

/**
 * Load skins for selected weapon
 */
function loadSkins(weaponData) {
    const skinSelector = document.getElementById('skinSelector');
    skinSelector.innerHTML = '';
    
    if (weaponData.skins) {
        weaponData.skins.forEach(skin => {
            const option = document.createElement('div');
            option.className = 'skin-option';
            option.textContent = `🎨 ${skin}`;
            option.addEventListener('click', () => {
                selectSkin(skin);
                document.querySelectorAll('.skin-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
            skinSelector.appendChild(option);
        });
    }
}

/**
 * Select a skin
 */
function selectSkin(skinName) {
    state.currentSkin = skinName;
    console.log(`🎨 Selected skin: ${skinName}`);
    updateStatsDisplay();
}

/**
 * Show modifier section
 */
function showModifierSection() {
    const modifierSection = document.querySelector('.modifier-section');
    modifierSection.classList.add('active');
    modifierSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/**
 * Switch tab
 */
function switchTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active from buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activate button
    event.target.classList.add('active');
}

/**
 * Apply loadout to game
 */
function applyLoadout() {
    if (!state.currentWeapon) {
        showNotification('❌ Please select a weapon first', 'error');
        return;
    }
    
    console.log('✅ Applying loadout:', state);
    showNotification('✅ Loadout applied successfully!', 'success');
    
    // Simulate applying to game
    animateApply();
}

/**
 * Save loadout
 */
function saveLoadout() {
    if (!state.currentWeapon) {
        showNotification('❌ Please select a weapon first', 'error');
        return;
    }
    
    const name = prompt('Enter loadout name:');
    if (!name) return;
    
    const loadout = {
        name: name,
        weapon: state.currentWeapon,
        skin: state.currentSkin,
        attachments: { ...state.currentLoadout }
    };
    
    state.savedLoadouts.push(loadout);
    console.log('💾 Saved loadout:', loadout);
    showNotification(`💾 Loadout "${name}" saved!`, 'success');
    
    // Save to localStorage
    saveToLocalStorage();
}

/**
 * Load a preset
 */
function loadPreset(index) {
    if (index >= state.savedLoadouts.length) return;
    
    const preset = state.savedLoadouts[index];
    state.currentWeapon = preset.weapon;
    state.currentSkin = preset.skin;
    state.currentLoadout = { ...preset.attachments };
    
    console.log('📦 Loaded preset:', preset.name);
    showNotification(`📦 Preset "${preset.name}" loaded!`, 'success');
}

/**
 * Update stats display
 */
function updateStatsDisplay() {
    const stats = calculateStats();
    // Update stat bars with animation
    console.log('📊 Stats updated:', stats);
}

/**
 * Calculate weapon stats
 */
function calculateStats() {
    return {
        damage: 85,
        fireRate: 75,
        accuracy: 92,
        recoil: 68,
        mobility: 88,
        magazine: 30
    };
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Animate apply button
 */
function animateApply() {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '⚡ APPLYING...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = '✅ APPLIED';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    }, 1500);
}

/**
 * Save to localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('c_lara_loadouts', JSON.stringify(state.savedLoadouts));
}

/**
 * Load from localStorage
 */
function loadSavedPresets() {
    const saved = localStorage.getItem('c_lara_loadouts');
    if (saved) {
        state.savedLoadouts = JSON.parse(saved);
    }
}

/**
 * Start modifier
 */
function startModifier() {
    const modifierSection = document.querySelector('.modifier-section');
    modifierSection.classList.add('active');
    modifierSection.scrollIntoView({ behavior: 'smooth' });
    showNotification('🎮 Modifier mode activated!', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        if (e.key === 's') {
            e.preventDefault();
            saveLoadout();
        } else if (e.key === 'q') {
            e.preventDefault();
            if (confirm('Exit C++LARA?')) {
                window.close();
            }
        }
    }
});

console.log('%c🎮 C++LARA - Blood Strike Weapon Modifier v1.0', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%cDeveloped by: gtamarseille57-hue', 'color: #00d4ff;');
console.log('%cGitHub: https://github.com/gtamarseille57-hue/C-LARA', 'color: #00d4ff;');
