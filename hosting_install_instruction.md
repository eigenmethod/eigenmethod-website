# Развертываение Eigen Method.

Инструкация по развертыванию сайта Eigen Method на linux сервере.

### Используемые технологии
 - Jekyll - генератор статического контента для сайта.
 - ОС - Linux vanl0046717.online-vm.com 3.13.0-24-generic #47-Ubuntu SMP Fri May 2 23:30:00 UTC 2014 x86_64 x86_64 x86_64 GNU/Linux
 - NGINX - веб сервер
 - openssl - для генерации ключей сертификатов при подключении через https

### Содержимое
Внутри папки eigenmethod вы обнаружите следующие компоненты:
  - eigenmethod_website - Jekyll проект
  - logs - место куда будут сбрасываться логи nginx (изначально отсутствует)
  - serts - место куда нужно сохранять все сгенерированные спомощью openssl ключи (изначально отсутствует)
  - .gitignore - игнорируемые git файлы и папки
  - hosting_install_instruction.md - инструкция по развертыванию
  - lib_requirements.txt - набор команд для установки необходимого ПО (если после установки ruby -v <2.0.0 то jekyll не сможет корректно установиться и требуется установки из исходников, смотри пункт "Установка Ruby из исходников")

### Установка Ruby из исходников
После выполнения команды 
```sh
sudo apt-get install ruby ruby-dev make gcc nodejs
```
выполните 
```sh
ruby -v
```
Для корректной установки jekyll, версия должна быть не ниже 2.1.5
Для ручной установки из исходных файлов делаем следующее
```sh
sudo apt-get install -y libssl-dev libreadline-dev zlib1g-dev
sudo apt-get remove ruby
cd

git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.1.5
rbenv global 2.1.5

ruby -v
```
вернуться должно
```sh
ruby 2.1.5p273 (2014-11-13 revision 48405) [x86_64-linux]
```

### Развертывание на сервере
Заходим по ssh на сервер. Скачиваем проект в home директорию. Создаем logs и serts
```sh
cd
git clone git@bitbucket.org:saprunteam/eigenmethod_website.git
cd ./eigenmethod-website
mkdir logs
mkdir serts
```
Устанавливаем Jekyll и необходимые плагины через Bundler
```sh
gem install jekyll --no-rdoc --no-ri
gem install bundler
bundle init
echo 'gem "jekyll"' >> Gemfile
echo 'gem "jekyll-paginate"' >> Gemfile
bundle install
```
Создаем ssl сертификаты
```sh
cd ~/eigenmethod-website/serts
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key
openssl x509 -req -in server.csr -signkey server.key -out server.crt
```
Настраиваем Jekyll. Изменяем _config.yml
```sh
cd ~/eigenmethod-website/eigenmethod_website/
vim _config.yml
```
Заменяем значение url: "http://localhost:4000" на url: "http://eigenmethod.com" и создаем статику в _site
```sh
bundle exec jekyll build
```
Удаляем дефолтные настройки nginx.
```sh
sudo rm /etc/nginx/sites-enabled/default
```
Создаем наши настройки.
```sh
sudo vim /etc/nginx/sites-available/eigenmethod.com
```
Содержимое должно быть таким
```sh
# слушает 80й порт и возвращает содержимое из root
server {
  listen      80;
  server_name eigenmethod.com;
  access_log  /home/em/eigenmethod-website/logs/access.log;
  error_log   /home/em/eigenmethod-website/logs/error.log;
  index       index.html;

  location / {
    root /home/em/eigenmethod-website/eigenmethod_website/_site;
  }
}

# перенаправляет с домена www.eigenmethod.com на домен eigenmethod.com
server {
  listen      80;
  server_name www.eigenmethod.com;
  return      301 http://eigenmethod.com$request_uri;
}

# перенаправляет с https на http
server {
  listen        443;
  ssl           on;
  server_name   eigenmethod.com;
  return        301 http://eigenmethod.com$request_uri;

  ssl_certificate      /home/em/eigenmethod-website/serts/server.crt;
  ssl_certificate_key  /home/em/eigenmethod-website/serts/server.key;
}

# перенаправляет с https на http и с домена www.eigenmethod.com на домен eigenmethod.com
server {
  listen        443;
  ssl           on;
  server_name   www.eigenmethod.com;
  return        301 http://eigenmethod.com$request_uri;

  ssl_certificate      /home/em/eigenmethod-website/serts/server.crt;
  ssl_certificate_key  /home/em/eigenmethod-website/serts/server.key;
}
```
Активируем настройки симлинком
```sh
sudo ln -s /etc/nginx/sites-available/eigenmethod.com /etc/nginx/sites-enabled/
```
Обновляем настройки
```sh
sudo /etc/init.d/nginx stop
sudo /etc/init.d/nginx reload
sudo /etc/init.d/nginx start
```
Смотрим статус nginx
```sh
sudo /etc/init.d/nginx status
```
если вернулось
```sh
* nginx is running
```
значит все хорошо. Иначе смотрим логи
```sh
sudo vim /var/log/nginx/error.log
```
