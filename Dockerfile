 FROM node:latest

 RUN mkdir -p /app

 WORKDIR /app

# COPY package.json /app
#
# RUN npm install
#
# COPY . /app

# RUN git clone https://github.com/vishnubob/wait-for-it.git

 EXPOSE 3000

# ENTRYPOINT ["node"]
# CMD ["app.js"]
