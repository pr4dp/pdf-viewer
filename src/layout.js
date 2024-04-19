import { useState, useEffect, useRef, Fragment, useMemo, useContext, createElement } from "react";
import * as main from "./main";
import * as attachment from "./pdf/components/attachments";
import * as bookmark from "./pdf/components/bookmark";
import * as thumbnail from "./pdf/components/thumbnail";
import * as toolbar from "./pdf/components/toolbar";

var BookmarkIcon = function () {
  return createElement(
    main.Icon,
    { size: 16 },
    createElement("path", {
      d: "M11.5,1.5h11c0.552,0,1,0.448,1,1v20c0,0.552-0.448,1-1,1h-21c-0.552,0-1-0.448-1-1v-20c0-0.552,0.448-1,1-1h3\n            M11.5,10.5c0,0.55-0.3,0.661-0.659,0.248L8,7.5l-2.844,3.246c-0.363,0.414-0.659,0.3-0.659-0.247v-9c0-0.552,0.448-1,1-1h5\n            c0.552,0,1,0.448,1,1L11.5,10.5z\n            M14.5,6.499h6\n            M14.5,10.499h6\n            M3.5,14.499h17\n            M3.5,18.499h16.497",
    })
  );
};

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

var FileIcon = function () {
  return createElement(
    main.Icon,
    { size: 16 },
    createElement("path", {
      d: "M7.618,15.345l8.666-8.666c0.78-0.812,2.071-0.838,2.883-0.058s0.838,2.071,0.058,2.883\n            c-0.019,0.02-0.038,0.039-0.058,0.058L7.461,21.305c-1.593,1.593-4.175,1.592-5.767,0s-1.592-4.175,0-5.767c0,0,0,0,0,0\n            L13.928,3.305c2.189-2.19,5.739-2.19,7.929-0.001s2.19,5.739,0,7.929l0,0L13.192,19.9",
    })
  );
};

var ThumbnailIcon = function () {
  return createElement(
    main.Icon,
    { size: 16 },
    createElement("path", {
      d: "M10.5,9.5c0,0.552-0.448,1-1,1h-8c-0.552,0-1-0.448-1-1v-8c0-0.552,0.448-1,1-1h8c0.552,0,1,0.448,1,1V9.5z\n            M23.5,9.5c0,0.552-0.448,1-1,1h-8c-0.552,0-1-0.448-1-1v-8c0-0.552,0.448-1,1-1h8c0.552,0,1,0.448,1,1V9.5z\n            M10.5,22.5 c0,0.552-0.448,1-1,1h-8c-0.552,0-1-0.448-1-1v-8c0-0.552,0.448-1,1-1h8c0.552,0,1,0.448,1,1V22.5z\n            M23.5,22.5c0,0.552-0.448,1-1,1 h-8c-0.552,0-1-0.448-1-1v-8c0-0.552,0.448-1,1-1h8c0.552,0,1,0.448,1,1V22.5z",
    })
  );
};

