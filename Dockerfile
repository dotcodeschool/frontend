FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and content
COPY . .

# Build the static site
RUN pnpm build

# Serve with a simple static server
RUN npm install -g serve
CMD ["serve", "dist", "-l", "3000"]
EXPOSE 3000
