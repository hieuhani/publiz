# sqldb

Database models and data repository access layer of Publiz

## Repository conventions

1. A function starts with **get** must throw a not found error if the the record is not found
2. A function starts with **find** must return a list of records
