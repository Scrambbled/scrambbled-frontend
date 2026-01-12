FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Vite dev server port
EXPOSE 5173

# Run Vite in dev mode, binding to all interfaces
CMD ["npm", "run", "dev", "--", "--host"]