FROM node:17.5-alpine3.14
# This is a new docker image to be added. !!!!!!!!!
# node:17.5-alpine3.14 
# minizinc/minizinc:latest
# node:16.3-alpine3.12 # used for the group
#16-alpine3.14
#node:17.5-alpine3.14,

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "run", "start"]
