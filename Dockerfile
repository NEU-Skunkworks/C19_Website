FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app

ENV MONGO_DB_URL_LOCAL="mongodb://mongo:27017/CVD19DEV"
ENV MONGO_DB_URL_DEV="mongodb://Skunks:Skunks2019@covid-mongo.cluster-cpzbdytelbqi.us-east-1.docdb.amazonaws.com:27017/CVD19DEV?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
ENV VOLUNTEER_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAjlxv3/xA8O3WYq5M\nv/NvDKhINwUMz52wbSAStbCu5aYv+eKp3f2yQh74nAnF7e9OnzBnrAcK64u9Fcpv\nsXaM8wIDAQABAkBN1K+9b3Y5wm4xKUYAs6CE9QP2QKaOY5HvN1fDScN0/Z0B22lw\nONmZSrQVt5D83p857RAuqT7mp+up21oe+kvRAiEA9y0wB8CJA5uxiPgsBoHS9s+l\nKqZLizZvLnFGUg76CIcCIQCTcWXcF0t8fgOYw0qv+NamxY2nDc9oVIkvauvb8U4v\nNQIgSlN5POuFh+M6eIB/5JkHUhZQiUmmL793oVSIm8ZLI2MCIBrVPVtjpeo/KLpp\neDM0TyREubXYTpHHKLxHcisx7C+tAiBg1pOh+QOOvohujy428Nwal+tkr1jNT6qL\nXbQDQBOl0w==\n-----END PRIVATE KEY-----"
ENV VOLUNTEER_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAI5cb9/8QPDt1mKuTL/zbwyoSDcFDM+d\nsG0gErWwruWmL/niqd39skIe+JwJxe3vTp8wZ6wHCuuLvRXKb7F2jPMCAwEAAQ==\n-----END PUBLIC KEY-----"
ENV RESEARCHER_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAlWp59AJ5rzYekPri\n6DGbicYAPaswrNaH0sodHppLRJYCa5HgvCKIILuuwdi8lwMgm3a9EAzYWCReGIYv\nAFB46wIDAQABAkEAi5i1ZALECaz4ld+xC9r9RJVXOEau7Wxp7cijuCnT1LkbEc2C\nt1BbNbCeLSA5oYYEvuT5mrNkzSGJi+rVsWYzEQIhANjz6dOz2Cf//c7Wue2f4bRH\n9DQDzuS9/VsJOJGs2kuvAiEAsE7OWstz/7kjZ9WFFHIPfnwGSJh1cX0TnAbMKlci\nCYUCIGpUYS2Y3z/7fvF42/dSfNRWz6EOnMAPPbT4d/kttm+RAiBVWXEQBxnam9eF\n9pl78lOJ2aR5FEUWcYRCrg+8F35EuQIgHZYtJuMV+hYi9Rw9Bv5xUVCE9jGZpyBK\nQqw6Ns03q1o=\n-----END PRIVATE KEY-----"
ENV RESEARCHER_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJVqefQCea82HpD64ugxm4nGAD2rMKzW\nh9LKHR6aS0SWAmuR4LwiiCC7rsHYvJcDIJt2vRAM2FgkXhiGLwBQeOsCAwEAAQ==\n-----END PUBLIC KEY-----"
ENV VERIFY_OPTIONS_EXPIRES_IN="12h"
ENV VERIFY_OPTIONS_ALGORITHM="RS256"
ENV TEMP_PASSWORD_LENGTH=15
ENV RDS_FILE="rds-combined-ca-bundle.pem"

#Copying over package.json and package-lock.json
COPY package*.json ./

#Installing all the dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

#Copying over all the files
COPY . .
# RUN wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
# RUN echo "$MONGO_DB_URL_DEV"
#Exposing port 3000
EXPOSE 3000
#Running the command
CMD [ "node", "server.js" ]