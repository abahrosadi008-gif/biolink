const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'biolink-premium-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Static files
app.use(express.static('client'));

// License validation
const config = fs.readJsonSync('config.json');
const VALID_LICENSE = 'B10L1NK-PR3M1UM-2025';

if (config.licenseKey !== VALID_LICENSE) {
    console.error('❌ Invalid license key! Please check your config.json');
    process.exit(1);
}

// Initialize database if not exists
if (!fs.existsSync('database.json')) {
    fs.writeJsonSync('database.json', {
        profile: { 
            name: "@YourName", 
            bio: "Welcome to my Biolink! Connect with me through the links below.", 
            imageUrl: "" 
        },
        socials: {},
        links: [],
        theme: "light",
        animation: "none",
        backgroundEffect: "none",
        backgroundImageUrl: ""
    });
}

// API Routes
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === config.password) {
        req.session.authenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

app.get('/api/biolink', async (req, res) => {
    try {
        const data = await fs.readJson('database.json');
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error reading data' });
    }
});

app.post('/api/biolink', requireAuth, async (req, res) => {
    try {
        await fs.writeJson('database.json', req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving data' });
    }
});

// Routes
app.get('/admin', (req, res) => {
    if (req.session.authenticated) {
        res.sendFile(path.join(__dirname, 'client', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'client', 'login.html'));
    }
});

app.get('/', async (req, res) => {
    try {
        const data = await fs.readJson('database.json');
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.profile.name} - Biolink</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    ${data.backgroundEffect === 'particles' ? '<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>' : ''}
    <style>
        body {
            background-color: ${data.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
            color: ${data.theme === 'dark' ? '#ffffff' : '#000000'};
            transition: all 0.3s ease;
        }
        ${data.backgroundImageUrl ? `
        body {
            background-image: url('${data.backgroundImageUrl}');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: -1;
        }
        ` : ''}
    </style>
</head>
<body class="min-h-screen">
    ${data.backgroundEffect === 'particles' ? '<div id="particles-js" class="fixed inset-0 z-0"></div>' : ''}
    <div class="relative z-10 container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto">
            <div class="text-center mb-8">
                ${data.profile.imageUrl ? `<img src="${data.profile.imageUrl}" alt="Profile" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">` : ''}
                <h1 class="text-2xl font-bold mb-2">${data.profile.name}</h1>
                <p class="text-gray-600">${data.profile.bio}</p>
            </div>
            
            <div class="space-y-4">
                ${data.links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                       class="block w-full p-4 rounded-lg border ${data.theme === 'dark' ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-white hover:bg-gray-50'} transition-all duration-200">
                        <div class="flex items-center justify-between">
                            <span class="font-medium">${link.title}</span>
                            <i class="fas fa-external-link-alt text-sm"></i>
                        </div>
                        ${link.description ? `<p class="text-sm text-gray-500 mt-1">${link.description}</p>` : ''}
                    </a>
                `).join('')}
            </div>
            
            ${Object.keys(data.socials).length > 0 ? `
            <div class="flex justify-center space-x-4 mt-8">
                ${Object.entries(data.socials).map(([platform, url]) => `
                    <a href="${url}" target="_blank" rel="noopener noreferrer" 
                       class="text-2xl ${data.theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}">
                        <i class="fab fa-${platform}"></i>
                    </a>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </div>
    
    ${data.backgroundEffect === 'particles' ? `
    <script>
        particlesJS('particles-js', {
            particles: {
                number: { value: 80 },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2
                }
            }
        });
    </script>
    ` : ''}
    
    <script>
        window.__BIOLINK_DATA__ = ${JSON.stringify(data)};
    </script>
</body>
</html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send('Error loading biolink');
    }
});

app.listen(PORT, () => {
    console.log(`✅ Biolink Premium Server running on http://localhost:${PORT}`);
    console.log(`✅ License validated successfully`);
});
