# Добавление постов в блог Eigen Method.

Инструкция по добавлению постов в блог сайта Eigen Method.

### Последовательность действий
##### 1) Клонируем репозиторий (пропустить если уже склонировали)
```sh
git clone https://github.com/eigenmethod/eigenmethod-website.git
```
##### 2) Переходим в склонированную папку
```sh
cd ./eigenmethod-website/eigenmethod_website/_posts
```
##### 3) Создаем файл с постом
Имя файла должно иметь следующий формат:
**год**-**месяц**-**день-имя-поста-тире-это-пробел**.md
Например:
`2016-02-17-test-post.md` превратится в test post
##### 4) Заполняем содержимое
Чтобы научиться добавлять картинки, форматировать красиво текст и тд. лучше ознакомиться с этим проектом https://github.com/mchelen/michaelchelen.net.git
Самое важное это правильно заполнить заголовок поста, вот простой пример содержимого поста:
```sh
---
layout: post
title: test post
created_at: 2016-02-17
description: test post N1.
---

# Post 1

Hello world!
```
Текст внутри ```---``` это и есть заголовок
 - layout всегда post
 - title это то, как пост будет выглядеть в в списке постов на странице блога
 - created_at должен совпадать с датой указанной в имени
 - description это описание и там может быть все что угодно
##### 4) Загружаем посты на сервер
Создаем коммит
```sh
git status
git add 'имя_добавляемого_файла'
git commit -m 'парочка офигительных постов'
git pull origin master
git push origin master
```
Прописываем логин, пароль, ожидаем загрузки.
##### 5) Обновляем содержимое сервера
Подключаемся к серверу
```sh
ssh em@31.131.21.120
```
Загружаем изменения
```sh
cd ~/eigenmethod-website
git pull origin master
```
Пересобираем статику
```sh
cd ~/eigenmethod-website/eigenmethod_website
bundle exec jekyll build
```
##### 6) Проверяем что изменения появились на сайте
Переходим по ссылке http://eigenmethod.com/blog/

