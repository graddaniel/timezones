FROM mongo
WORKDIR /app
COPY . .
CMD mongorestore --host=toptal-timezones-mongo --port=27017 ./dump