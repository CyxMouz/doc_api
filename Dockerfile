# Use an official Node.js runtime as the base image with a specific version (e.g., 18)
FROM node:18

# Install Git
RUN apt-get update && apt-get install -y git

# Create and set the working directory in the container
WORKDIR /app

# Clone your GitHub repository
RUN git clone https://github.com/CyxMouz/doc_api .

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application will run on (3000 in this case)
EXPOSE 3000


# Define the command to start your Node.js application
CMD ["npm", "start"]
