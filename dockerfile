FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy script
COPY --chown=node:node convert-cookies.js .

# Set Node user
USER node

# Execute convert-cookies.js
CMD [ "node", "convert-cookies.js", "file-with-cookies-copy-pasted-from-Chrome.txt"]
