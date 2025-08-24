LuCI Theme Aurora

[简体中文](README.md) | English

Overview

luci-theme-aurora is an OpenWrt theme designed specifically for modern browsers.
The theme is inspired by Aurora — in Norway, the daytime reveals pure, pristine snow-capped mountains, while at night the sky comes alive with dancing auroras.
In this theme, the light mode reflects the purity of snow-capped peaks, and the dark mode showcases the enchanting beauty of the aurora.

Compatibility

OpenWrt: Since the theme uses ucode templates, OpenWrt 22.03 or later is required.

Browsers: Built with TailwindCSS v4, the theme works best on modern browsers:

Chrome 111 (released March 2023)

Safari 16.4 (released March 2023)

Firefox 128 (released July 2024)

Preview
Desktop Mode

![light](./.dev/preview/light.png)
 ![dark](./.dev/preview/dark.png)

Mobile Mode

![mobile](./.dev/preview/mobile.png)

Development

As of 2025, most OpenWrt theme development still relies on outdated workflows, while modern front-end toolchains are already highly advanced.
This is why I chose to build the theme with Vite + TailwindCSS. With Vite, I can enjoy a modern development experience and instantly preview changes — no more manually replacing CSS files on the router.