## RCLinux
<p align="center">
  <img src="https://github.com/dvytvs/Ruscord-linux-version/blob/main/.github/images/logo.jpg" alt="logo" width="300"/>
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

## 🐧 Ruscord — Новый уровень цифрового общения для Linux




Добро пожаловать в Ruscord — инновационную Linux-платформу, вдохновлённую идеями Discord, но переосмысленную для свободного и продвинутого сообщества. Здесь аукционы никнеймов, цифровая идентичность и мощное взаимодействие пользователей объединяются в единую экосистему.
------------------------------------------------------------------------------------------

## 🚀 Что такое Ruscord?





Ruscord — это полностью нативное Linux-приложение, разработанное с нуля на современных open-source технологиях (GTK/Qt + Rust/Python), с особым акцентом на приватность, цифровое владение и свободу кастомизации.





В Ruscord каждый никнейм — это уникальный цифровой актив, который можно выставлять на аукционы, обменивать и защищать. Общение выходит за рамки обычных мессенджеров — это социальная платформа нового поколения.



## 🎯 Ключевые особенности:

  🧩 Локальная работа и децентрализация — данные остаются у тебя, никаких серверов Big Tech;

  💰 Аукционы никнеймов — владей уникальным именем, участвуй в торгах и развивай цифровой бренд;

  🔒 Приватные и публичные комнаты — создавай безопасные пространства для общения и коллаборации;

 🎮 Геймификация — прокачивай профиль, выполняй задания и открывай награды;

 🧠 Открытый исходный код — ты можешь сам изменить Ruscord под свои нужды;

 💡 Сообщество-центричность — Ruscord создаётся пользователями и для пользователей.
------------------------------------------------------------------------------------







## 🔧 Разработано для:


  
GNU/Linux (x86_64, ARM)

  
Wayland и X11

  
Дистрибутивов: Arch, Fedora, Ubuntu, Debian и др.



## Использование
Если хотите форкнуть и переработать клиент — пожалуйста, мы не против этого. Мы также оставили инструкцию ниже, будем рады услышать, какие фишки вы туда добавите!

Важно: Перед публикацией своего форка обязательно соблюдайте условия лицензии GNU AGPLv3.

```
git clone https://github.com/dvytvs/Ruscord-linux-version.git

cd Ruscord-linux-version

npm install

npm install electron electron-builder electron-store electron-updater electron-log electron-in-dev --save-dev
```
Ну и все! Переделывайте скрипт в ```main.js``` и конфиг ```package.json```, после как закончите напишите ```npm run dist``` и ждите, как только закончится зайдите в папку ```dist``` и оттуда вытащите билды.


## Примечание
![AGPLv3.png](https://github.com/dvytvs/Ruscord-linux-version/blob/main/.github/images/AGPLv3.png)

Эта программа является свободным программным обеспечением: вы можете распространять или изменять его в соответствии с условиями лицензии [GNU Affero General Public License версии 3.0](https://github.com/dvytvs/Ruscord-linux-version/blob/main/LICENSE) или поздней версии, опубликованной Фондом свободного программного обеспечения (Open source).

Ruscord linux version не управляется организацией [Ruscord](https://www.russcord.ru)
