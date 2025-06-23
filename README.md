## RCLinux
<p align="center">
  <a href="https://github.com/dvytvs/Ruscord-linux-version/blob/main/assets/logo.png">
    <img src="https://github.com/dvytvs/Ruscord-linux-version/blob/main/assets/logo.png" alt="logo.png" />
  </a>
</p>
<p align="center">
  <a href="https://github.com/dvytvs/Ruscord-linux-version/actions/workflows/node.js.yml">
    <img src="https://github.com/dvytvs/Ruscord-linux-version/actions/workflows/node.js.yml/badge.svg" alt="Build Status" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/dvytvs/Ruscord-linux-version/commits/main">
  <img src="https://img.shields.io/github/last-commit/dvytvs/Ruscord-linux-version/main" alt="Последний коммит" />
</a>
  &nbsp;&nbsp;
  <a href="https://github.com/dvytvs/Ruscord-linux-version/issues">
    <img src="https://img.shields.io/github/issues/dvytvs/Ruscord-linux-version.svg" alt="GitHub issues" />
  </a>
</p>

XZY123lol и dvytvs сделали для вас отдельный клиент Ruscord только для Linux!

Чтобы скачать билд зайдите в ```Releases``` и оттуда выберите ваш пакет который предназначен для дистрибутива если его нет напишите нам в ```issues```

## Оглавление

- [Начало](https://github.com/dvytvs/Ruscord-linux-version/edit/main/README.md#rclinux)
- [Как установить](https://github.com/dvytvs/Ruscord-linux-version/blob/main/.github/howdownload.md)
- [english README](https://github.com/dvytvs/Ruscord-linux-version/blob/main/.github/README.en.md)
- [Оглавление](https://github.com/dvytvs/Ruscord-linux-version/edit/main/README.md#%D0%BE%D0%B3%D0%BB%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5)
- [Начало работы с проектом](https://github.com/dvytvs/Ruscord-linux-version/edit/main/README.md#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)
- [Примечание](https://github.com/dvytvs/Ruscord-linux-version/edit/main/README.md#%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%87%D0%B0%D0%BD%D0%B8%D0%B5)

## Использование
Если хотите форкнуть и переделать клиент то пожалуйста мы не против этого мы также оставили инструкцию ниже будем рады какие фишки вы добавили в него! (Только перед тем как выложить соблюдайте лицензию GNU AGPLv3 также используйте его)

```
git clone https://github.com/dvytvs/Ruscord-linux-version.git

cd Ruscord-linux-version

npm install

npm install electron electron-builder electron-store electron-updater electron-log electron-in-dev --save-dev
```
Ну и все! Переделывайте скрипт в ```main.js``` и конфиг ```package.json```, после как закончите напишите ```npm run dist``` и ждите, как только закончится зайдите в папку ```dist``` и оттуда вытащите билды.


## Примечание
![AGPLv3.png](https://github.com/dvytvs/Ruscord-linux-version/blob/main/.github/images/AGPLv3.png)

Эта программа является свободным программным обеспечением: вы можете распространять и/или изменять его в соответствии с условиями лицензии [GNU Affero General Public License версии 3.0](https://github.com/dvytvs/Ruscord-linux-version/blob/main/LICENSE) или поздней версии, опубликованной Фондом свободного программного обеспечения.

Ruscord linux version не управляется организацией "Ruscord".
