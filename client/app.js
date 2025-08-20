// Global variables
let biolinkData = {};
let currentLinkId = 1;

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderUI();
    initializeSortable();
});

// Load data from server
async function loadData() {
    try {
        const response = await fetch('/api/biolink');
        biolinkData = await response.json();
        currentLinkId = Math.max(...biolinkData.links.map(link => link.id || 0), 0) + 1;
    } catch (error) {
        console.error('Error loading data:', error);
        // Initialize with default data if loading fails
        biolinkData = {
            profile: { name: "@YourName", bio: "Welcome to my Biolink!", imageUrl: "" },
            socials: {},
            links: [],
            theme: "light",
            animation: "fade",
            backgroundEffect: "none",
            backgroundImageUrl: ""
        };
    }
}

// Render UI with current data
function renderUI() {
    renderProfile();
    renderLinks();
    renderSocials();
    renderThemeSettings();
}

// Profile section
function renderProfile() {
    document.getElementById('profileName').value = biolinkData.profile.name || '';
    document.getElementById('profileBio').value = biolinkData.profile.bio || '';
    document.getElementById('profileImage').value = biolinkData.profile.imageUrl || '';
}

// Links section
function renderLinks() {
    const container = document.getElementById('linksList');
    container.innerHTML = '';
    
    biolinkData.links.forEach(link => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 border rounded-lg bg-gray-50';
        div.innerHTML = `
            <div class="flex-1">
                <h4 class="font-medium">${link.title}</h4>
                <p class="text-sm text-gray-600">${link.url}</p>
                ${link.description ? `<p class="text-xs text-gray-500">${link.description}</p>` : ''}
            </div>
            <div class="flex space-x-2 ml-4">
                <button onclick="editLink(${link.id})" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteLink(${link.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Social links section
function renderSocials() {
    const container = document.getElementById('socialsList');
    container.innerHTML = '';
    
    Object.entries(biolinkData.socials).forEach(([platform, url]) => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 border rounded-lg bg-gray-50';
        div.innerHTML = `
            <div class="flex items-center">
                <i class="fab fa-${platform} text-2xl mr-3"></i>
                <span class="font-medium">${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            </div>
            <div class="flex space-x-2">
                <a href="${url}" target="_blank" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                <button onclick="editSocial('${platform}')" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteSocial('${platform}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Theme settings
function renderThemeSettings() {
    document.getElementById('theme').value = biolinkData.theme || 'light';
    document.getElementById('animation').value = biolinkData.animation || 'fade';
    document.getElementById('backgroundEffect').value = biolinkData.backgroundEffect || 'none';
    document.getElementById('backgroundImage').value = biolinkData.backgroundImageUrl || '';
}

// Link management
function addLink() {
    document.getElementById('linkModalTitle').textContent = 'Add Link';
    document.getElementById('linkId').value = '';
    document.getElementById('linkTitle').value = '';
    document.getElementById('linkUrl').value = '';
    document.getElementById('linkDescription').value = '';
    document.getElementById('linkModal').classList.remove('hidden');
}

function editLink(id) {
    const link = biolinkData.links.find(l => l.id === id);
    if (link) {
        document.getElementById('linkModalTitle').textContent = 'Edit Link';
        document.getElementById('linkId').value = link.id;
        document.getElementById('linkTitle').value = link.title;
        document.getElementById('linkUrl').value = link.url;
        document.getElementById('linkDescription').value = link.description || '';
        document.getElementById('linkModal').classList.remove('hidden');
    }
}

function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        biolinkData.links = biolinkData.links.filter(link => link.id !== id);
        renderLinks();
        initializeSortable();
    }
}

function saveLink() {
    const id = document.getElementById('linkId').value ? parseInt(document.getElementById('linkId').value) : currentLinkId++;
    const title = document.getElementById('linkTitle').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const description = document.getElementById('linkDescription').value.trim();
    
    if (!title || !url) {
        alert('Please fill in title and URL');
        return;
    }
    
    const link = { id, title, url };
    if (description) link.description = description;
    
    const existingIndex = biolinkData.links.findIndex(l => l.id === id);
    if (existingIndex >= 0) {
        biolinkData.links[existingIndex] = link;
    } else {
        biolinkData.links.push(link);
    }
    
    closeLinkModal();
    renderLinks();
    initializeSortable();
}

function closeLinkModal() {
    document.getElementById('linkModal').classList.add('hidden');
}

// Social management
function addSocial() {
    document.getElementById('socialPlatform').value = 'twitter';
    document.getElementById('socialUrl').value = '';
    document.getElementById('socialModal').classList.remove('hidden');
}

function editSocial(platform) {
    document.getElementById('socialPlatform').value = platform;
    document.getElementById('socialUrl').value = biolinkData.socials[platform] || '';
    document.getElementById('socialModal').classList.remove('hidden');
}

function deleteSocial(platform) {
    if (confirm(`Are you sure you want to delete ${platform}?`)) {
        delete biolinkData.socials[platform];
        renderSocials();
    }
}

function saveSocial() {
    const platform = document.getElementById('socialPlatform').value;
    const url = document.getElementById('socialUrl').value.trim();
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    
    biolinkData.socials[platform] = url;
    closeSocialModal();
    renderSocials();
}

function closeSocialModal() {
    document.getElementById('socialModal').classList.add('hidden');
}

// Data saving
async function saveData() {
    // Update profile data
    biolinkData.profile.name = document.getElementById('profileName').value.trim();
    biolinkData.profile.bio = document.getElementById('profileBio').value.trim();
    biolinkData.profile.imageUrl = document.getElementById('profileImage').value.trim();
    
    // Update theme settings
    biolinkData.theme = document.getElementById('theme').value;
    biolinkData.animation = document.getElementById('animation').value;
    biolinkData.backgroundEffect = document.getElementById('backgroundEffect').value;
    biolinkData.backgroundImageUrl = document.getElementById('backgroundImage').value.trim();
    
    try {
        const response = await fetch('/api/biolink', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(biolinkData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Changes saved successfully!');
        } else {
            alert('Error saving changes');
        }
    } catch (error) {
        alert('Error saving changes: ' + error.message);
    }
}

// Initialize sortable for links
function initializeSortable() {
    const container = document.getElementById('linksList');
    if (container.children.length > 0) {
        new Sortable(container, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: function(evt) {
                const items = Array.from(container.children);
                const newOrder = [];
                
                items.forEach(item => {
                    const title = item.querySelector('h4').textContent;
                    const link = biolinkData.links.find(l => l.title === title);
                    if (link) newOrder.push(link);
                });
                
                biolinkData.links = newOrder;
            }
        });
    }
}

// Logout
async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/admin';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Preview functionality
function previewBiolink() {
    window.open('/', '_blank');
}
