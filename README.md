# ArticlesApp — Setup Guide (Laravel API + React Frontend)

A complete guide to install, run, and develop this project on your machine (Windows-friendly).

---

## Overview

- **Backend**: Laravel API (PHP) — Articles + Familles (CSV export, CRUD)
- **Frontend**: React (Vite) + TailwindCSS
- **DB**: MySQL (via Docker recommended)

---

## Prerequisites

- **Git**
- **PHP 8.2+** and **Composer**
- **Node.js 18+** and **npm**
- **Docker** (optional but recommended for MySQL)
- **cURL** (for quick API tests)

> If you use Windows + PowerShell, the commands below will work as-is (adjust paths if needed).

---

## Project Structure (simplified)

```
ciweb_tst/
├─ app/…
├─ routes/
│  ├─ api.php
│  └─ web.php
├─ config/cors.php
├─ database/
│  ├─ migrations/…
│  └─ seeders/
│     ├─ FamilleSeeder.php
│     └─ ArticleSeeder.php
├─ public/
└─ frontend-ui/              # React app
   ├─ src/
   │  ├─ api.js
   │  ├─ assets/docs/Test_Technique_Laravel.pdf
   │  ├─ components/
   │  │  ├─ article/{ArticleTable.jsx, ArticleDialog.jsx}
   │  │  └─ layout/{Navbar.jsx, Layout.jsx}
   │  ├─ pages/{Home.jsx, Articles.jsx}
   │  ├─ utils/format.js
   │  ├─ App.jsx, main.jsx, index.css
   ├─ vite.config.js
   └─ .env
```

---

## Database (MySQL via Docker)

Create a `docker-compose.yml` at the project root if you don’t have MySQL already:

```yaml
version: "3.9"
services:
  db:
    image: mysql:8.0
    container_name: ciweb_mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ciweb
      MYSQL_USER: ciweb
      MYSQL_PASSWORD: ciweb
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password
  phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    container_name: ciweb_pma
    restart: unless-stopped
    environment:
      PMA_HOST: db
      PMA_USER: root
      PMA_PASSWORD: root
    ports:
      - "8081:80"
volumes:
  dbdata: {}
```

Run:
```bash
docker compose up -d
```

---

## Backend — Laravel

### 1) Install deps
```bash
composer install
cp .env.example .env
php artisan key:generate
```

### 2) Configure `.env`
```env
APP_NAME=ArticlesApp
APP_ENV=local
APP_KEY=base64:… # set by key:generate
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ciweb
DB_USERNAME=ciweb
DB_PASSWORD=ciweb

# CORS (front)
FRONTEND_URL=http://localhost:5173
```

### 3) Migrate + Seed
```bash
php artisan migrate
# Option A: seed families and articles separately (if you have these seeders)
php artisan db:seed --class=FamilleSeeder
php artisan db:seed --class=ArticleSeeder
# Option B: or run DatabaseSeeder that calls both
php artisan db:seed
```

### 4) Serve (dev)
```bash
php artisan serve
# http://127.0.0.1:8000
```

### 5) CORS config (important)
`config/cors.php` (allow your Vite dev URL):
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173','http://127.0.0.1:5173'],
'allowed_headers' => ['*'],
'supports_credentials' => false,
```
Then clear config cache:
```bash
php artisan config:clear
```

---

## API Endpoints

### Articles
- `GET    /api/articles` — list (with famille relationship)
- `POST   /api/articles` — create
- `PUT    /api/articles/{id}` — update
- `DELETE /api/articles/{id}` — delete
- `GET    /api/articles/export` — export CSV (TTC + marge computed)

### Familles
- `GET    /api/familles` — list
- `GET    /api/familles/{id}` — show (optional)

> Make sure `RouteServiceProvider` loads `routes/api.php` with prefix `api`.  
> Quick check:
> ```bash
> php artisan route:list
> ```

#### cURL examples
```bash
# Ping (if you added it)
curl http://127.0.0.1:8000/api/ping

# Create article
curl -X POST http://127.0.0.1:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"nom":"Clavier Pro","prix_ht":7500,"prix_achat":6400,"taux_tgc":11,"famille_id":1}'

# Update article
curl -X PUT http://127.0.0.1:8000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"nom":"Clavier Pro 2","prix_ht":7900,"prix_achat":6400,"taux_tgc":11,"famille_id":1}'

# Delete article
curl -X DELETE http://127.0.0.1:8000/api/articles/1

# List familles
curl http://127.0.0.1:8000/api/familles
```

---

## 🖥️ Frontend — React + Vite + Tailwind

Go to the frontend folder:
```bash
cd frontend-ui
npm install
```

### Option A — Tailwind v4 (recommended)

1) Install Tailwind & Vite plugin
```bash
npm i -D tailwindcss @tailwindcss/vite
```

2) `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwind()],
})
```

3) Global CSS `src/index.css`
```css
@import "tailwindcss";

html, body, #root { height: 100%; }
```

> Ensure you import it once in `src/main.jsx`: `import './index.css'`

### Option B — Tailwind v3 (classic)

```bash
npm i -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
```

### Env for the front
Create `frontend-ui/.env`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### Run the Dev servers
```bash
# backend (in another terminal)
php artisan serve

# frontend
npm run dev
# http://localhost:5173
```

---

## Frontend Notes

- **Navbar**: `components/layout/Navbar.jsx` — brand links to `/`
- **Pages**:
    - `Home.jsx` — links to Articles + open/download PDF enoncé
    - `Articles.jsx` — search, CSV export, table + dialog create/edit
- **Articles**:
    - `ArticleTable.jsx` — pretty table, margins, icons via `lucide-react`
    - `ArticleDialog.jsx` — form with select Famille (via `/api/familles`)
- **Assets**:
    - Import PDF as URL: `import enoncePdf from "../assets/docs/Test_Technique_Laravel.pdf"` then use `<a href={enoncePdf} ...>`

Install icons:
```bash
npm i lucide-react
```

---

## Troubleshooting

- **404 on /api/**  
  Check `routes/api.php`, `RouteServiceProvider` prefixes `api`, restart `php artisan serve` and run `php artisan route:list`.

- **CORS errors from frontend**  
  Fix `config/cors.php` (origins `http://localhost:5173` & `http://127.0.0.1:5173`) then `php artisan config:clear`.

- **Tailwind classes not applying**
    - v4: ensure `@tailwindcss/vite` in `vite.config.js` and `@import "tailwindcss";` in `index.css`.
    - v3: ensure `content: [...]` is correct and CSS is imported once in `main.jsx`.
    - Restart `npm run dev` after config changes.

- **@tailwindcss/vite not found**  
  Run `npm i -D @tailwindcss/vite tailwindcss`. Remove plugin import if you stick to Tailwind v3.

- **Seeding fails: model::factory() undefined**  
  Ensure `use HasFactory;` in the model and a corresponding `database/factories/ModelFactory.php` exists.

---

## Git Flow (example)

```bash
git checkout -b frontend-integration
git add .
git commit -m "feat(frontend): intégration initiale du front React + ajout endpoint familles"
git push -u origin frontend-integration
```

---

## License
Internal test project for learning/evaluation.
