# Biolink Premium - Self-Hosted Application

A premium self-hosted biolink application built with Node.js, Express, and React.

## Features

- ✅ **Premium License Validation** - Built-in license key validation
- ✅ **Admin Dashboard** - Full-featured admin panel for managing your biolink
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Custom Themes** - Light and dark themes with background effects
- ✅ **Social Links** - Add unlimited social media links
- ✅ **Custom Links** - Add custom links with descriptions
- ✅ **Real-time Preview** - See changes instantly
- ✅ **Particles.js Integration** - Beautiful particle background effects
- ✅ **Background Images** - Custom background image support

## Quick Start

### 1. Installation

```bash
# Clone or download the project
cd biolink-premium

# Install server dependencies
npm install

# Install client dependencies
npm run install-client

# Build the client
npm run build-client
```

### 2. Configuration

Edit `config.json`:
```json
{
  "password": "your-secure-password",
  "licenseKey": "B10L1NK-PR3M1UM-2025"
}
```

### 3. Run the Application

```bash
# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

### 4. Access Your Biolink

- **Public Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## File Structure

```
biolink-premium/
├── server.js              # Main server file
├── package.json           # Server dependencies
├── config.json            # Configuration file
├── database.json          # Data storage
├── README.md              # This file
└── client/                # React frontend
    ├── package.json       # Client dependencies
    ├── public/
    │   └── index.html     # React app entry
    ├── login.html         # Login page
    └── src/
        ├── index.js       # React entry point
        ├── App.js         # Main app component
        └── components/    # React components
```

## API Endpoints

- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/biolink` - Get biolink data
- `POST /api/biolink` - Save biolink data (requires auth)

## Features Guide

### Admin Dashboard
- **Profile**: Update name, bio, and profile image
- **Links**: Add, edit, and delete custom links
- **Socials**: Add social media links
- **Theme**: Choose between light/dark themes
- **Effects**: Add background effects and animations

### Public Page
- Responsive design
- Real-time updates
- Social media icons
- Custom styling based on theme settings

## Security Features

- Session-based authentication
- Password protection
- License key validation
- No database required (JSON file storage)

## Customization

### Adding New Social Platforms
Edit the `platforms` array in `client/src/components/SocialsEditor.js`

### Adding New Themes
Extend the `themes` array in `client/src/components/ThemeEditor.js`

### Adding New Animations
Extend the `animations` array in `client/src/components/ThemeEditor.js`

## License

This is a premium application. License key validation is required for operation.

## Support

For support and updates, ensure your license key is valid and up to date.
