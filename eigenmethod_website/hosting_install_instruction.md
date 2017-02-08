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
  - certs - место куда нужно сохранять все сгенерированные спомощью openssl ключи (изначально отсутствует)
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
Заходим по ssh на сервер. Скачиваем проект в home директорию. Создаем logs и certs
```sh
cd
git clone git@bitbucket.org:saprunteam/eigenmethod_website.git
cd ./eigenmethod-website
mkdir logs
mkdir certs
```
Устанавливаем Jekyll и необходимые плагины через Bundler
```sh
gem install jekyll --no-rdoc --no-ri
gem install bundler
bundle init
echo 'gem "jekyll", "3.1.2"' >> Gemfile
echo 'gem "jekyll-paginate", "1.1.0"' >> Gemfile
echo 'gem "jekyll-multiple-languages", "2.0.3"' >> Gemfile
bundle install
```
Создаем ssl сертификаты
```sh
cd ~/eigenmethod-website/certs
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key
openssl x509 -req -in server.csr -signkey server.key -out server.crt
```
Настраиваем Jekyll. Изменяем _config.yml
Заменяем значение url: "http://localhost:4000" на url: "http://eigenmethod.com" и создаем статику в _site
(необязательный пункт если не ланируется делать proxy_pass на jekyll serve)
```sh
cd ~/eigenmethod-website/eigenmethod_website/
vim _config.yml
```
Собираем статику для каждого из языков (английский, русский, возможно в будущем появятся другие)
```sh
cd ~/eigenmethod-website/eigenmethod_website
vim ./_config.yml
:31
i
languages: ['en', 'ru']
<esc>
:wq
bundle exec jekyll build --destination _site_en/

vim ./_config.yml
:31
i
languages: ['ru', 'en']
<esc>
:wq
bundle exec jekyll build --destination _site_ru/
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
server {
  listen               80;
  server_name          eigenmethod.com;
  access_log           /home/em/eigenmethod-website/logs/access.log;
  error_log            /home/em/eigenmethod-website/logs/error.log;
  index                index.html;

  location / {
    root               /home/em/eigenmethod-website/eigenmethod_website/_site_en;
  }

  error_page           404 /404.html;
  location = /404.html {
    root               /home/em/eigenmethod-website/eigenmethod_website/_site_en;
    internal;
  }

  error_page           500 501 502 503 504 /50x.html;
  location = /50x.html {
    root               /home/em/eigenmethod-website/eigenmethod_website/_site_en;
    internal;
  }
}

server {
  listen               80;
  server_name          www.eigenmethod.com;
  return               301 http://eigenmethod.com$request_uri;
}

server {
  listen               443;
  ssl                  on;
  server_name          eigenmethod.com;
  return               301 http://eigenmethod.com$request_uri;

  ssl_certificate      /home/em/eigenmethod-website/certs/server.crt;
  ssl_certificate_key  /home/em/eigenmethod-website/certs/server.key;
}

server {
  listen               443;
  ssl                  on;
  server_name          www.eigenmethod.com;
  return               301 http://eigenmethod.com$request_uri;

  ssl_certificate      /home/em/eigenmethod-website/certs/server.crt;
  ssl_certificate_key  /home/em/eigenmethod-website/certs/server.key;
}

server {
  listen               80;
  server_name          eigenmethod.ru;
  access_log           /home/em/eigenmethod-website/logs/access.log;
  error_log            /home/em/eigenmethod-website/logs/error.log;
  index                index.html;

  location / {
    root               /home/em/eigenmethod-website/eigenmethod_website/_site_ru;
  }

  error_page           404 /404.html;
  location = /404.html {
    root               /home/em/eigenmethod-website/eigenmethod_website/_site_ru;
    internal;
  }

  error_page           500 501 502 503 504 /50x.html;
  location = /50x.html {
    root               /home/em/eigenmethod-website/eigenmethod_website/_site_ru;
    internal;
  }
}

server {
  listen               80;
  server_name          www.eigenmethod.ru;
  return               301 http://eigenmethod.ru$request_uri;
}

server {
  listen               443;
  ssl                  on;
  server_name          eigenmethod.ru;
  return               301 http://eigenmethod.ru$request_uri;

  ssl_certificate      /home/em/eigenmethod-website/certs/server.crt;
  ssl_certificate_key  /home/em/eigenmethod-website/certs/server.key;
}

server {
  listen               443;
  ssl                  on;
  server_name          www.eigenmethod.ru;
  return               301 http://eigenmethod.ru$request_uri;

  ssl_certificate      /home/em/eigenmethod-website/certs/server.crt;
  ssl_certificate_key  /home/em/eigenmethod-website/certs/server.key;
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

### Разделение постов по языкам
Для того чтобы отображались только посты соответствующие языку сайта делаем следующее
Открываем файл из стандартного плагина пеиджинации jekyll
```
# если bundler установлен от судо
sudo vim /var/lib/gems/2.1.0/gems/jekyll-paginate-1.1.0/lib/jekyll-paginate/pagination.rb
# если bundler установлен без судо
vim /home/$USER/.rbenv/versions/2.1.5/lib/ruby/gems/2.1.0/gems/jekyll-paginate-1.1.0/lib/jekyll-paginate/pagination.rb
```
Добавляем в 43-ю строку
```
all_posts = all_posts.reject { |p| p['language'] != site.config['languages'][0] }
all_posts = all_posts.reject { |p| p['layout'] != 'post' }
```
Теперь paginator.posts будет содержать только посты соответствующие выбранному языку и только те у которых layout: post
