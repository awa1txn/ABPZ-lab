Це [Next.js 13](https://nextjs.org/) проект сформований  [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Запуск проекта

Для початку встановіть LTS версію [Node.js](https://nodejs.org/uk) та використайте в папці проекту нижче описану команду:

```bash
npm install
```

Далі після вдалого встановлення пакетів потрібно запустити локальну базу даних.

Для цього використайте цю команду:

```bash
npm run start:db
```

Далі щоб успішно локально запустити проект, використайте цю команду в роздільному вікні СMD/BASH відносно запущеної бази даних:

```bash
npm run dev
```

Таким чином у вас повинно бути запущено декілька вікон. У одному з яких запущена база даних, а у іншому запущен клієнт.

Далі відкрийте браузер за цим посиланням [http://localhost:3000](http://localhost:3000) щоб побачити результат.

Якщо все виконано за інструкцією, то проект має вдало запуститись.

Ось і все.
