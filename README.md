## Ruscord клиент на Linux

XZY123lol и dvytvs сделали для вас отдельный клиент Ruscord только для Linux!

Чтобы скачать билд зайдите в ```Releases``` и оттуда выберите ваш пакет который предназначен для дистрибутива если его нет напишите нам в ```issues```

## Начало работы с проектом
Если хотите форкнуть и переделать клиент то пожалуйста мы не против этого мы также оставили инструкцию ниже будем рады какие фишки вы добавили в него! (Только перед тем как выложить соблюдайте лицензию GNU AGPLv3 также используйте его)

```
git clone https://github.com/dvytvs/Ruscord-linux-version.git

cd Ruscord-linux-version

npm install

npm install electron electron-builder electron-store electron-updater
```
Ну и все! Переделывайте скрипт в ```main.js``` и конфиг ```package.json```, после как закончите напишите ```npm run dist``` и ждите, как только закончится зайдите в папку ```dist``` и оттуда вытащите билды.

Ruscord linux version не управляется организацией "Ruscord" и не одобрен ею.