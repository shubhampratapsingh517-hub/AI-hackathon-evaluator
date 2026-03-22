# Use Node.js 18 base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from root
COPY package*.json ./

# Copy the entire project
COPY . .

# Move into backend directory and install dependencies
WORKDIR /app/backend
RUN npm install

# Expose the port (Hugging Face uses 7860 by default, so we can map it)
EXPOSE 7860

# Command to run the application
# We set PORT to 7860 because Hugging Face expects that
ENV PORT=7860
CMD ["node", "server.js"]
