## Ruscord клиент на Linux (RCLinux)
<p align="center">
  <a href="https://postimg.cc/7GFxM3mz">
    <img src="https://i.postimg.cc/8c5jGwvZ/logo.png" alt="logo.png" />
  </a>
</p>

XZY123lol и dvytvs сделали для вас отдельный клиент Ruscord только для Linux!

Чтобы скачать билд зайдите в ```Releases``` и оттуда выберите ваш пакет который предназначен для дистрибутива если его нет напишите нам в ```issues```

## На случай проблемы с GTK
Мы зафиксировали что обычно у некоторых может не включиться Ruscord так как программа одновременно включает ```GTK2/3``` и ```GTK4``` Мы пытаемся сейчас разобраться

## Начало работы с проектом
Если хотите форкнуть и переделать клиент то пожалуйста мы не против этого мы также оставили инструкцию ниже будем рады какие фишки вы добавили в него! (Только перед тем как выложить соблюдайте лицензию GNU AGPLv3 также используйте его)

```
git clone https://github.com/dvytvs/Ruscord-linux-version.git

cd Ruscord-linux-version

npm install

npm install electron electron-builder electron-store electron-updater
```
Ну и все! Переделывайте скрипт в ```main.js``` и конфиг ```package.json```, после как закончите напишите ```npm run dist``` и ждите, как только закончится зайдите в папку ```dist``` и оттуда вытащите билды.


## Примечание
[![1000232063.png](https://i.postimg.cc/T1LfQsgv/1000232063.png)](https://postimg.cc/q6TPvj11)

Эта программа является свободным программным обеспечением: вы можете распространять и/или изменять его в соответствии с условиями лицензии [GNU Affero General Public License версии 3.0](https://github.com/dvytvs/Ruscord-linux-version/blob/main/LICENSE) или поздней версии, опубликованной Фондом свободного программного обеспечения.

Ruscord linux version не управляется организацией "Ruscord".
