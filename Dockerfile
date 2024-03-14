# Use the official image as a base image
FROM node:alpine

# Set the working directory
COPY . /app
WORKDIR /app

# Install Yarn if it's not installed
RUN if ! command -v yarn &> /dev/null; then npm install --global yarn; fi

# Install dependencies
RUN yarn

# Build the app
RUN yarn build

# Start the app
CMD ["yarn", "start"]