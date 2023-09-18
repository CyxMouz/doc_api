
FROM node:18-alpine

# RUN apt-get update && apt-get install -y git

# RUN apt-get update && apt-get install -y mongodb


WORKDIR /app


# RUN git clone https://github.com/CyxMouz/doc_api .


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 3000


# Define the command to start your Node.js application
CMD ["npm", "start"]
