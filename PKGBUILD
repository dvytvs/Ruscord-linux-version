# Maintainer: dvytvs <zapretsystem445@proton.me>
pkgname=ruscord
pkgver=1.0.0
pkgrel=1
pkgdesc="Общайся и играй с друзьями в Ruscord"
arch=('x86_64')
url="https://github.com/dvytvs/Ruscord-linux-version"
license=('AGPL3')
depends=('electron' 'libxss' 'libxtst' 'nss' 'alsa-lib' 'gtk3')
makedepends=('git' 'npm' 'nodejs')
provides=('ruscord')
conflicts=('ruscord')
source=("git+$url.git")
md5sums=('SKIP')

build() {
  cd "$srcdir/Ruscord-linux-version"

  # Установка пакетов
  npm install

  # Сборка
  npm run build || true
}

package() {
  cd "$srcdir/Ruscord-linux-version"

  # Установка ruscord
  install -d "$pkgdir/usr/lib/ruscord"
  cp -r . "$pkgdir/usr/lib/ruscord"

  # Иконки
  install -Dm644 resources/icon.png "$pkgdir/usr/share/icons/hicolor/256x256/apps/ruscord.png"
  install -Dm644 resources/icon.png "$pkgdir/usr/share/icons/hicolor/16x16/apps/ruscord.png"

  # .desktop файл
  install -Dm644 resources/ruscord.desktop "$pkgdir/usr/share/applications/ruscord.desktop"

  # запуск файла
  install -Dm755 /dev/stdin "$pkgdir/usr/bin/ruscord" << 'EOF'
#!/bin/bash
exec electron /usr/lib/ruscord "$@"
EOF
}
