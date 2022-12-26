function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Printer = function () {
  'use strict';

  function noop() {}
  var SyntheticEvent = /*#__PURE__*/function () {
    function SyntheticEvent() {
      _classCallCheck(this, SyntheticEvent);
    }
    _createClass(SyntheticEvent, [{
      key: "addListener",
      value: function addListener(el, type, listener) {
        if (!el) return noop;
        if (el.addEventListener) {
          el.addEventListener(type, listener);
          return function () {
            el.removeEventListener(type, listener);
          };
        }
        var event = "on".concat(type);
        if (el.attachEvent) {
          el.attachEvent(event, listener);
          return function () {
            el.detachEvent(event, listener);
          };
        }
        el[event] = listener;
        return function () {
          el[event] = null;
        };
      }
    }]);
    return SyntheticEvent;
  }();
  var syntheticEvent = new SyntheticEvent();
  function isIE() {
    return 'ActiveXObject' in window;
  }
  function removeNode(node) {
    if (!node) return;
    if (isIE()) {
      node.removeNode(true);
    } else {
      node.remove();
    }
  }
  var HTMLStandards;
  (function (HTMLStandards) {
    HTMLStandards["Strict"] = "strict";
    HTMLStandards["Loose"] = "loose";
    HTMLStandards["HTML5"] = "html5";
  })(HTMLStandards || (HTMLStandards = {}));
  var CanvasImageClassName = 'canvas-image';
  var CanvasImageSelector = ".".concat(CanvasImageClassName);
  var each = Array.prototype.forEach;
  var Printer = /*#__PURE__*/function () {
    function Printer(options) {
      _classCallCheck(this, Printer);
      var defaultOptions = {
        standard: HTMLStandards.HTML5
      };
      this.options = _objectSpread(_objectSpread({}, options), defaultOptions);
      this.init();
    }
    _createClass(Printer, [{
      key: "init",
      value: function init() {
        var _this = this;
        var timeStamp = new Date().getTime();
        if (this.options.id) {
          this.printById(timeStamp, this.options.id);
        } else {
          if (this.options.url) {
            this.printByUrl(timeStamp, this.options.url);
          } else if (this.options.getUrlAsync) {
            this.options.getUrlAsync(function (url) {
              if (!url) {
                throw new Error("[browswer-print] Make sure provide one of options.id/url/getUrlAsync");
              }
              _this.printByUrl(timeStamp, url);
            });
          }
        }
      }
    }, {
      key: "printByUrl",
      value: function printByUrl(timeStamp, url) {
        var frameId = "print-iframe-".concat(timeStamp);
        this.createIframe(frameId, url);
      }
    }, {
      key: "printById",
      value: function printById(timeStamp, id) {
        var frameId = "print-iframe-".concat(timeStamp);
        var iframe = this.createIframe(frameId, String(timeStamp));
        this.writeIframe(iframe.contentDocument, id);
      }
    }, {
      key: "createIframe",
      value: function createIframe(frameId, url) {
        var _this2 = this;
        var iframe = document.createElement('iframe');
        iframe.style.border = '0px';
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.right = '0px';
        iframe.style.top = '0px';
        iframe.setAttribute('id', frameId);
        iframe.setAttribute('src', url);
        var remove = syntheticEvent.addListener(iframe, 'load', function () {
          _this2.print(iframe);
          remove();
        });
        document.body.appendChild(iframe);
        return iframe;
      }
    }, {
      key: "writeIframe",
      value: function writeIframe(doc, id) {
        if (!doc) return;
        doc.open();
        doc.write("".concat(this.generateDocType(), "<html>").concat(this.generateHead()).concat(this.generateBody(id), "</html>"));
        doc.close();
      }
    }, {
      key: "generateDocType",
      value: function generateDocType() {
        if (this.options.standard === HTMLStandards.HTML5) {
          return '<!DOCTYPE html>';
        }
        var transitional = this.options.standard === HTMLStandards.Loose ? ' Transitional' : '';
        var dtd = this.options.standard === HTMLStandards.Loose ? 'loose' : 'strict';
        return "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01".concat(transitional, "//EN\" \"http://www.w3.org/TR/html4/").concat(dtd, ".dtd\">");
      }
    }, {
      key: "generateHead",
      value: function generateHead() {
        var _this$options$iframeT, _this$options$extraHe;
        var links = [];
        var styles = [];
        each.call(document.querySelectorAll('link'), function (link) {
          if (/\.css$/.test(link.href)) {
            links.push("<link type=\"text/css\" rel=\"stylesheet\" href=\"".concat(link.href, "\" >"));
          }
        });
        each.call(document.styleSheets, function (sheet) {
          try {
            if (sheet.href) {
              return;
            }
            if (sheet.cssRules || sheet.rules) {
              var rules = sheet.cssRules || sheet.rules;
              each.call(rules, function (rule) {
                styles.push(rule.cssText);
              });
            }
          } catch (e) {
            console.error("[browser-print] ".concat(sheet.href, " ").concat(e));
          }
        });
        if (this.options.extraCss) {
          this.options.extraCss.forEach(function (href) {
            links.push("<link type=\"text/css\" rel=\"stylesheet\" href=\"".concat(href, "\" >"));
          });
        }
        var title = (_this$options$iframeT = this.options.iframeTitle) !== null && _this$options$iframeT !== void 0 ? _this$options$iframeT : '';
        var extraHead = (_this$options$extraHe = this.options.extraHead) !== null && _this$options$extraHe !== void 0 ? _this$options$extraHe : [];
        return "<head><title>".concat(title, "</title>").concat(extraHead.join('')).concat(links.join(''), "<style type=\"text/css\">").concat(styles.join(''), "</style></head>");
      }
    }, {
      key: "generateBody",
      value: function generateBody(id) {
        var target = document.getElementById(id.replace(/^#/, ''));
        if (!target) {
          console.warn("[browser-print] cannot found element '".concat(id, "'"));
          return '<body></body>';
        }
        var el = this.preprocess(target);
        return "<body>".concat(el.outerHTML, "</body>");
      }
    }, {
      key: "preprocess",
      value: function preprocess(target) {
        var canvases = target.querySelectorAll('canvas');
        each.call(canvases, function (canvas) {
          var _canvas$parentNode;
          var dataUrl = canvas.toDataURL('image/png');
          var image = new Image();
          image.className = CanvasImageClassName;
          image.src = dataUrl;
          image.style.display = 'none';
          (_canvas$parentNode = canvas.parentNode) === null || _canvas$parentNode === void 0 ? void 0 : _canvas$parentNode.appendChild(image);
        });
        var el = target.cloneNode(true);
        var canvasLikes = el.querySelectorAll("".concat(CanvasImageSelector, ", canvas"));
        each.call(canvasLikes, function (element) {
          if (element.tagName.toLowerCase() === 'canvas') {
            var _element$parentNode;
            (_element$parentNode = element.parentNode) === null || _element$parentNode === void 0 ? void 0 : _element$parentNode.removeChild(element);
          } else {
            element.style.display = 'block';
          }
        });
        var inputs = el.querySelectorAll('input');
        each.call(inputs, function (input) {
          var type = input.getAttribute('type');
          if (!type) return;
          if (['checkbox', 'radio'].indexOf(type) > -1) {
            if (input.checked) {
              input.checked = true;
              input.setAttribute('checked', 'true');
            } else {
              input.checked = false;
            }
          } else {
            input.setAttribute('value', input.value);
          }
        });
        var selects = el.querySelectorAll('select');
        var originalSelects = target.querySelectorAll('select');
        each.call(selects, function (select, i) {
          var selectedIndex = originalSelects[i].options.selectedIndex;
          select.options[selectedIndex].setAttribute('selected', 'true');
        });
        var textareas = el.querySelectorAll('textarea');
        each.call(textareas, function (textarea) {
          textarea.setAttribute('html', textarea.value);
          textarea.innerHTML = textarea.value;
        });
        return el;
      }
    }, {
      key: "print",
      value: function print(iframe) {
        var _this3 = this;
        var win = iframe.contentWindow;
        if (!win) return null;
        syntheticEvent.addListener(win, 'beforeprint', function () {
          var _this3$options$onBefo, _this3$options;
          (_this3$options$onBefo = (_this3$options = _this3.options).onBeforePrint) === null || _this3$options$onBefo === void 0 ? void 0 : _this3$options$onBefo.call(_this3$options);
        });
        syntheticEvent.addListener(win, 'afterprint', function () {
          var _this3$options$onAfte, _this3$options2;
          (_this3$options$onAfte = (_this3$options2 = _this3.options).onAfterPrint) === null || _this3$options$onAfte === void 0 ? void 0 : _this3$options$onAfte.call(_this3$options2);
          _this3.clear(iframe);
        });
        win.focus();
        win.print();
      }
    }, {
      key: "clear",
      value: function clear(iframe) {
        var canvasImages = document.querySelectorAll(CanvasImageSelector);
        each.call(canvasImages, function (el) {
          var _el$parentNode;
          (_el$parentNode = el.parentNode) === null || _el$parentNode === void 0 ? void 0 : _el$parentNode.removeChild(el);
        });
        removeNode(iframe);
      }
    }]);
    return Printer;
  }();
  return Printer;
}();
