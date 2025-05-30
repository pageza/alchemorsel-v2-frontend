FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Create .env file from Docker secrets
RUN echo "VITE_API_URL=$(cat /run/secrets/api_url)" > .env && \
    echo "VITE_APP_TITLE=$(cat /run/secrets/app_title)" >> .env

EXPOSE 5173

ENV PATH="./node_modules/.bin:$PATH"

CMD ["npm", "run", "dev"] 