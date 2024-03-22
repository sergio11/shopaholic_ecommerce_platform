FROM node:20-alpine as angular
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=angular /app/dist/shopaholic-backoffice /usr/share/nginx/html
EXPOSE 80
