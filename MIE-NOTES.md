# Dev

## Run in watch mode

make watch-frontend   # starts the Vite dev server
make watch-backend    # in another shell, rebuilds Go on change

## custom/conf/app.ini

[server]
START_SSH_SERVER = true
SSH_LISTEN_PORT = 2222   ; avoid needing root for :22
SSH_DOMAIN          = localhost

## The simplest recommended way to build from source is:

```
TAGS="bindata sqlite sqlite_unlock_notify" make build
```

## Build the dev image
docker build -t gitea-dev .

## Run with a bind-mounted volume for persistent data
docker run -d \
  --name gitea-dev \
  -p 3000:3000 \
  -p 2222:22 \
  -v ./gitea-dev-data:/data \
  gitea-dev

## Build gitea binary on host
make backend

## Run with your local binary overlaid
docker run -d \
  --name gitea-dev \
  -p 3000:3000 \
  -p 2222:22 \
  -v "$PWD/gitea-dev-data:/data" \
  -v "$PWD/gitea:/app/gitea/gitea" \
  gitea-dev

# Links

* https://github.com/go-gitea/gitea
* https://docs.gitea.com/development/hacking-on-gitea
* https://github.com/go-gitea/gitea/blob/main/CONTRIBUTING.md
* https://docs.gitea.com/contributing/guidelines-frontend
* https://deepwiki.com/go-gitea/gitea/3-web-and-api-routing-system
* https://docs.gitea.com/api/#tag/repository/operation/repoChangeFiles

# Files to hack

~/workspaces/mieweb/gitea/web_src/js/features/repo-editor.ts
~/workspaces/mieweb/gitea/templates/repo/editor/edit.tmpl
~/workspaces/mieweb/gitea/routers/web/repo/editor.go
~/workspaces/mieweb/gitea/routers/api/v1/repo/file.go

Grep for:

repo.editor.preview_changes

# Issues:

- performance of docs repo (LFS)
- handle renames
  - find and update other markdowns
  - cross-document updates?
- handle attachments
  - find . -type d -name '*.assets' -exec du -sb {} + | sort -nr | head -10
  - tempdir VS in-browser-store
  - 15MB
  - Videos?
- collaboration / git flow
- LSP
- Frontmatters / metadata
- Save
  - atomic commits with attachemnts
- Anything to port from WikiGDrive?
- Fulltext search