var TOOLTIP_OFFSET_LTR = { left: 8, top: 0 };
var TOOLTIP_OFFSET_RTL = { left: -8, top: 0 };
var Sidebar = function (props) {
  const { attachmentTabContent, bookmarkTabContent, store, thumbnailTabContent, tabs } = props;
  const containerRef = useRef();
  const l10n = useContext(main.LocalizationContext).l10n;
  const [opened, setOpened] = useState(store.get("isCurrentTabOpened") || false);
  const [currentTab, setCurrentTab] = useState(Math.max(store.get("currentTab") || 0, 0));
  const direction = useContext(main.ThemeContext).direction;
  const isRtl = direction === main.TextDirection.RightToLeft;
  var resizeConstrain = function (size) {
    return size.firstHalfPercentage >= 20 && size.firstHalfPercentage <= 80;
  };
  var defaultTabs = [
    {
      content: thumbnailTabContent,
      icon: createElement(ThumbnailIcon, null),
      title: l10n && l10n.defaultLayout ? l10n.defaultLayout.thumbnail : "Thumbnail",
    },
    {
      content: bookmarkTabContent,
      icon: createElement(BookmarkIcon, null),
      title: l10n && l10n.defaultLayout ? l10n.defaultLayout.bookmark : "Bookmark",
    },
    {
      content: attachmentTabContent,
      icon: createElement(FileIcon, null),
      title: l10n && l10n.defaultLayout ? l10n.defaultLayout.attachment : "Attachment",
    },
  ];
  var listTabs = tabs ? tabs(defaultTabs) : defaultTabs;
  var toggleTab = function (index) {
    if (currentTab === index) {
      store.update("isCurrentTabOpened", !store.get("isCurrentTabOpened"));
      var container = containerRef.current;
      if (container) {
        var width = container.style.width;
        if (width) {
          container.style.removeProperty("width");
        }
      }
    } else {
      store.update("currentTab", index);
    }
  };
  var switchToTab = function (index) {
    if (index >= 0 && index <= listTabs.length - 1) {
      store.update("isCurrentTabOpened", true);
      setCurrentTab(index);
    }
  };
  var handleCurrentTabOpened = function (opened) {
    setOpened(opened);
  };
  useEffect(function () {
    store.subscribe("currentTab", switchToTab);
    store.subscribe("isCurrentTabOpened", handleCurrentTabOpened);
    return function () {
      store.unsubscribe("currentTab", switchToTab);
      store.unsubscribe("isCurrentTabOpened", handleCurrentTabOpened);
    };
  }, []);
  if (listTabs.length === 0) {
    return createElement(Fragment, null);
  }
  // return (
  //   <>
  //     <div ref={containerRef} className={`rpv-default-layout__sidebar ${opened ? "rpv-default-layout__sidebar--opened" : ""} ${!isRtl ? "rpv-default-layout__sidebar--ltr" : ""} ${isRtl ? "rpv-default-layout__sidebar--ltr" : ""}`}>
  //       <div className="rpv-default-layout__sidebar-tabs">
  //         <div className="rpv-default-layout__sidebar-headers" role="tablist" aria-orientation="vertical">
  //           {listTabs.map((tab, index) => {
  //             return <div aria-controls="rpv-default-layout__sidebar-content" aria-selected={currentTab === index} key={index} className="rpv-default-layout__sidebar-header" id={`rpv-default-layout__sidebar-tab-${index}`} role="tab"></div>;
  //           })}
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
  return createElement(
    Fragment,
    null,
    createElement(
      "div",
      {
        "data-testid": "default-layout__sidebar",
        className: main.classNames({
          "rpv-default-layout__sidebar": true,
          "rpv-default-layout__sidebar--opened": opened,
          "rpv-default-layout__sidebar--ltr": !isRtl,
          "rpv-default-layout__sidebar--rtl": isRtl,
        }),
        ref: containerRef,
      },
      createElement(
        "div",
        { className: "rpv-default-layout__sidebar-tabs" },
        createElement(
          "div",
          { className: "rpv-default-layout__sidebar-headers", role: "tablist", "aria-orientation": "vertical" },
          listTabs.map(function (tab, index) {
            return createElement(
              "div",
              { "aria-controls": "rpv-default-layout__sidebar-content", "aria-selected": currentTab === index, key: index, className: "rpv-default-layout__sidebar-header", id: "rpv-default-layout__sidebar-tab-".concat(index), role: "tab" },
              createElement(main.Tooltip, {
                ariaControlsSuffix: "default-layout-sidebar-tab-".concat(index),
                position: isRtl ? main.Position.LeftCenter : main.Position.RightCenter,
                target: createElement(
                  main.MinimalButton,
                  {
                    ariaLabel: tab.title,
                    isSelected: currentTab === index,
                    onClick: function () {
                      return toggleTab(index);
                    },
                  },
                  tab.icon
                ),
                content: function () {
                  return tab.title;
                },
                offset: isRtl ? TOOLTIP_OFFSET_RTL : TOOLTIP_OFFSET_LTR,
              })
            );
          })
        ),
        createElement(
          "div",
          {
            "aria-labelledby": "rpv-default-layout__sidebar-tab-".concat(currentTab),
            id: "rpv-default-layout__sidebar-content",
            className: main.classNames({
              "rpv-default-layout__sidebar-content": true,
              "rpv-default-layout__sidebar-content--opened": opened,
              "rpv-default-layout__sidebar-content--ltr": !isRtl,
              "rpv-default-layout__sidebar-content--rtl": isRtl,
            }),
            role: "tabpanel",
            tabIndex: -1,
          },
          listTabs[currentTab].content
        )
      )
    ),
    opened && createElement(main.Splitter, { constrain: resizeConstrain })
  );
};

