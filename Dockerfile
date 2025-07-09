# Use the official image as a base image
FROM node:alpine

# Set the working directory
COPY . /dcs-frontend
WORKDIR /dcs-frontend

# Install pnpm if it's not installed
RUN if ! command -v pnpm &> /dev/null; then npm install --global pnpm; fi

# Install dependencies
RUN pnpm install

# Build the app
RUN pnpm build

# Start the app
CMD ["pnpm", "start"]