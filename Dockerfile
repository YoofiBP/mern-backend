FROM node:16-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /mern-app-backend
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
CMD ["node", "dist/server.generated.js"]
EXPOSE 4000
