FROM node:20-alpine AS development

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

FROM development AS builder

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 