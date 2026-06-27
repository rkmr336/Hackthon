# PulseDesk

## Run Steps
1. `cd backend`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `php artisan migrate --seed`
6. `php artisan serve`
7. In another terminal, `cd frontend`
8. `npm install`
9. `npm run dev`

## Models Used
- Orchestrator (Hermes): `deepseek/deepseek-v4-pro` (via EastRouter)
- Coder (OpenClaw): `z-ai/glm-5.1` (via EastRouter)
