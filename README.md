1. Установить зависимости

В корне проекта выполнить:

npm install

2. Создать .env

В корне проекта создать файл:

.env

Добавить:

NEXT_PUBLIC_GREEN_API_INSTANCE_ID=ВАШ_INSTANCE_ID
NEXT_PUBLIC_GREEN_API_TOKEN=ВАШ_TOKEN

В профиле в инстансе добавить получать сообщения, так как я не выставлял setSettings 
https://green-api.com/v3/docs/api/receiving/technology-http-api/#cabinet

3. Запустить проект

Для запуска в режиме разработки:

npm run dev

После запуска открыть в браузере:

http://localhost:3000

4. Production

Создать production-сборку:

npm run build

Запустить:

npm run start