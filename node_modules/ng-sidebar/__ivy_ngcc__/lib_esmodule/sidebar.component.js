import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from './sidebar-container.component';
import * as ɵngcc2 from '@angular/common';

var _c0 = ["sidebar"];
var _c1 = ["*"];
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, Optional, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SidebarContainer } from './sidebar-container.component';
import { isLTR, isIOS } from './utils';
var Sidebar = (function () {
    function Sidebar(_container, _ref, platformId) {
        this._container = _container;
        this._ref = _ref;
        this.opened = false;
        this.openedChange = new EventEmitter();
        this.mode = 'over';
        this.dock = false;
        this.dockedSize = '0px';
        this.position = 'start';
        this.animate = true;
        this.autoCollapseOnInit = true;
        this.trapFocus = false;
        this.autoFocus = true;
        this.showBackdrop = false;
        this.closeOnClickBackdrop = false;
        this.closeOnClickOutside = false;
        this.keyClose = false;
        this.keyCode = 27;
        this.onContentInit = new EventEmitter();
        this.onOpenStart = new EventEmitter();
        this.onOpened = new EventEmitter();
        this.onCloseStart = new EventEmitter();
        this.onClosed = new EventEmitter();
        this.onTransitionEnd = new EventEmitter();
        this.onModeChange = new EventEmitter();
        this.onPositionChange = new EventEmitter();
        this._onRerender = new EventEmitter();
        this._focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
            'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
        this._tabIndexAttr = '__tabindex__';
        this._tabIndexIndicatorAttr = '__ngsidebar-tabindex__';
        this._clickEvent = 'click';
        this._onClickOutsideAttached = false;
        this._onKeyDownAttached = false;
        this._onResizeAttached = false;
        if (!this._container) {
            throw new Error('<ng-sidebar> must be inside a <ng-sidebar-container>. ' +
                'See https://github.com/arkon/ng-sidebar#usage for more info.');
        }
        this._isBrowser = isPlatformBrowser(platformId);
        if (this._isBrowser && isIOS() && !('onclick' in window)) {
            this._clickEvent = 'touchstart';
        }
        this._normalizePosition();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this._onTransitionEnd = this._onTransitionEnd.bind(this);
        this._onFocusTrap = this._onFocusTrap.bind(this);
        this._onClickOutside = this._onClickOutside.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._collapse = this._collapse.bind(this);
    }
    Sidebar.prototype.ngOnInit = function () {
        if (!this._isBrowser) {
            return;
        }
        if (this.animate) {
            this._shouldAnimate = true;
            this.animate = false;
        }
        this._container._addSidebar(this);
        if (this.autoCollapseOnInit) {
            this._collapse();
        }
    };
    Sidebar.prototype.ngAfterContentInit = function () {
        this.onContentInit.emit();
    };
    Sidebar.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (!this._isBrowser) {
            return;
        }
        if (changes['animate'] && this._shouldAnimate) {
            this._shouldAnimate = changes['animate'].currentValue;
        }
        if (changes['closeOnClickOutside']) {
            if (changes['closeOnClickOutside'].currentValue) {
                this._initCloseClickListener();
            }
            else {
                this._destroyCloseClickListener();
            }
        }
        if (changes['keyClose']) {
            if (changes['keyClose'].currentValue) {
                this._initCloseKeyDownListener();
            }
            else {
                this._destroyCloseKeyDownListener();
            }
        }
        if (changes['position']) {
            this._normalizePosition();
            setTimeout(function () {
                _this.onPositionChange.emit(changes['position'].currentValue);
            });
        }
        if (changes['mode']) {
            setTimeout(function () {
                _this.onModeChange.emit(changes['mode'].currentValue);
            });
        }
        if (changes['dock']) {
            this.triggerRerender();
        }
        if (changes['opened']) {
            if (this._shouldAnimate) {
                this.animate = true;
                this._shouldAnimate = false;
            }
            if (changes['opened'].currentValue) {
                this.open();
            }
            else {
                this.close();
            }
        }
        if (changes['autoCollapseHeight'] || changes['autoCollapseWidth']) {
            this._initCollapseListeners();
        }
    };
    Sidebar.prototype.ngOnDestroy = function () {
        if (!this._isBrowser) {
            return;
        }
        this._destroyCloseListeners();
        this._destroyCollapseListeners();
        this._container._removeSidebar(this);
    };
    Sidebar.prototype.open = function () {
        var _this = this;
        if (!this._isBrowser) {
            return;
        }
        this.opened = true;
        this.openedChange.emit(true);
        this.onOpenStart.emit();
        this._ref.detectChanges();
        setTimeout(function () {
            if (_this.animate && !_this._isModeSlide) {
                _this._elSidebar.nativeElement.addEventListener('transitionend', _this._onTransitionEnd);
            }
            else {
                _this._setFocused();
                _this._initCloseListeners();
                if (_this.opened) {
                    _this.onOpened.emit();
                }
            }
        });
    };
    Sidebar.prototype.close = function () {
        var _this = this;
        if (!this._isBrowser) {
            return;
        }
        this.opened = false;
        this.openedChange.emit(false);
        this.onCloseStart.emit();
        this._ref.detectChanges();
        setTimeout(function () {
            if (_this.animate && !_this._isModeSlide) {
                _this._elSidebar.nativeElement.addEventListener('transitionend', _this._onTransitionEnd);
            }
            else {
                _this._setFocused();
                _this._destroyCloseListeners();
                if (!_this.opened) {
                    _this.onClosed.emit();
                }
            }
        });
    };
    Sidebar.prototype.triggerRerender = function () {
        var _this = this;
        if (!this._isBrowser) {
            return;
        }
        setTimeout(function () {
            _this._onRerender.emit();
        });
    };
    Sidebar.prototype._getStyle = function () {
        var transformStyle = '';
        if (!this.opened) {
            var transformDir = 'translate' + (this._isLeftOrRight ? 'X' : 'Y');
            var translateAmt = (this._isLeftOrTop ? '-' : '') + "100%";
            transformStyle = transformDir + "(" + translateAmt + ")";
            if (this.dock && this._dockedSize > 0 && !(this._isModeSlide && this.opened)) {
                transformStyle += " " + transformDir + "(" + (this._isLeftOrTop ? '+' : '-') + this.dockedSize + ")";
            }
        }
        return {
            webkitTransform: transformStyle,
            transform: transformStyle
        };
    };
    Sidebar.prototype._onTransitionEnd = function (e) {
        if (e.target === this._elSidebar.nativeElement && e.propertyName.endsWith('transform')) {
            this._setFocused();
            if (this.opened) {
                this._initCloseListeners();
                this.onOpened.emit();
            }
            else {
                this._destroyCloseListeners();
                this.onClosed.emit();
            }
            this.onTransitionEnd.emit();
            this._elSidebar.nativeElement.removeEventListener('transitionend', this._onTransitionEnd);
        }
    };
    Object.defineProperty(Sidebar.prototype, "_shouldTrapFocus", {
        get: function () {
            return this.opened && this.trapFocus;
        },
        enumerable: true,
        configurable: true
    });
    Sidebar.prototype._focusFirstItem = function () {
        if (this._focusableElements && this._focusableElements.length > 0) {
            this._focusableElements[0].focus();
        }
    };
    Sidebar.prototype._onFocusTrap = function (e) {
        if (this._shouldTrapFocus && !this._elSidebar.nativeElement.contains(e.target)) {
            this._focusFirstItem();
        }
    };
    Sidebar.prototype._setFocused = function () {
        this._focusableElements = Array.from(this._elSidebar.nativeElement.querySelectorAll(this._focusableElementsString));
        if (this.opened) {
            this._focusedBeforeOpen = document.activeElement;
            for (var _i = 0, _a = this._focusableElements; _i < _a.length; _i++) {
                var el = _a[_i];
                var prevTabIndex = el.getAttribute(this._tabIndexAttr);
                var wasTabIndexSet = el.getAttribute(this._tabIndexIndicatorAttr) !== null;
                if (prevTabIndex !== null) {
                    el.setAttribute('tabindex', prevTabIndex);
                    el.removeAttribute(this._tabIndexAttr);
                }
                else if (wasTabIndexSet) {
                    el.removeAttribute('tabindex');
                    el.removeAttribute(this._tabIndexIndicatorAttr);
                }
            }
            if (this.autoFocus) {
                this._focusFirstItem();
            }
            document.addEventListener('focus', this._onFocusTrap, true);
        }
        else {
            for (var _b = 0, _c = this._focusableElements; _b < _c.length; _b++) {
                var el = _c[_b];
                var existingTabIndex = el.getAttribute('tabindex');
                el.setAttribute('tabindex', '-1');
                el.setAttribute(this._tabIndexIndicatorAttr, '');
                if (existingTabIndex !== null) {
                    el.setAttribute(this._tabIndexAttr, existingTabIndex);
                }
            }
            document.removeEventListener('focus', this._onFocusTrap, true);
            if (this._focusedBeforeOpen && this.autoFocus && this._isModeOver) {
                this._focusedBeforeOpen.focus();
                this._focusedBeforeOpen = null;
            }
        }
    };
    Sidebar.prototype._initCloseListeners = function () {
        this._initCloseClickListener();
        this._initCloseKeyDownListener();
    };
    Sidebar.prototype._initCloseClickListener = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.opened && _this.closeOnClickOutside && !_this._onClickOutsideAttached) {
                document.addEventListener(_this._clickEvent, _this._onClickOutside);
                _this._onClickOutsideAttached = true;
            }
        });
    };
    Sidebar.prototype._initCloseKeyDownListener = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.opened && _this.keyClose && !_this._onKeyDownAttached) {
                document.addEventListener('keydown', _this._onKeyDown);
                _this._onKeyDownAttached = true;
            }
        });
    };
    Sidebar.prototype._destroyCloseListeners = function () {
        this._destroyCloseClickListener();
        this._destroyCloseKeyDownListener();
    };
    Sidebar.prototype._destroyCloseClickListener = function () {
        if (this._onClickOutsideAttached) {
            document.removeEventListener(this._clickEvent, this._onClickOutside);
            this._onClickOutsideAttached = false;
        }
    };
    Sidebar.prototype._destroyCloseKeyDownListener = function () {
        if (this._onKeyDownAttached) {
            document.removeEventListener('keydown', this._onKeyDown);
            this._onKeyDownAttached = false;
        }
    };
    Sidebar.prototype._onClickOutside = function (e) {
        if (this._onClickOutsideAttached && this._elSidebar && !this._elSidebar.nativeElement.contains(e.target)) {
            this.close();
        }
    };
    Sidebar.prototype._onKeyDown = function (e) {
        e = e || window.event;
        if (e.keyCode === this.keyCode) {
            this.close();
        }
    };
    Sidebar.prototype._initCollapseListeners = function () {
        var _this = this;
        if (this.autoCollapseHeight || this.autoCollapseWidth) {
            setTimeout(function () {
                if (!_this._onResizeAttached) {
                    window.addEventListener('resize', _this._collapse);
                    _this._onResizeAttached = true;
                }
            });
        }
    };
    Sidebar.prototype._destroyCollapseListeners = function () {
        if (this._onResizeAttached) {
            window.removeEventListener('resize', this._collapse);
            this._onResizeAttached = false;
        }
    };
    Sidebar.prototype._collapse = function () {
        var winHeight = window.innerHeight;
        var winWidth = window.innerWidth;
        if (this.autoCollapseHeight) {
            if (winHeight <= this.autoCollapseHeight && this.opened) {
                this._wasCollapsed = true;
                this.close();
            }
            else if (winHeight > this.autoCollapseHeight && this._wasCollapsed) {
                this.open();
                this._wasCollapsed = false;
            }
        }
        if (this.autoCollapseWidth) {
            if (winWidth <= this.autoCollapseWidth && this.opened) {
                this._wasCollapsed = true;
                this.close();
            }
            else if (winWidth > this.autoCollapseWidth && this._wasCollapsed) {
                this.open();
                this._wasCollapsed = false;
            }
        }
    };
    Object.defineProperty(Sidebar.prototype, "_height", {
        get: function () {
            if (this._elSidebar.nativeElement) {
                return this._isDocked ? this._dockedSize : this._elSidebar.nativeElement.offsetHeight;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_width", {
        get: function () {
            if (this._elSidebar.nativeElement) {
                return this._isDocked ? this._dockedSize : this._elSidebar.nativeElement.offsetWidth;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_dockedSize", {
        get: function () {
            return parseFloat(this.dockedSize);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_isModeOver", {
        get: function () {
            return this.mode === 'over';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_isModePush", {
        get: function () {
            return this.mode === 'push';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_isModeSlide", {
        get: function () {
            return this.mode === 'slide';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_isDocked", {
        get: function () {
            return this.dock && this.dockedSize && !this.opened;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_isLeftOrTop", {
        get: function () {
            return this.position === 'left' || this.position === 'top';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_isLeftOrRight", {
        get: function () {
            return this.position === 'left' || this.position === 'right';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sidebar.prototype, "_isInert", {
        get: function () {
            return !this.opened && !this.dock;
        },
        enumerable: true,
        configurable: true
    });
    Sidebar.prototype._normalizePosition = function () {
        var ltr = isLTR();
        if (this.position === 'start') {
            this.position = ltr ? 'left' : 'right';
        }
        else if (this.position === 'end') {
            this.position = ltr ? 'right' : 'left';
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "opened", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "openedChange", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Sidebar.prototype, "mode", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "dock", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Sidebar.prototype, "dockedSize", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Sidebar.prototype, "position", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "animate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], Sidebar.prototype, "autoCollapseHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], Sidebar.prototype, "autoCollapseWidth", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "autoCollapseOnInit", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Sidebar.prototype, "sidebarClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Sidebar.prototype, "ariaLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "trapFocus", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "autoFocus", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "showBackdrop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "closeOnClickBackdrop", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "closeOnClickOutside", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Sidebar.prototype, "keyClose", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], Sidebar.prototype, "keyCode", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onContentInit", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onOpenStart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onOpened", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onCloseStart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onClosed", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onTransitionEnd", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onModeChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "onPositionChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], Sidebar.prototype, "_onRerender", void 0);
    __decorate([
        ViewChild('sidebar', { static: false }),
        __metadata("design:type", ElementRef)
    ], Sidebar.prototype, "_elSidebar", void 0);
    Sidebar = __decorate([ __param(0, Optional()),
        __param(2, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [SidebarContainer,
            ChangeDetectorRef,
            Object])
    ], Sidebar);
Sidebar.ɵfac = function Sidebar_Factory(t) { return new (t || Sidebar)(ɵngcc0.ɵɵdirectiveInject(ɵngcc1.SidebarContainer, 8), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ChangeDetectorRef), ɵngcc0.ɵɵdirectiveInject(PLATFORM_ID)); };
Sidebar.ɵcmp = /*@__PURE__*/ ɵngcc0.ɵɵdefineComponent({ type: Sidebar, selectors: [["ng-sidebar"]], viewQuery: function Sidebar_Query(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵviewQuery(_c0, 5);
    } if (rf & 2) {
        var _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx._elSidebar = _t.first);
    } }, inputs: { opened: "opened", mode: "mode", dock: "dock", dockedSize: "dockedSize", position: "position", animate: "animate", autoCollapseOnInit: "autoCollapseOnInit", trapFocus: "trapFocus", autoFocus: "autoFocus", showBackdrop: "showBackdrop", closeOnClickBackdrop: "closeOnClickBackdrop", closeOnClickOutside: "closeOnClickOutside", keyClose: "keyClose", keyCode: "keyCode", autoCollapseHeight: "autoCollapseHeight", autoCollapseWidth: "autoCollapseWidth", sidebarClass: "sidebarClass", ariaLabel: "ariaLabel" }, outputs: { openedChange: "openedChange", onContentInit: "onContentInit", onOpenStart: "onOpenStart", onOpened: "onOpened", onCloseStart: "onCloseStart", onClosed: "onClosed", onTransitionEnd: "onTransitionEnd", onModeChange: "onModeChange", onPositionChange: "onPositionChange", _onRerender: "_onRerender" }, features: [ɵngcc0.ɵɵNgOnChangesFeature], ngContentSelectors: _c1, decls: 3, vars: 15, consts: [["role", "complementary", 3, "ngClass", "ngStyle"], ["sidebar", ""]], template: function Sidebar_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵprojectionDef();
        ɵngcc0.ɵɵelementStart(0, "aside", 0, 1);
        ɵngcc0.ɵɵprojection(2);
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵclassMapInterpolate3("ng-sidebar ng-sidebar--", ctx.opened ? "opened" : "closed", " ng-sidebar--", ctx.position, " ng-sidebar--", ctx.mode, "");
        ɵngcc0.ɵɵclassProp("ng-sidebar--docked", ctx._isDocked)("ng-sidebar--inert", ctx._isInert)("ng-sidebar--animate", ctx.animate);
        ɵngcc0.ɵɵproperty("ngClass", ctx.sidebarClass)("ngStyle", ctx._getStyle());
        ɵngcc0.ɵɵattribute("aria-hidden", !ctx.opened)("aria-label", ctx.ariaLabel);
    } }, dependencies: [ɵngcc2.NgClass, ɵngcc2.NgStyle], styles: [".ng-sidebar[_ngcontent-%COMP%] {\n      -webkit-overflow-scrolling: touch;\n      overflow: auto;\n      pointer-events: auto;\n      position: absolute;\n      touch-action: auto;\n      will-change: initial;\n      z-index: 2;\n    }\n\n    .ng-sidebar--left[_ngcontent-%COMP%] {\n      bottom: 0;\n      left: 0;\n      top: 0;\n    }\n\n    .ng-sidebar--right[_ngcontent-%COMP%] {\n      bottom: 0;\n      right: 0;\n      top: 0;\n    }\n\n    .ng-sidebar--top[_ngcontent-%COMP%] {\n      left: 0;\n      right: 0;\n      top: 0;\n    }\n\n    .ng-sidebar--bottom[_ngcontent-%COMP%] {\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n\n    .ng-sidebar--inert[_ngcontent-%COMP%] {\n      pointer-events: none;\n      touch-action: none;\n      will-change: transform;\n    }\n\n    .ng-sidebar--animate[_ngcontent-%COMP%] {\n      -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 0, 0.3, 1);\n      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);\n    }"], changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(Sidebar, [{
        type: Component,
        args: [{ selector: 'ng-sidebar', template: "\n    <aside #sidebar\n      role=\"complementary\"\n      [attr.aria-hidden]=\"!opened\"\n      [attr.aria-label]=\"ariaLabel\"\n      class=\"ng-sidebar ng-sidebar--{{opened ? 'opened' : 'closed'}} ng-sidebar--{{position}} ng-sidebar--{{mode}}\"\n      [class.ng-sidebar--docked]=\"_isDocked\"\n      [class.ng-sidebar--inert]=\"_isInert\"\n      [class.ng-sidebar--animate]=\"animate\"\n      [ngClass]=\"sidebarClass\"\n      [ngStyle]=\"_getStyle()\">\n      <ng-content></ng-content>\n    </aside>\n  ", changeDetection: ChangeDetectionStrategy.OnPush, styles: ["\n    .ng-sidebar {\n      -webkit-overflow-scrolling: touch;\n      overflow: auto;\n      pointer-events: auto;\n      position: absolute;\n      touch-action: auto;\n      will-change: initial;\n      z-index: 2;\n    }\n\n    .ng-sidebar--left {\n      bottom: 0;\n      left: 0;\n      top: 0;\n    }\n\n    .ng-sidebar--right {\n      bottom: 0;\n      right: 0;\n      top: 0;\n    }\n\n    .ng-sidebar--top {\n      left: 0;\n      right: 0;\n      top: 0;\n    }\n\n    .ng-sidebar--bottom {\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n\n    .ng-sidebar--inert {\n      pointer-events: none;\n      touch-action: none;\n      will-change: transform;\n    }\n\n    .ng-sidebar--animate {\n      -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 0, 0.3, 1);\n      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);\n    }\n  "] }]
    }], function () { return [{ type: ɵngcc1.SidebarContainer, decorators: [{
                type: Optional
            }] }, { type: ɵngcc0.ChangeDetectorRef }, { type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }]; }, { opened: [{
            type: Input
        }], openedChange: [{
            type: Output
        }], mode: [{
            type: Input
        }], dock: [{
            type: Input
        }], dockedSize: [{
            type: Input
        }], position: [{
            type: Input
        }], animate: [{
            type: Input
        }], autoCollapseOnInit: [{
            type: Input
        }], trapFocus: [{
            type: Input
        }], autoFocus: [{
            type: Input
        }], showBackdrop: [{
            type: Input
        }], closeOnClickBackdrop: [{
            type: Input
        }], closeOnClickOutside: [{
            type: Input
        }], keyClose: [{
            type: Input
        }], keyCode: [{
            type: Input
        }], onContentInit: [{
            type: Output
        }], onOpenStart: [{
            type: Output
        }], onOpened: [{
            type: Output
        }], onCloseStart: [{
            type: Output
        }], onClosed: [{
            type: Output
        }], onTransitionEnd: [{
            type: Output
        }], onModeChange: [{
            type: Output
        }], onPositionChange: [{
            type: Output
        }], _onRerender: [{
            type: Output
        }], autoCollapseHeight: [{
            type: Input
        }], autoCollapseWidth: [{
            type: Input
        }], sidebarClass: [{
            type: Input
        }], ariaLabel: [{
            type: Input
        }], _elSidebar: [{
            type: ViewChild,
            args: ['sidebar', { static: false }]
        }] }); })();
    return Sidebar;
}());
export { Sidebar };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VzIjpbInNpZGViYXIuY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBT087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUFnQjtBQUNoQjtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XG59O1xudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbn07XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPcHRpb25hbCwgT3V0cHV0LCBQTEFURk9STV9JRCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTaWRlYmFyQ29udGFpbmVyIH0gZnJvbSAnLi9zaWRlYmFyLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgaXNMVFIsIGlzSU9TIH0gZnJvbSAnLi91dGlscyc7XG52YXIgU2lkZWJhciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lkZWJhcihfY29udGFpbmVyLCBfcmVmLCBwbGF0Zm9ybUlkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IF9jb250YWluZXI7XG4gICAgICAgIHRoaXMuX3JlZiA9IF9yZWY7XG4gICAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMub3BlbmVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLm1vZGUgPSAnb3Zlcic7XG4gICAgICAgIHRoaXMuZG9jayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRvY2tlZFNpemUgPSAnMHB4JztcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9ICdzdGFydCc7XG4gICAgICAgIHRoaXMuYW5pbWF0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYXV0b0NvbGxhcHNlT25Jbml0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50cmFwRm9jdXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hdXRvRm9jdXMgPSB0cnVlO1xuICAgICAgICB0aGlzLnNob3dCYWNrZHJvcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3NlT25DbGlja0JhY2tkcm9wID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VPbkNsaWNrT3V0c2lkZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmtleUNsb3NlID0gZmFsc2U7XG4gICAgICAgIHRoaXMua2V5Q29kZSA9IDI3O1xuICAgICAgICB0aGlzLm9uQ29udGVudEluaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMub25PcGVuU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMub25PcGVuZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMub25DbG9zZVN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLm9uQ2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkVuZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5vbk1vZGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMub25Qb3NpdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5fb25SZXJlbmRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5fZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCcgK1xuICAgICAgICAgICAgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXhdLCBbY29udGVudGVkaXRhYmxlXSc7XG4gICAgICAgIHRoaXMuX3RhYkluZGV4QXR0ciA9ICdfX3RhYmluZGV4X18nO1xuICAgICAgICB0aGlzLl90YWJJbmRleEluZGljYXRvckF0dHIgPSAnX19uZ3NpZGViYXItdGFiaW5kZXhfXyc7XG4gICAgICAgIHRoaXMuX2NsaWNrRXZlbnQgPSAnY2xpY2snO1xuICAgICAgICB0aGlzLl9vbkNsaWNrT3V0c2lkZUF0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX29uS2V5RG93bkF0dGFjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX29uUmVzaXplQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKCF0aGlzLl9jb250YWluZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignPG5nLXNpZGViYXI+IG11c3QgYmUgaW5zaWRlIGEgPG5nLXNpZGViYXItY29udGFpbmVyPi4gJyArXG4gICAgICAgICAgICAgICAgJ1NlZSBodHRwczovL2dpdGh1Yi5jb20vYXJrb24vbmctc2lkZWJhciN1c2FnZSBmb3IgbW9yZSBpbmZvLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2lzQnJvd3NlciA9IGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpO1xuICAgICAgICBpZiAodGhpcy5faXNCcm93c2VyICYmIGlzSU9TKCkgJiYgISgnb25jbGljaycgaW4gd2luZG93KSkge1xuICAgICAgICAgICAgdGhpcy5fY2xpY2tFdmVudCA9ICd0b3VjaHN0YXJ0JztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9ub3JtYWxpemVQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLm9wZW4gPSB0aGlzLm9wZW4uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fb25UcmFuc2l0aW9uRW5kID0gdGhpcy5fb25UcmFuc2l0aW9uRW5kLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX29uRm9jdXNUcmFwID0gdGhpcy5fb25Gb2N1c1RyYXAuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fb25DbGlja091dHNpZGUgPSB0aGlzLl9vbkNsaWNrT3V0c2lkZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9vbktleURvd24gPSB0aGlzLl9vbktleURvd24uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fY29sbGFwc2UgPSB0aGlzLl9jb2xsYXBzZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBTaWRlYmFyLnByb3RvdHlwZS5uZ09uSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zaG91bGRBbmltYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5fYWRkU2lkZWJhcih0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuYXV0b0NvbGxhcHNlT25Jbml0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xsYXBzZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5uZ0FmdGVyQ29udGVudEluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub25Db250ZW50SW5pdC5lbWl0KCk7XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5uZ09uQ2hhbmdlcyA9IGZ1bmN0aW9uIChjaGFuZ2VzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZXNbJ2FuaW1hdGUnXSAmJiB0aGlzLl9zaG91bGRBbmltYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zaG91bGRBbmltYXRlID0gY2hhbmdlc1snYW5pbWF0ZSddLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1snY2xvc2VPbkNsaWNrT3V0c2lkZSddKSB7XG4gICAgICAgICAgICBpZiAoY2hhbmdlc1snY2xvc2VPbkNsaWNrT3V0c2lkZSddLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRDbG9zZUNsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lDbG9zZUNsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1sna2V5Q2xvc2UnXSkge1xuICAgICAgICAgICAgaWYgKGNoYW5nZXNbJ2tleUNsb3NlJ10uY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdENsb3NlS2V5RG93bkxpc3RlbmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXN0cm95Q2xvc2VLZXlEb3duTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1sncG9zaXRpb24nXSkge1xuICAgICAgICAgICAgdGhpcy5fbm9ybWFsaXplUG9zaXRpb24oKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm9uUG9zaXRpb25DaGFuZ2UuZW1pdChjaGFuZ2VzWydwb3NpdGlvbiddLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1snbW9kZSddKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5vbk1vZGVDaGFuZ2UuZW1pdChjaGFuZ2VzWydtb2RlJ10uY3VycmVudFZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VzWydkb2NrJ10pIHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlclJlcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZXNbJ29wZW5lZCddKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2hvdWxkQW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvdWxkQW5pbWF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoYW5nZXNbJ29wZW5lZCddLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VzWydhdXRvQ29sbGFwc2VIZWlnaHQnXSB8fCBjaGFuZ2VzWydhdXRvQ29sbGFwc2VXaWR0aCddKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0Q29sbGFwc2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUubmdPbkRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGVzdHJveUNsb3NlTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3lDb2xsYXBzZUxpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9jb250YWluZXIuX3JlbW92ZVNpZGViYXIodGhpcyk7XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3BlbmVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgICAgdGhpcy5vbk9wZW5TdGFydC5lbWl0KCk7XG4gICAgICAgIHRoaXMuX3JlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmFuaW1hdGUgJiYgIV90aGlzLl9pc01vZGVTbGlkZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLl9lbFNpZGViYXIubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgX3RoaXMuX29uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fc2V0Rm9jdXNlZCgpO1xuICAgICAgICAgICAgICAgIF90aGlzLl9pbml0Q2xvc2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMub3BlbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uT3BlbmVkLmVtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgICAgIHRoaXMub25DbG9zZVN0YXJ0LmVtaXQoKTtcbiAgICAgICAgdGhpcy5fcmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuYW5pbWF0ZSAmJiAhX3RoaXMuX2lzTW9kZVNsaWRlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2VsU2lkZWJhci5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBfdGhpcy5fb25UcmFuc2l0aW9uRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLl9zZXRGb2N1c2VkKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2Rlc3Ryb3lDbG9zZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgIGlmICghX3RoaXMub3BlbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9uQ2xvc2VkLmVtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUudHJpZ2dlclJlcmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuX29uUmVyZW5kZXIuZW1pdCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLl9nZXRTdHlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybVN0eWxlID0gJyc7XG4gICAgICAgIGlmICghdGhpcy5vcGVuZWQpIHtcbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1EaXIgPSAndHJhbnNsYXRlJyArICh0aGlzLl9pc0xlZnRPclJpZ2h0ID8gJ1gnIDogJ1knKTtcbiAgICAgICAgICAgIHZhciB0cmFuc2xhdGVBbXQgPSAodGhpcy5faXNMZWZ0T3JUb3AgPyAnLScgOiAnJykgKyBcIjEwMCVcIjtcbiAgICAgICAgICAgIHRyYW5zZm9ybVN0eWxlID0gdHJhbnNmb3JtRGlyICsgXCIoXCIgKyB0cmFuc2xhdGVBbXQgKyBcIilcIjtcbiAgICAgICAgICAgIGlmICh0aGlzLmRvY2sgJiYgdGhpcy5fZG9ja2VkU2l6ZSA+IDAgJiYgISh0aGlzLl9pc01vZGVTbGlkZSAmJiB0aGlzLm9wZW5lZCkpIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHlsZSArPSBcIiBcIiArIHRyYW5zZm9ybURpciArIFwiKFwiICsgKHRoaXMuX2lzTGVmdE9yVG9wID8gJysnIDogJy0nKSArIHRoaXMuZG9ja2VkU2l6ZSArIFwiKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWJraXRUcmFuc2Zvcm06IHRyYW5zZm9ybVN0eWxlLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1TdHlsZVxuICAgICAgICB9O1xuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuX29uVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5fZWxTaWRlYmFyLm5hdGl2ZUVsZW1lbnQgJiYgZS5wcm9wZXJ0eU5hbWUuZW5kc1dpdGgoJ3RyYW5zZm9ybScpKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRGb2N1c2VkKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5vcGVuZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0Q2xvc2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uT3BlbmVkLmVtaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lDbG9zZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZWQuZW1pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vblRyYW5zaXRpb25FbmQuZW1pdCgpO1xuICAgICAgICAgICAgdGhpcy5fZWxTaWRlYmFyLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRoaXMuX29uVHJhbnNpdGlvbkVuZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTaWRlYmFyLnByb3RvdHlwZSwgXCJfc2hvdWxkVHJhcEZvY3VzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuZWQgJiYgdGhpcy50cmFwRm9jdXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFNpZGViYXIucHJvdG90eXBlLl9mb2N1c0ZpcnN0SXRlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ZvY3VzYWJsZUVsZW1lbnRzICYmIHRoaXMuX2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2ZvY3VzYWJsZUVsZW1lbnRzWzBdLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLl9vbkZvY3VzVHJhcCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLl9zaG91bGRUcmFwRm9jdXMgJiYgIXRoaXMuX2VsU2lkZWJhci5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgdGhpcy5fZm9jdXNGaXJzdEl0ZW0oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuX3NldEZvY3VzZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzYWJsZUVsZW1lbnRzID0gQXJyYXkuZnJvbSh0aGlzLl9lbFNpZGViYXIubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuX2ZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKSk7XG4gICAgICAgIGlmICh0aGlzLm9wZW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fZm9jdXNlZEJlZm9yZU9wZW4gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMuX2ZvY3VzYWJsZUVsZW1lbnRzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBlbCA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICB2YXIgcHJldlRhYkluZGV4ID0gZWwuZ2V0QXR0cmlidXRlKHRoaXMuX3RhYkluZGV4QXR0cik7XG4gICAgICAgICAgICAgICAgdmFyIHdhc1RhYkluZGV4U2V0ID0gZWwuZ2V0QXR0cmlidXRlKHRoaXMuX3RhYkluZGV4SW5kaWNhdG9yQXR0cikgIT09IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZUYWJJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgcHJldlRhYkluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuX3RhYkluZGV4QXR0cik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdhc1RhYkluZGV4U2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuX3RhYkluZGV4SW5kaWNhdG9yQXR0cik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b0ZvY3VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9jdXNGaXJzdEl0ZW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1c1RyYXAsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgX2IgPSAwLCBfYyA9IHRoaXMuX2ZvY3VzYWJsZUVsZW1lbnRzOyBfYiA8IF9jLmxlbmd0aDsgX2IrKykge1xuICAgICAgICAgICAgICAgIHZhciBlbCA9IF9jW19iXTtcbiAgICAgICAgICAgICAgICB2YXIgZXhpc3RpbmdUYWJJbmRleCA9IGVsLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKHRoaXMuX3RhYkluZGV4SW5kaWNhdG9yQXR0ciwgJycpO1xuICAgICAgICAgICAgICAgIGlmIChleGlzdGluZ1RhYkluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSh0aGlzLl90YWJJbmRleEF0dHIsIGV4aXN0aW5nVGFiSW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5fb25Gb2N1c1RyYXAsIHRydWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2ZvY3VzZWRCZWZvcmVPcGVuICYmIHRoaXMuYXV0b0ZvY3VzICYmIHRoaXMuX2lzTW9kZU92ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb2N1c2VkQmVmb3JlT3Blbi5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZvY3VzZWRCZWZvcmVPcGVuID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuX2luaXRDbG9zZUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faW5pdENsb3NlQ2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9pbml0Q2xvc2VLZXlEb3duTGlzdGVuZXIoKTtcbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLl9pbml0Q2xvc2VDbGlja0xpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcGVuZWQgJiYgX3RoaXMuY2xvc2VPbkNsaWNrT3V0c2lkZSAmJiAhX3RoaXMuX29uQ2xpY2tPdXRzaWRlQXR0YWNoZWQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKF90aGlzLl9jbGlja0V2ZW50LCBfdGhpcy5fb25DbGlja091dHNpZGUpO1xuICAgICAgICAgICAgICAgIF90aGlzLl9vbkNsaWNrT3V0c2lkZUF0dGFjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5faW5pdENsb3NlS2V5RG93bkxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vcGVuZWQgJiYgX3RoaXMua2V5Q2xvc2UgJiYgIV90aGlzLl9vbktleURvd25BdHRhY2hlZCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfdGhpcy5fb25LZXlEb3duKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5fb25LZXlEb3duQXR0YWNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLl9kZXN0cm95Q2xvc2VMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2Rlc3Ryb3lDbG9zZUNsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fZGVzdHJveUNsb3NlS2V5RG93bkxpc3RlbmVyKCk7XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5fZGVzdHJveUNsb3NlQ2xpY2tMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX29uQ2xpY2tPdXRzaWRlQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5fY2xpY2tFdmVudCwgdGhpcy5fb25DbGlja091dHNpZGUpO1xuICAgICAgICAgICAgdGhpcy5fb25DbGlja091dHNpZGVBdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5fZGVzdHJveUNsb3NlS2V5RG93bkxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fb25LZXlEb3duQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9vbktleURvd24pO1xuICAgICAgICAgICAgdGhpcy5fb25LZXlEb3duQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuX29uQ2xpY2tPdXRzaWRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX29uQ2xpY2tPdXRzaWRlQXR0YWNoZWQgJiYgdGhpcy5fZWxTaWRlYmFyICYmICF0aGlzLl9lbFNpZGViYXIubmF0aXZlRWxlbWVudC5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhci5wcm90b3R5cGUuX29uS2V5RG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gdGhpcy5rZXlDb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLl9pbml0Q29sbGFwc2VMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmF1dG9Db2xsYXBzZUhlaWdodCB8fCB0aGlzLmF1dG9Db2xsYXBzZVdpZHRoKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLl9vblJlc2l6ZUF0dGFjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfdGhpcy5fY29sbGFwc2UpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25SZXNpemVBdHRhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNpZGViYXIucHJvdG90eXBlLl9kZXN0cm95Q29sbGFwc2VMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9vblJlc2l6ZUF0dGFjaGVkKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fY29sbGFwc2UpO1xuICAgICAgICAgICAgdGhpcy5fb25SZXNpemVBdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5fY29sbGFwc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3aW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIHZhciB3aW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBpZiAodGhpcy5hdXRvQ29sbGFwc2VIZWlnaHQpIHtcbiAgICAgICAgICAgIGlmICh3aW5IZWlnaHQgPD0gdGhpcy5hdXRvQ29sbGFwc2VIZWlnaHQgJiYgdGhpcy5vcGVuZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93YXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHdpbkhlaWdodCA+IHRoaXMuYXV0b0NvbGxhcHNlSGVpZ2h0ICYmIHRoaXMuX3dhc0NvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dhc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmF1dG9Db2xsYXBzZVdpZHRoKSB7XG4gICAgICAgICAgICBpZiAod2luV2lkdGggPD0gdGhpcy5hdXRvQ29sbGFwc2VXaWR0aCAmJiB0aGlzLm9wZW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dhc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAod2luV2lkdGggPiB0aGlzLmF1dG9Db2xsYXBzZVdpZHRoICYmIHRoaXMuX3dhc0NvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dhc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2lkZWJhci5wcm90b3R5cGUsIFwiX2hlaWdodFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2VsU2lkZWJhci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRG9ja2VkID8gdGhpcy5fZG9ja2VkU2l6ZSA6IHRoaXMuX2VsU2lkZWJhci5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2lkZWJhci5wcm90b3R5cGUsIFwiX3dpZHRoXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZWxTaWRlYmFyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNEb2NrZWQgPyB0aGlzLl9kb2NrZWRTaXplIDogdGhpcy5fZWxTaWRlYmFyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNpZGViYXIucHJvdG90eXBlLCBcIl9kb2NrZWRTaXplXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLmRvY2tlZFNpemUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2lkZWJhci5wcm90b3R5cGUsIFwiX2lzTW9kZU92ZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdvdmVyJztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNpZGViYXIucHJvdG90eXBlLCBcIl9pc01vZGVQdXNoXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb2RlID09PSAncHVzaCc7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTaWRlYmFyLnByb3RvdHlwZSwgXCJfaXNNb2RlU2xpZGVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdzbGlkZSc7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTaWRlYmFyLnByb3RvdHlwZSwgXCJfaXNEb2NrZWRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRvY2sgJiYgdGhpcy5kb2NrZWRTaXplICYmICF0aGlzLm9wZW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNpZGViYXIucHJvdG90eXBlLCBcIl9pc0xlZnRPclRvcFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24gPT09ICdsZWZ0JyB8fCB0aGlzLnBvc2l0aW9uID09PSAndG9wJztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNpZGViYXIucHJvdG90eXBlLCBcIl9pc0xlZnRPclJpZ2h0XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbiA9PT0gJ2xlZnQnIHx8IHRoaXMucG9zaXRpb24gPT09ICdyaWdodCc7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTaWRlYmFyLnByb3RvdHlwZSwgXCJfaXNJbmVydFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLm9wZW5lZCAmJiAhdGhpcy5kb2NrO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBTaWRlYmFyLnByb3RvdHlwZS5fbm9ybWFsaXplUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsdHIgPSBpc0xUUigpO1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGx0ciA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBsdHIgPyAncmlnaHQnIDogJ2xlZnQnO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwib3BlbmVkXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIE91dHB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRXZlbnRFbWl0dGVyKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcIm9wZW5lZENoYW5nZVwiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBJbnB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgU3RyaW5nKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcIm1vZGVcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwiZG9ja1wiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBJbnB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgU3RyaW5nKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcImRvY2tlZFNpemVcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIFN0cmluZylcbiAgICBdLCBTaWRlYmFyLnByb3RvdHlwZSwgXCJwb3NpdGlvblwiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBJbnB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgQm9vbGVhbilcbiAgICBdLCBTaWRlYmFyLnByb3RvdHlwZSwgXCJhbmltYXRlXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBOdW1iZXIpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwiYXV0b0NvbGxhcHNlSGVpZ2h0XCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBOdW1iZXIpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwiYXV0b0NvbGxhcHNlV2lkdGhcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwiYXV0b0NvbGxhcHNlT25Jbml0XCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBTdHJpbmcpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwic2lkZWJhckNsYXNzXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBTdHJpbmcpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwiYXJpYUxhYmVsXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBCb29sZWFuKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcInRyYXBGb2N1c1wiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBJbnB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgQm9vbGVhbilcbiAgICBdLCBTaWRlYmFyLnByb3RvdHlwZSwgXCJhdXRvRm9jdXNcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwic2hvd0JhY2tkcm9wXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBCb29sZWFuKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcImNsb3NlT25DbGlja0JhY2tkcm9wXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBCb29sZWFuKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcImNsb3NlT25DbGlja091dHNpZGVcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwia2V5Q2xvc2VcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE51bWJlcilcbiAgICBdLCBTaWRlYmFyLnByb3RvdHlwZSwgXCJrZXlDb2RlXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIE91dHB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRXZlbnRFbWl0dGVyKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcIm9uQ29udGVudEluaXRcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgT3V0cHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBFdmVudEVtaXR0ZXIpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwib25PcGVuU3RhcnRcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgT3V0cHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBFdmVudEVtaXR0ZXIpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwib25PcGVuZWRcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgT3V0cHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBFdmVudEVtaXR0ZXIpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwib25DbG9zZVN0YXJ0XCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIE91dHB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRXZlbnRFbWl0dGVyKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcIm9uQ2xvc2VkXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIE91dHB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRXZlbnRFbWl0dGVyKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcIm9uVHJhbnNpdGlvbkVuZFwiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBPdXRwdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEV2ZW50RW1pdHRlcilcbiAgICBdLCBTaWRlYmFyLnByb3RvdHlwZSwgXCJvbk1vZGVDaGFuZ2VcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgT3V0cHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBFdmVudEVtaXR0ZXIpXG4gICAgXSwgU2lkZWJhci5wcm90b3R5cGUsIFwib25Qb3NpdGlvbkNoYW5nZVwiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBPdXRwdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEV2ZW50RW1pdHRlcilcbiAgICBdLCBTaWRlYmFyLnByb3RvdHlwZSwgXCJfb25SZXJlbmRlclwiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBWaWV3Q2hpbGQoJ3NpZGViYXInLCB7IHN0YXRpYzogZmFsc2UgfSksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBFbGVtZW50UmVmKVxuICAgIF0sIFNpZGViYXIucHJvdG90eXBlLCBcIl9lbFNpZGViYXJcIiwgdm9pZCAwKTtcbiAgICBTaWRlYmFyID0gX19kZWNvcmF0ZShbXG4gICAgICAgIENvbXBvbmVudCh7XG4gICAgICAgICAgICBzZWxlY3RvcjogJ25nLXNpZGViYXInLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICAgIDxhc2lkZSAjc2lkZWJhclxcbiAgICAgIHJvbGU9XFxcImNvbXBsZW1lbnRhcnlcXFwiXFxuICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVxcXCIhb3BlbmVkXFxcIlxcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVxcXCJhcmlhTGFiZWxcXFwiXFxuICAgICAgY2xhc3M9XFxcIm5nLXNpZGViYXIgbmctc2lkZWJhci0te3tvcGVuZWQgPyAnb3BlbmVkJyA6ICdjbG9zZWQnfX0gbmctc2lkZWJhci0te3twb3NpdGlvbn19IG5nLXNpZGViYXItLXt7bW9kZX19XFxcIlxcbiAgICAgIFtjbGFzcy5uZy1zaWRlYmFyLS1kb2NrZWRdPVxcXCJfaXNEb2NrZWRcXFwiXFxuICAgICAgW2NsYXNzLm5nLXNpZGViYXItLWluZXJ0XT1cXFwiX2lzSW5lcnRcXFwiXFxuICAgICAgW2NsYXNzLm5nLXNpZGViYXItLWFuaW1hdGVdPVxcXCJhbmltYXRlXFxcIlxcbiAgICAgIFtuZ0NsYXNzXT1cXFwic2lkZWJhckNsYXNzXFxcIlxcbiAgICAgIFtuZ1N0eWxlXT1cXFwiX2dldFN0eWxlKClcXFwiPlxcbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cXG4gICAgPC9hc2lkZT5cXG4gIFwiLFxuICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG4gICAgLm5nLXNpZGViYXIge1xcbiAgICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcXG4gICAgICBvdmVyZmxvdzogYXV0bztcXG4gICAgICBwb2ludGVyLWV2ZW50czogYXV0bztcXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgdG91Y2gtYWN0aW9uOiBhdXRvO1xcbiAgICAgIHdpbGwtY2hhbmdlOiBpbml0aWFsO1xcbiAgICAgIHotaW5kZXg6IDI7XFxuICAgIH1cXG5cXG4gICAgLm5nLXNpZGViYXItLWxlZnQge1xcbiAgICAgIGJvdHRvbTogMDtcXG4gICAgICBsZWZ0OiAwO1xcbiAgICAgIHRvcDogMDtcXG4gICAgfVxcblxcbiAgICAubmctc2lkZWJhci0tcmlnaHQge1xcbiAgICAgIGJvdHRvbTogMDtcXG4gICAgICByaWdodDogMDtcXG4gICAgICB0b3A6IDA7XFxuICAgIH1cXG5cXG4gICAgLm5nLXNpZGViYXItLXRvcCB7XFxuICAgICAgbGVmdDogMDtcXG4gICAgICByaWdodDogMDtcXG4gICAgICB0b3A6IDA7XFxuICAgIH1cXG5cXG4gICAgLm5nLXNpZGViYXItLWJvdHRvbSB7XFxuICAgICAgYm90dG9tOiAwO1xcbiAgICAgIGxlZnQ6IDA7XFxuICAgICAgcmlnaHQ6IDA7XFxuICAgIH1cXG5cXG4gICAgLm5nLXNpZGViYXItLWluZXJ0IHtcXG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gICAgICB0b3VjaC1hY3Rpb246IG5vbmU7XFxuICAgICAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcXG4gICAgfVxcblxcbiAgICAubmctc2lkZWJhci0tYW5pbWF0ZSB7XFxuICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAwLjNzIGN1YmljLWJlemllcigwLCAwLCAwLjMsIDEpO1xcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGN1YmljLWJlemllcigwLCAwLCAwLjMsIDEpO1xcbiAgICB9XFxuICBcIl0sXG4gICAgICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxuICAgICAgICB9KSxcbiAgICAgICAgX19wYXJhbSgwLCBPcHRpb25hbCgpKSxcbiAgICAgICAgX19wYXJhbSgyLCBJbmplY3QoUExBVEZPUk1fSUQpKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtTaWRlYmFyQ29udGFpbmVyLFxuICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICBPYmplY3RdKVxuICAgIF0sIFNpZGViYXIpO1xuICAgIHJldHVybiBTaWRlYmFyO1xufSgpKTtcbmV4cG9ydCB7IFNpZGViYXIgfTtcbiJdfQ==