#!/bin/bash


# Initialize root package.json
npm init -y

# Update root package.json
cat > package.json << EOL
{
  "name": "code-sketch",
  "version": "1.0.0",
  "description": "An app for code sketching with LLM assistance",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "start": "concurrently \"npm run start:client\" \"npm run start:server\"",
    "start:client": "cd packages/client && npm run dev",
    "start:server": "cd packages/server && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.2.2"
  }
}
EOL

# Create root tsconfig.json
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOL

# Create client package
mkdir -p packages/client/src/styles
cd packages/client

# Initialize client package.json
npm init -y

# Update client package.json
cat > package.json << EOL
{
  "name": "client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
EOL

# Create vite.config.js
cat > vite.config.js << EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
EOL

# Create App.jsx
cat > src/App.jsx << EOL
import React from 'react'
import './styles/global.css'

function App() {
  return (
    <div>
      <h1>Code Sketch App</h1>
    </div>
  )
}

export default App
EOL

# Create global.css
touch src/styles/global.css

# Navigate back to project root
cd ../..

# Create server package
mkdir -p packages/server/src
cd packages/server

# Initialize server package.json
npm init -y

# Update server package.json
cat > package.json << EOL
{
  "name": "server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node --loader ts-node/esm src/index.ts",
    "dev": "nodemon --exec node --loader ts-node/esm src/index.ts"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.9",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1"
  }
}
EOL

# Create server tsconfig.json
cat > tsconfig.json << EOL
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext"
  },
  "include": ["src/**/*"]
}
EOL

# Create index.ts
cat > src/index.ts << EOL
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from the server!' }));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
EOL

# Navigate back to project root
cd ../..

# Install dependencies
npm install

echo "Project setup complete. You can now run 'npm start' to start the application."