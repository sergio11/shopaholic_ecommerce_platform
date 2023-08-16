FROM node:14 AS build

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
