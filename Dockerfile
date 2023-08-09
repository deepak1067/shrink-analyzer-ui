# This is the base of our final image, has nginx.
FROM nginx:1.19-alpine
COPY nginx.conf /etc/nginx/nginx.conf
#create log dir configured in nginx.conf
RUN mkdir -p /var/log/app_engine
# Copy the outputs from the build.
COPY dist/shrink-analyzer-ui /usr/share/nginx/html
# Set the environment variable to adjust the memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Start the server
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/envconfig.template.js > /usr/share/nginx/html/assets/envconfig.js && exec nginx -g 'daemon off;'"]
