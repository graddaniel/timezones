FROM mongo
WORKDIR /app
COPY . .
CMD mongorestore --host=timezones-mongo --port=27017 ./dump