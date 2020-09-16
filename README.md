# db_migration_v1_v2

Node.js script for upgrading user configuration objects to version 2.

# Requirements

* Node.js (latest LTS recommended)
* two MongoDB document stores ready to be migrated :)

# Usage

* Clone and install:

```bash
git clone git@github.com:sc2pte/db_migration_v1_v2.git
cd db_migration_tool
npm install
```

* Add a new file called `.env` and fill it with values containing connection strings for databases to be migrated:

```
V1_DATABASE_CONNECTION_STRING='mongodb://localhost:27017/oldDb'
V2_DATABASE_CONNECTION_STRING='mongodb://localhost:27017/newDb'
```

* Ensure the collection in new database doesn't contain any valuable data **because it will be deleted without warning**.

* Start the script:

```
node index.js
```
