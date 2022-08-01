FROM mongo
WORKDIR /app
COPY . .
CMD mongorestore --host=toptal-timezones-mongo --port=27017 ./dump
#CMD ["/app/mongorestore", "--host=toptal-timezones-mongo", "--port=27017", "/dump"]
#CMD ls /app/mongorestore