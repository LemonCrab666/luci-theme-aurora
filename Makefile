#
# Copyright (C) 2025 eamonxg <eamonxiong@gmail.com>
# Licensed under the Apache License, Version 2.0.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-theme-aurora
PKG_VERSION:=0.1.0
PKG_RELEASE:=20250825
PKG_LICENSE:=Apache-2.0

LUCI_TITLE:=Aurora Theme (ucode)
LUCI_DEPENDS:=+luci-base
PKGARCH:=all

LUCI_MINIFY_CSS:=
CONFIG_LUCI_CSSTIDY:=

define Package/luci-theme-aurora
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Themes
  TITLE:=Aurora LuCI Theme
  DEPENDS:=+luci-base
  PKGARCH:=all
endef

define Package/luci-theme-aurora/description
  Aurora theme for LuCI
endef

define Build/Compile
endef

define Package/luci-theme-aurora/install
  $(INSTALL_DIR) $(1)/usr/lib/luci/theme
  $(CP) ./files/htdocs $(1)/usr/lib/luci/theme/aurora
endef

define Package/luci-theme-aurora/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Aurora
	uci commit luci
}
endef

include $(TOPDIR)/feeds/luci/luci.mk

$(eval $(call BuildPackage,luci-theme-aurora))
