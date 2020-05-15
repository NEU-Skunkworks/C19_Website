FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app

# Declaring environment variables


#Copying over package.json and package-lock.json
COPY package*.json ./

#Installing all the dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

#Copying over all the files
COPY . .

#Exposing port 3000
EXPOSE 3000
#Running the command
CMD [ "node", "server.js" ]