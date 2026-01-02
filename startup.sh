#!/bin/sh
if [ ! -f ".migrated" ]; then
  pnpx prisma migrate deploy
  touch .migrated
fi
pnpm start:prod