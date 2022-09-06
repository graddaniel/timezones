To start the application just run `docker-compose up`

The application is initialized with four accounts: `user`, `user2`, `userManager` and `admin`.
Each uses the same password `password123`.

Improvement plans:
- Pagination
- Replacing password MD5 with SHA256
- Remove secrets from `docker-compose.yml` file
- Migrate to TypeScript
- Split frontend components into smaller, more independent pieces
- New, more meaningful features
