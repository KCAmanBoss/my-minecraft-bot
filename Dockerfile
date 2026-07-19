# Use a solid Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package files first and install dependencies
COPY package*.json ./
RUN npm install

# Copy all your bot files into the container
COPY . .

# Hugging Face Spaces strictly requires port 7860
EXPOSE 7860
ENV PORT=7860

# Command to start your bot
CMD ["node", "bot.js"]
