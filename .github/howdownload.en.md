# How to Install Ruscord

## Please read before starting

> \[!WARNING]
> We have detected that Ruscord might not start due to GTK issues,
> as it tries to run different versions of `GTK2/3 and GTK4` simultaneously.
> In this case, it is recommended to follow the Tip section.

> \[!CAUTION]
> Ruscord might not open properly, so check the logs by opening a terminal and typing
> `/opt/Ruscord/ruscord` or `ruscord`.
> If you see no errors, Ruscord may just be slow to start — please wait a bit.
> If you do see errors, report them to [Github issues](https://github.com/dvytvs/Ruscord-linux-version/issues).

> \[!TIP]
> If you encounter compatibility errors (including GTK-related ones),
> it is recommended to download the `.AppImage` file.
> It will take up more space since it includes libraries even if they are already installed on your system.

### Installation

[🔖Go to the releases page and download the latest version of your package (usually at the top)](https://github.com/dvytvs/Ruscord-linux-version/releases)

#### Debian/Ubuntu (.deb)

After downloading, open a terminal and run (skip these steps until you see your package manager):

```bash
sudo dpkg -i /home/your_username/downloads/Ruscord-1.2.9-linux-x64.deb
sudo apt-get install -f    # to install any missing dependencies
```

---

#### Fedora/openSUSE (.rpm)

```bash
sudo rpm -i /home/your_username/downloads/Ruscord-1.2.9-linux-x64.rpm
```

or if you have `dnf`:

```bash
sudo dnf install /home/your_username/downloads/Ruscord-1.2.9-linux-x64.rpm
```

---

#### Arch Linux (.pacman)

```bash
sudo pacman -U /home/your_username/downloads/Ruscord-1.2.9-linux-x64.pacman
```

---

#### AppImage

1. Make the file executable:

```bash
chmod +x /home/your_username/downloads/Ruscord-1.2.9-linux-x64.AppImage
```

2. Run it:

```bash
./Ruscord-1.2.9-linux-x64.AppImage
```

---

### tar.xz

```bash
wget (insert the link from the latest release)
sudo mkdir -p /opt/ruscord
sudo tar -xf Ruscord-1.2.9-linux-x64.tar.xz -C /opt/ruscord --strip-components=1
sudo ln -s /opt/ruscord/Ruscord /usr/local/bin/ruscord
```

> \[!TIP]
> If you have no idea how to install from tar.xz,
> don’t stress yourself —
> just use the .AppImage
> (tested ✅)

---

### Launch

After installation, **Ruscord** will appear in your app menu. Just launch it from there.
If you installed the `.AppImage`, run it from the terminal or double-click the file.
