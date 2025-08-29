#
# Copyright (C) 2025 eamonxg <eamonxiong@gmail.com>
# Licensed under the Apache License, Version 2.0.
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Aurora Theme (ucode template)
LUCI_DEPENDS:=+luci-base

PKG_VERSION:=0.1.2_alpha
PKG_RELEASE:=20250829
PKG_LICENSE:=Apache-2.0

LUCI_MINIFY_CSS:=
CONFIG_LUCI_CSSTIDY:=

define Package/luci-theme-aurora/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Aurora
	uci commit luci
}
endef

include $(TOPDIR)/feeds/luci/luci.mk
# call BuildPackage - OpenWrt buildroot signature
