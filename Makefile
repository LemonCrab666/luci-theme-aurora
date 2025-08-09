#
# Copyright (C) 2024 Design Theme
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Design Theme (ucode)
LUCI_DEPENDS:=+luci-base
PKG_VERSION:=6.0.0
PKG_LICENSE:=Apache-2.0

define Package/luci-theme-design/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Design
	uci -q delete luci.themes.DesignDark 
	uci -q delete luci.themes.DesignLight
	uci commit luci
}
endef

include $(TOPDIR)/feeds/luci/luci.mk
# call BuildPackage - OpenWrt buildroot signature
