# Настройка среды

Добавьте в корень проекта файл `.env`, приблизительно такой:
```
PORT=4000 // порт, на котором принимает запросы приложение
DATABASE_HOST="localhost"
DATABASE_PORT="54322"
DATABASE_USER="postgres"
DATABASE_PASSWORD="12345"
DATABASE_NAME="db"
```

# Запуск приложения

Запустите базу данных postgres при помощи команды: 
```
docker-compose up -d
```

При запуске контейнер postgres обнаружит и выполнит sql-скрипт из `init_db/init.sql`, 
инициализирующий таблицу `customers`.

Запустите приложение при помощи команды:
```
npm run start
```

# Взаимодействие с приложением

Выполните запрос, например:
```
curl -i -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{"first_name": "John", "last_name": "Doe", "date_of_birth": "2002-11-02"}' 'http://localhost:4000/v1/customer'
```

Ожидаемый ответ приложения:
```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 8
ETag: W/"8-M1u4Sc28uxk+zyXJvSTJaEkyIGw"
Date: Sat, 02 Nov 2024 21:24:42 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1}
```

При повторе запроса с теми же значениями в теле, ожидаемый результат:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 8
ETag: W/"8-M1u4Sc28uxk+zyXJvSTJaEkyIGw"
Date: Sat, 02 Nov 2024 21:24:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1}
```

Свойство `date_of_birth` в теле запроса обязано быть валидной датой без времени и не позже, чем дата сегодняшнего дня. 
Например, подходят такие значения:
```
2002-01-01
2002-01
2002
```

В противном случае, приложение ответит таким образом:
```
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 112
ETag: W/"70-lPCnpv1zcqmB7U4P4FOQGwjznVc"
Date: Sat, 02 Nov 2024 21:44:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":["date_of_birth must be a valid YYYY-MM-DD date only string"],"error":"Bad Request","statusCode":400}
```