var useOptions = function (props) {
  var store = useMemo(function () {
    return main.createStore({
      isCurrentTabOpened: false,
      currentTab: 0,
    });
  }, []);
  var attachmentPluginInstance = attachment.useAttachmentPlugin();
  var bookmarkPluginInstance = bookmark.useBookmarkPlugin();
  var thumbnailPluginInstance = thumbnail.useThumbnailPlugin(props ? props.useThumbnailPlugin : {});
  var toolbarPluginInstance = toolbar.useToolbarPlugin(props ? props.useToolbarPlugin : { test: true });
  var Attachments = attachmentPluginInstance.Attachments;
  var Bookmarks = bookmarkPluginInstance.Bookmarks;
  var Thumbnails = thumbnailPluginInstance.Thumbnails;
  var Toolbar = toolbarPluginInstance.Toolbar;
  var sidebarTabs = props
    ? props.sidebarTabs
    : function (defaultTabs) {
        return defaultTabs;
      };
  var plugins = [attachmentPluginInstance, bookmarkPluginInstance, thumbnailPluginInstance, toolbarPluginInstance];
  return {
    attachmentPluginInstance: attachmentPluginInstance,
    bookmarkPluginInstance: bookmarkPluginInstance,
    thumbnailPluginInstance: thumbnailPluginInstance,
    toolbarPluginInstance: toolbarPluginInstance,
    activateTab: function (index) {
      store.update("currentTab", index);
    },
    toggleTab: function (index) {
      var currentTab = store.get("currentTab");
      store.update("isCurrentTabOpened", !store.get("isCurrentTabOpened"));
      if (currentTab !== index) {
        store.update("currentTab", index);
      }
    },
    install: function (pluginFunctions) {
      plugins.forEach(function (plugin) {
        if (plugin.install) {
          plugin.install(pluginFunctions);
        }
      });
    },
    renderPageLayer: function (renderProps) {
      return createElement(
        Fragment,
        null,
        plugins.map(function (plugin, idx) {
          return plugin.renderPageLayer ? createElement(Fragment, { key: idx }, plugin.renderPageLayer(renderProps)) : createElement(Fragment, { key: idx }, createElement(Fragment, null));
        })
      );
    },
    renderViewer: function (renderProps) {
      var slot = renderProps.slot;
      plugins.forEach(function (plugin) {
        if (plugin.renderViewer) {
          slot = plugin.renderViewer(__assign(__assign({}, renderProps), { slot: slot }));
        }
      });
      var mergeSubSlot =
        slot.subSlot && slot.subSlot.attrs
          ? {
              className: slot.subSlot.attrs.className,
              "data-testid": slot.subSlot.attrs["data-testid"],
              ref: slot.subSlot.attrs.ref,
              style: slot.subSlot.attrs.style,
            }
          : {};
      // slot.children = (
      //   <div className="rpv-default-layout__container">
      //     <div classNames={`rpv-default-layout__main ${renderProps.themeContext.direction === main.TextDirection.RightToLeft ? "rpv-default-layout__main--rtl" : ""}`}>
      //       <Sidebar attachmentTabContent={<Attachments />} bookmarkTabContent={<Bookmarks />} thumbnailTabContent={<Thumbnails />} store={store} tabs={sidebarTabs}></Sidebar>
      //       <div className="rpv-default-layout__body">
      //         <div className="rpv-default-layout__toolbar">{props.renderToolbar ? props.renderToolbar(Toolbar) : <Toolbar />}</div>
      //         <div {...mergeSubSlot}>{slot.subSlot.children}</div>
      //       </div>
      //     </div>
      //     {slot.children}
      //   </div>
      // );
      const oldProps = mergeSubSlot;
      const newProps = __assign({}, mergeSubSlot);

      slot.children = createElement(
        "div",
        { className: "rpv-default-layout__container" },
        createElement(
          "div",
          {
            "data-testid": "default-layout__main",
            className: main.classNames({
              "rpv-default-layout__main": true,
              "rpv-default-layout__main--rtl": renderProps.themeContext.direction === main.TextDirection.RightToLeft,
            }),
          },
          createElement(Sidebar, { attachmentTabContent: createElement(Attachments, null), bookmarkTabContent: createElement(Bookmarks, null), store: store, thumbnailTabContent: createElement(Thumbnails, null), tabs: sidebarTabs }),
          createElement(
            "div",
            { className: "rpv-default-layout__body", "data-testid": "default-layout__body" },
            createElement(
              "div",
              { className: "rpv-default-layout__toolbar" },
              props && props.renderToolbar ? props.renderToolbar(Toolbar) : createElement(Toolbar, { switchTheme: props.theme, fullScreen: props.fullScreen, openFile: props.openFile, downloadFile: props.downloadFile, printFile: props.printFile })
            ),
            createElement("div", __assign({}, mergeSubSlot), slot.subSlot.children)
          )
        ),
        slot.children
      );
      slot.subSlot.attrs = {};
      slot.subSlot.children = createElement(Fragment, null);
      return slot;
    },
    uninstall: function (pluginFunctions) {
      plugins.forEach(function (plugin) {
        if (plugin.uninstall) {
          plugin.uninstall(pluginFunctions);
        }
      });
    },
    onDocumentLoad: function (documentLoadProps) {
      plugins.forEach(function (plugin) {
        if (plugin.onDocumentLoad) {
          plugin.onDocumentLoad(documentLoadProps);
        }
      });
      if (props && props.setInitialTab) {
        props.setInitialTab(documentLoadProps.doc).then(function (initialTab) {
          store.update("currentTab", initialTab);
          store.update("isCurrentTabOpened", true);
        });
      }
    },
    onAnnotationLayerRender: function (props) {
      plugins.forEach(function (plugin) {
        if (plugin.onAnnotationLayerRender) {
          plugin.onAnnotationLayerRender(props);
        }
      });
    },
    onTextLayerRender: function (props) {
      plugins.forEach(function (plugin) {
        if (plugin.onTextLayerRender) {
          plugin.onTextLayerRender(props);
        }
      });
    },
    onViewerStateChange: function (viewerState) {
      var newState = viewerState;
      plugins.forEach(function (plugin) {
        if (plugin.onViewerStateChange) {
          newState = plugin.onViewerStateChange(newState);
        }
      });
      return newState;
    },
  };
};

var setInitialTabFromPageMode = function (doc) {
  return new Promise(function (resolve, _) {
    doc.getPageMode().then(function (pageMode) {
      if (!pageMode) {
        resolve(-1);
      } else {
        switch (pageMode) {
          case main.PageMode.Attachments:
            resolve(2);
            break;
          case main.PageMode.Bookmarks:
            resolve(1);
            break;
          case main.PageMode.Thumbnails:
            resolve(0);
            break;
          default:
            resolve(-1);
            break;
        }
      }
    });
  });
};

export { BookmarkIcon, FileIcon, ThumbnailIcon, useOptions, setInitialTabFromPageMode };
