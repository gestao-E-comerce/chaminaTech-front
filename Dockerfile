FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine

# Cria a pasta ssl dentro do contêiner
RUN mkdir -p /etc/ssl

# Copia os certificados para o contêiner
COPY cert.pem /etc/ssl/cert.pem
COPY privkey.pem /etc/ssl/privkey.pem

# Copia o arquivo de configuração nginx.conf atualizado
COPY nginx.conf /etc/nginx/nginx.conf

# Copia o conteúdo da build para a pasta do NGINX
COPY --from=build /app/dist/front-end/browser /usr/share/nginx/html

# Expõe a porta 443 para o contêiner
EXPOSE 443

# Roda o NGINX em modo não daemonizado
CMD ["nginx", "-g", "daemon off;"]
