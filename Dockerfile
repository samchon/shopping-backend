FROM node:24-slim

RUN apt-get update \
    && apt-get install -y curl ca-certificates gnupg openssl gosu \
    && curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
       | gpg --dearmor -o /usr/share/keyrings/pgdg.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/pgdg.gpg] http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" \
       > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get install -y postgresql-18 \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

# Allow local connections without password
RUN printf "local all all trust\nhost all all 127.0.0.1/32 trust\nhost all all ::1/128 trust\n" \
    > /etc/postgresql/18/main/pg_hba.conf

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build:prisma && pnpm run build:main

EXPOSE 37001

RUN printf '#!/bin/bash\nset -e\n\
gosu postgres pg_ctlcluster 18 main start\n\
if [ ! -f /app/.db_initialized ]; then\n\
  node lib/executable/schema postgres root\n\
  touch /app/.db_initialized\n\
fi\n\
exec pnpm start\n' > /entrypoint.sh && chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
