# Re-Mind

Opstarten

! Check eerst of alle packages gedownload zijn !

3 verschillende terminals
--------------------------------

## Backend
- cd backend
- node server.js

## Frontend
- cd frontend
- npm run dev

## Electron
- cd electron
- npm start

### Electron Build
- cd electron
- npm run dist

### Electron publishen
- version aanpassen in package.json
- cd electron
- $env:GH_TOKEN="jouw_github_token"
- npm run release