(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{196:function(e,s,t){"use strict";t.r(s);var r=t(3),a=Object(r.a)({},(function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"docker"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#docker"}},[e._v("#")]),e._v(" docker")]),e._v(" "),t("h2",{attrs:{id:"ubuntu-删除-docker"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ubuntu-删除-docker"}},[e._v("#")]),e._v(" Ubuntu 删除 docker")]),e._v(" "),t("div",{staticClass:"language-she line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("# 查询相关软件包\ndpkg -l | grep docker\n# 删除这个包\nsudo apt remove --purge dock.ec\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br")])]),t("h2",{attrs:{id:"docker-避免一直sudo"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#docker-避免一直sudo"}},[e._v("#")]),e._v(" docker 避免一直sudo")]),e._v(" "),t("p",[t("code",[e._v("sudo groupadd docker")]),e._v("创建 组")]),e._v(" "),t("p",[t("code",[e._v("sudo gpasswd -a ${USER} docker")]),e._v("将用户添加到该 组，例如xxx用户")]),e._v(" "),t("p",[t("code",[e._v("sudo systemctl restart docker")]),e._v("重启docker-daemon")])])}),[],!1,null,null,null);s.default=a.exports}}]);