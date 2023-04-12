# Interesting setup from Sid Palas https://twitter.com/sidpalas/status/1634194026500096000
FROM node:18-alpine AS base

WORKDIR /usr/src/app
COPY package*.json ./

# Dev
FROM base as dev
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install
COPY . .
CMD ["npm", "run", "dev"]

# Production
FROM base as production

ENV NODE_ENV production
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

USER node

COPY --chown=node:node ./src/ .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]