import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from '@angular/common';

function SidebarContainer_div_0_Template(rf, ctx) { if (rf & 1) {
    var _r2 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 2);
    ɵngcc0.ɵɵlistener("click", function SidebarContainer_div_0_Template_div_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r2); var ctx_r1 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r1._onBackdropClicked()); });
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    var ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngClass", ctx_r0.backdropClass);
} }
var _c0 = [[["ng-sidebar"], ["", "ng-sidebar", ""]], [["", "ng-sidebar-content", ""]]];
var _c1 = ["ng-sidebar,[ng-sidebar]", "[ng-sidebar-content]"];
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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
var SidebarContainer = (function () {
    function SidebarContainer(_ref, platformId) {
        this._ref = _ref;
        this.animate = true;
        this.allowSidebarBackdropControl = true;
        this.showBackdrop = false;
        this.showBackdropChange = new EventEmitter();
        this.onBackdropClicked = new EventEmitter();
        this._sidebars = [];
        this._isBrowser = isPlatformBrowser(platformId);
    }
    SidebarContainer.prototype.ngAfterContentInit = function () {
        if (!this._isBrowser) {
            return;
        }
        this._onToggle();
    };
    SidebarContainer.prototype.ngOnChanges = function (changes) {
        if (!this._isBrowser) {
            return;
        }
        if (changes['showBackdrop']) {
            this.showBackdropChange.emit(changes['showBackdrop'].currentValue);
        }
    };
    SidebarContainer.prototype.ngOnDestroy = function () {
        if (!this._isBrowser) {
            return;
        }
        this._unsubscribe();
    };
    SidebarContainer.prototype._addSidebar = function (sidebar) {
        this._sidebars.push(sidebar);
        this._subscribe(sidebar);
    };
    SidebarContainer.prototype._removeSidebar = function (sidebar) {
        var index = this._sidebars.indexOf(sidebar);
        if (index !== -1) {
            this._sidebars.splice(index, 1);
        }
    };
    SidebarContainer.prototype._getContentStyle = function () {
        var left = 0, right = 0, top = 0, bottom = 0;
        var transformStyle = '';
        var heightStyle = '';
        var widthStyle = '';
        for (var _i = 0, _a = this._sidebars; _i < _a.length; _i++) {
            var sidebar = _a[_i];
            if (sidebar._isModeSlide) {
                if (sidebar.opened) {
                    var transformDir = sidebar._isLeftOrRight ? 'X' : 'Y';
                    var transformAmt = "" + (sidebar._isLeftOrTop ? '' : '-') + (sidebar._isLeftOrRight ? sidebar._width : sidebar._height);
                    transformStyle = "translate" + transformDir + "(" + transformAmt + "px)";
                }
            }
            if ((sidebar._isModePush && sidebar.opened) || sidebar.dock) {
                var paddingAmt = 0;
                if (sidebar._isModeSlide && sidebar.opened) {
                    if (sidebar._isLeftOrRight) {
                        widthStyle = '100%';
                    }
                    else {
                        heightStyle = '100%';
                    }
                }
                else {
                    if (sidebar._isDocked || (sidebar._isModeOver && sidebar.dock)) {
                        paddingAmt = sidebar._dockedSize;
                    }
                    else {
                        paddingAmt = sidebar._isLeftOrRight ? sidebar._width : sidebar._height;
                    }
                }
                switch (sidebar.position) {
                    case 'left':
                        left = Math.max(left, paddingAmt);
                        break;
                    case 'right':
                        right = Math.max(right, paddingAmt);
                        break;
                    case 'top':
                        top = Math.max(top, paddingAmt);
                        break;
                    case 'bottom':
                        bottom = Math.max(bottom, paddingAmt);
                        break;
                }
            }
        }
        return {
            padding: top + "px " + right + "px " + bottom + "px " + left + "px",
            webkitTransform: transformStyle,
            transform: transformStyle,
            height: heightStyle,
            width: widthStyle
        };
    };
    SidebarContainer.prototype._onBackdropClicked = function () {
        var backdropClicked = false;
        for (var _i = 0, _a = this._sidebars; _i < _a.length; _i++) {
            var sidebar = _a[_i];
            if (sidebar.opened && sidebar.showBackdrop && sidebar.closeOnClickBackdrop) {
                sidebar.close();
                backdropClicked = true;
            }
        }
        if (backdropClicked) {
            this.onBackdropClicked.emit();
        }
    };
    SidebarContainer.prototype._subscribe = function (sidebar) {
        var _this = this;
        sidebar.onOpenStart.subscribe(function () { return _this._onToggle(); });
        sidebar.onOpened.subscribe(function () { return _this._markForCheck(); });
        sidebar.onCloseStart.subscribe(function () { return _this._onToggle(); });
        sidebar.onClosed.subscribe(function () { return _this._markForCheck(); });
        sidebar.onModeChange.subscribe(function () { return _this._markForCheck(); });
        sidebar.onPositionChange.subscribe(function () { return _this._markForCheck(); });
        sidebar._onRerender.subscribe(function () { return _this._markForCheck(); });
    };
    SidebarContainer.prototype._unsubscribe = function () {
        for (var _i = 0, _a = this._sidebars; _i < _a.length; _i++) {
            var sidebar = _a[_i];
            sidebar.onOpenStart.unsubscribe();
            sidebar.onOpened.unsubscribe();
            sidebar.onCloseStart.unsubscribe();
            sidebar.onClosed.unsubscribe();
            sidebar.onModeChange.unsubscribe();
            sidebar.onPositionChange.unsubscribe();
            sidebar._onRerender.unsubscribe();
        }
    };
    SidebarContainer.prototype._onToggle = function () {
        var _this = this;
        if (this._sidebars.length > 0 && this.allowSidebarBackdropControl) {
            var hasOpen = this._sidebars.some(function (sidebar) { return sidebar.opened && sidebar.showBackdrop; });
            this.showBackdrop = hasOpen;
            this.showBackdropChange.emit(hasOpen);
        }
        setTimeout(function () {
            _this._markForCheck();
        });
    };
    SidebarContainer.prototype._markForCheck = function () {
        this._ref.markForCheck();
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], SidebarContainer.prototype, "animate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], SidebarContainer.prototype, "allowSidebarBackdropControl", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], SidebarContainer.prototype, "showBackdrop", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], SidebarContainer.prototype, "showBackdropChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], SidebarContainer.prototype, "onBackdropClicked", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], SidebarContainer.prototype, "contentClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], SidebarContainer.prototype, "backdropClass", void 0);
    SidebarContainer = __decorate([ __param(1, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [ChangeDetectorRef,
            Object])
    ], SidebarContainer);
SidebarContainer.ɵfac = function SidebarContainer_Factory(t) { return new (t || SidebarContainer)(ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ChangeDetectorRef), ɵngcc0.ɵɵdirectiveInject(PLATFORM_ID)); };
SidebarContainer.ɵcmp = /*@__PURE__*/ ɵngcc0.ɵɵdefineComponent({ type: SidebarContainer, selectors: [["ng-sidebar-container"]], inputs: { animate: "animate", allowSidebarBackdropControl: "allowSidebarBackdropControl", showBackdrop: "showBackdrop", contentClass: "contentClass", backdropClass: "backdropClass" }, outputs: { showBackdropChange: "showBackdropChange", onBackdropClicked: "onBackdropClicked" }, features: [ɵngcc0.ɵɵNgOnChangesFeature], ngContentSelectors: _c1, decls: 4, vars: 5, consts: [["aria-hidden", "true", "class", "ng-sidebar__backdrop", 3, "ngClass", "click", 4, "ngIf"], [1, "ng-sidebar__content", 3, "ngClass", "ngStyle"], ["aria-hidden", "true", 1, "ng-sidebar__backdrop", 3, "ngClass", "click"]], template: function SidebarContainer_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵprojectionDef(_c0);
        ɵngcc0.ɵɵtemplate(0, SidebarContainer_div_0_Template, 1, 1, "div", 0);
        ɵngcc0.ɵɵprojection(1);
        ɵngcc0.ɵɵelementStart(2, "div", 1);
        ɵngcc0.ɵɵprojection(3, 1);
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵproperty("ngIf", ctx.showBackdrop);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵclassProp("ng-sidebar__content--animate", ctx.animate);
        ɵngcc0.ɵɵproperty("ngClass", ctx.contentClass)("ngStyle", ctx._getContentStyle());
    } }, dependencies: [ɵngcc1.NgClass, ɵngcc1.NgIf, ɵngcc1.NgStyle], styles: ["[_nghost-%COMP%] {\n      box-sizing: border-box;\n      display: block;\n      position: relative;\n      height: 100%;\n      width: 100%;\n      overflow: hidden;\n    }\n\n    .ng-sidebar__backdrop[_ngcontent-%COMP%] {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      background: #000;\n      opacity: 0.75;\n      pointer-events: auto;\n      z-index: 1;\n    }\n\n    .ng-sidebar__content[_ngcontent-%COMP%] {\n      -webkit-overflow-scrolling: touch;\n      overflow: auto;\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n\n    .ng-sidebar__content--animate[_ngcontent-%COMP%] {\n      -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 0, 0.3, 1), padding 0.3s cubic-bezier(0, 0, 0.3, 1);\n      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1), padding 0.3s cubic-bezier(0, 0, 0.3, 1);\n    }"], changeDetection: 0 });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(SidebarContainer, [{
        type: Component,
        args: [{ selector: 'ng-sidebar-container', template: "\n    <div *ngIf=\"showBackdrop\"\n      aria-hidden=\"true\"\n      class=\"ng-sidebar__backdrop\"\n      [ngClass]=\"backdropClass\"\n      (click)=\"_onBackdropClicked()\"></div>\n\n    <ng-content select=\"ng-sidebar,[ng-sidebar]\"></ng-content>\n\n    <div class=\"ng-sidebar__content\"\n      [class.ng-sidebar__content--animate]=\"animate\"\n      [ngClass]=\"contentClass\"\n      [ngStyle]=\"_getContentStyle()\">\n      <ng-content select=\"[ng-sidebar-content]\"></ng-content>\n    </div>\n  ", changeDetection: ChangeDetectionStrategy.OnPush, styles: ["\n    :host {\n      box-sizing: border-box;\n      display: block;\n      position: relative;\n      height: 100%;\n      width: 100%;\n      overflow: hidden;\n    }\n\n    .ng-sidebar__backdrop {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      background: #000;\n      opacity: 0.75;\n      pointer-events: auto;\n      z-index: 1;\n    }\n\n    .ng-sidebar__content {\n      -webkit-overflow-scrolling: touch;\n      overflow: auto;\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n\n    .ng-sidebar__content--animate {\n      -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 0, 0.3, 1), padding 0.3s cubic-bezier(0, 0, 0.3, 1);\n      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1), padding 0.3s cubic-bezier(0, 0, 0.3, 1);\n    }\n  "] }]
    }], function () { return [{ type: ɵngcc0.ChangeDetectorRef }, { type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }]; }, { animate: [{
            type: Input
        }], allowSidebarBackdropControl: [{
            type: Input
        }], showBackdrop: [{
            type: Input
        }], showBackdropChange: [{
            type: Output
        }], onBackdropClicked: [{
            type: Output
        }], contentClass: [{
            type: Input
        }], backdropClass: [{
            type: Input
        }] }); })();
    return SidebarContainer;
}());
export { SidebarContainer };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZWJhci1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlcyI6WyJzaWRlYmFyLWNvbnRhaW5lci5jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBT087QUFDUDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUF5QjtBQUN6QjtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XG59O1xudmFyIF9fcGFyYW0gPSAodGhpcyAmJiB0aGlzLl9fcGFyYW0pIHx8IGZ1bmN0aW9uIChwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbn07XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPdXRwdXQsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG52YXIgU2lkZWJhckNvbnRhaW5lciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2lkZWJhckNvbnRhaW5lcihfcmVmLCBwbGF0Zm9ybUlkKSB7XG4gICAgICAgIHRoaXMuX3JlZiA9IF9yZWY7XG4gICAgICAgIHRoaXMuYW5pbWF0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYWxsb3dTaWRlYmFyQmFja2Ryb3BDb250cm9sID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaG93QmFja2Ryb3AgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaG93QmFja2Ryb3BDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMub25CYWNrZHJvcENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuX3NpZGViYXJzID0gW107XG4gICAgICAgIHRoaXMuX2lzQnJvd3NlciA9IGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpO1xuICAgIH1cbiAgICBTaWRlYmFyQ29udGFpbmVyLnByb3RvdHlwZS5uZ0FmdGVyQ29udGVudEluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb25Ub2dnbGUoKTtcbiAgICB9O1xuICAgIFNpZGViYXJDb250YWluZXIucHJvdG90eXBlLm5nT25DaGFuZ2VzID0gZnVuY3Rpb24gKGNoYW5nZXMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1snc2hvd0JhY2tkcm9wJ10pIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0JhY2tkcm9wQ2hhbmdlLmVtaXQoY2hhbmdlc1snc2hvd0JhY2tkcm9wJ10uY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhckNvbnRhaW5lci5wcm90b3R5cGUubmdPbkRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5faXNCcm93c2VyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICAgIFNpZGViYXJDb250YWluZXIucHJvdG90eXBlLl9hZGRTaWRlYmFyID0gZnVuY3Rpb24gKHNpZGViYXIpIHtcbiAgICAgICAgdGhpcy5fc2lkZWJhcnMucHVzaChzaWRlYmFyKTtcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlKHNpZGViYXIpO1xuICAgIH07XG4gICAgU2lkZWJhckNvbnRhaW5lci5wcm90b3R5cGUuX3JlbW92ZVNpZGViYXIgPSBmdW5jdGlvbiAoc2lkZWJhcikge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9zaWRlYmFycy5pbmRleE9mKHNpZGViYXIpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9zaWRlYmFycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTaWRlYmFyQ29udGFpbmVyLnByb3RvdHlwZS5fZ2V0Q29udGVudFN0eWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGVmdCA9IDAsIHJpZ2h0ID0gMCwgdG9wID0gMCwgYm90dG9tID0gMDtcbiAgICAgICAgdmFyIHRyYW5zZm9ybVN0eWxlID0gJyc7XG4gICAgICAgIHZhciBoZWlnaHRTdHlsZSA9ICcnO1xuICAgICAgICB2YXIgd2lkdGhTdHlsZSA9ICcnO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5fc2lkZWJhcnM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2lkZWJhciA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmIChzaWRlYmFyLl9pc01vZGVTbGlkZSkge1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyLm9wZW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtRGlyID0gc2lkZWJhci5faXNMZWZ0T3JSaWdodCA/ICdYJyA6ICdZJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybUFtdCA9IFwiXCIgKyAoc2lkZWJhci5faXNMZWZ0T3JUb3AgPyAnJyA6ICctJykgKyAoc2lkZWJhci5faXNMZWZ0T3JSaWdodCA/IHNpZGViYXIuX3dpZHRoIDogc2lkZWJhci5faGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3R5bGUgPSBcInRyYW5zbGF0ZVwiICsgdHJhbnNmb3JtRGlyICsgXCIoXCIgKyB0cmFuc2Zvcm1BbXQgKyBcInB4KVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoc2lkZWJhci5faXNNb2RlUHVzaCAmJiBzaWRlYmFyLm9wZW5lZCkgfHwgc2lkZWJhci5kb2NrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZGRpbmdBbXQgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChzaWRlYmFyLl9pc01vZGVTbGlkZSAmJiBzaWRlYmFyLm9wZW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2lkZWJhci5faXNMZWZ0T3JSaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGhTdHlsZSA9ICcxMDAlJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodFN0eWxlID0gJzEwMCUnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2lkZWJhci5faXNEb2NrZWQgfHwgKHNpZGViYXIuX2lzTW9kZU92ZXIgJiYgc2lkZWJhci5kb2NrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0FtdCA9IHNpZGViYXIuX2RvY2tlZFNpemU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQW10ID0gc2lkZWJhci5faXNMZWZ0T3JSaWdodCA/IHNpZGViYXIuX3dpZHRoIDogc2lkZWJhci5faGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN3aXRjaCAoc2lkZWJhci5wb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSBNYXRoLm1heChsZWZ0LCBwYWRkaW5nQW10KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodCA9IE1hdGgubWF4KHJpZ2h0LCBwYWRkaW5nQW10KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gTWF0aC5tYXgodG9wLCBwYWRkaW5nQW10KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tID0gTWF0aC5tYXgoYm90dG9tLCBwYWRkaW5nQW10KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFkZGluZzogdG9wICsgXCJweCBcIiArIHJpZ2h0ICsgXCJweCBcIiArIGJvdHRvbSArIFwicHggXCIgKyBsZWZ0ICsgXCJweFwiLFxuICAgICAgICAgICAgd2Via2l0VHJhbnNmb3JtOiB0cmFuc2Zvcm1TdHlsZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNmb3JtU3R5bGUsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFN0eWxlLFxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoU3R5bGVcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFNpZGViYXJDb250YWluZXIucHJvdG90eXBlLl9vbkJhY2tkcm9wQ2xpY2tlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJhY2tkcm9wQ2xpY2tlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5fc2lkZWJhcnM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2lkZWJhciA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmIChzaWRlYmFyLm9wZW5lZCAmJiBzaWRlYmFyLnNob3dCYWNrZHJvcCAmJiBzaWRlYmFyLmNsb3NlT25DbGlja0JhY2tkcm9wKSB7XG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIGJhY2tkcm9wQ2xpY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJhY2tkcm9wQ2xpY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5vbkJhY2tkcm9wQ2xpY2tlZC5lbWl0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNpZGViYXJDb250YWluZXIucHJvdG90eXBlLl9zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc2lkZWJhcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBzaWRlYmFyLm9uT3BlblN0YXJ0LnN1YnNjcmliZShmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fb25Ub2dnbGUoKTsgfSk7XG4gICAgICAgIHNpZGViYXIub25PcGVuZWQuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9tYXJrRm9yQ2hlY2soKTsgfSk7XG4gICAgICAgIHNpZGViYXIub25DbG9zZVN0YXJ0LnN1YnNjcmliZShmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fb25Ub2dnbGUoKTsgfSk7XG4gICAgICAgIHNpZGViYXIub25DbG9zZWQuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9tYXJrRm9yQ2hlY2soKTsgfSk7XG4gICAgICAgIHNpZGViYXIub25Nb2RlQ2hhbmdlLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fbWFya0ZvckNoZWNrKCk7IH0pO1xuICAgICAgICBzaWRlYmFyLm9uUG9zaXRpb25DaGFuZ2Uuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9tYXJrRm9yQ2hlY2soKTsgfSk7XG4gICAgICAgIHNpZGViYXIuX29uUmVyZW5kZXIuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9tYXJrRm9yQ2hlY2soKTsgfSk7XG4gICAgfTtcbiAgICBTaWRlYmFyQ29udGFpbmVyLnByb3RvdHlwZS5fdW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLl9zaWRlYmFyczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBzaWRlYmFyID0gX2FbX2ldO1xuICAgICAgICAgICAgc2lkZWJhci5vbk9wZW5TdGFydC51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgc2lkZWJhci5vbk9wZW5lZC51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgc2lkZWJhci5vbkNsb3NlU3RhcnQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHNpZGViYXIub25DbG9zZWQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHNpZGViYXIub25Nb2RlQ2hhbmdlLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBzaWRlYmFyLm9uUG9zaXRpb25DaGFuZ2UudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHNpZGViYXIuX29uUmVyZW5kZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2lkZWJhckNvbnRhaW5lci5wcm90b3R5cGUuX29uVG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5fc2lkZWJhcnMubGVuZ3RoID4gMCAmJiB0aGlzLmFsbG93U2lkZWJhckJhY2tkcm9wQ29udHJvbCkge1xuICAgICAgICAgICAgdmFyIGhhc09wZW4gPSB0aGlzLl9zaWRlYmFycy5zb21lKGZ1bmN0aW9uIChzaWRlYmFyKSB7IHJldHVybiBzaWRlYmFyLm9wZW5lZCAmJiBzaWRlYmFyLnNob3dCYWNrZHJvcDsgfSk7XG4gICAgICAgICAgICB0aGlzLnNob3dCYWNrZHJvcCA9IGhhc09wZW47XG4gICAgICAgICAgICB0aGlzLnNob3dCYWNrZHJvcENoYW5nZS5lbWl0KGhhc09wZW4pO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuX21hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNpZGViYXJDb250YWluZXIucHJvdG90eXBlLl9tYXJrRm9yQ2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3JlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9O1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBJbnB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgQm9vbGVhbilcbiAgICBdLCBTaWRlYmFyQ29udGFpbmVyLnByb3RvdHlwZSwgXCJhbmltYXRlXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBCb29sZWFuKVxuICAgIF0sIFNpZGViYXJDb250YWluZXIucHJvdG90eXBlLCBcImFsbG93U2lkZWJhckJhY2tkcm9wQ29udHJvbFwiLCB2b2lkIDApO1xuICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICBJbnB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgQm9vbGVhbilcbiAgICBdLCBTaWRlYmFyQ29udGFpbmVyLnByb3RvdHlwZSwgXCJzaG93QmFja2Ryb3BcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgT3V0cHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXG4gICAgXSwgU2lkZWJhckNvbnRhaW5lci5wcm90b3R5cGUsIFwic2hvd0JhY2tkcm9wQ2hhbmdlXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIE91dHB1dCgpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxuICAgIF0sIFNpZGViYXJDb250YWluZXIucHJvdG90eXBlLCBcIm9uQmFja2Ryb3BDbGlja2VkXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBTdHJpbmcpXG4gICAgXSwgU2lkZWJhckNvbnRhaW5lci5wcm90b3R5cGUsIFwiY29udGVudENsYXNzXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBTdHJpbmcpXG4gICAgXSwgU2lkZWJhckNvbnRhaW5lci5wcm90b3R5cGUsIFwiYmFja2Ryb3BDbGFzc1wiLCB2b2lkIDApO1xuICAgIFNpZGViYXJDb250YWluZXIgPSBfX2RlY29yYXRlKFtcbiAgICAgICAgQ29tcG9uZW50KHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnbmctc2lkZWJhci1jb250YWluZXInLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiXFxuICAgIDxkaXYgKm5nSWY9XFxcInNob3dCYWNrZHJvcFxcXCJcXG4gICAgICBhcmlhLWhpZGRlbj1cXFwidHJ1ZVxcXCJcXG4gICAgICBjbGFzcz1cXFwibmctc2lkZWJhcl9fYmFja2Ryb3BcXFwiXFxuICAgICAgW25nQ2xhc3NdPVxcXCJiYWNrZHJvcENsYXNzXFxcIlxcbiAgICAgIChjbGljayk9XFxcIl9vbkJhY2tkcm9wQ2xpY2tlZCgpXFxcIj48L2Rpdj5cXG5cXG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVxcXCJuZy1zaWRlYmFyLFtuZy1zaWRlYmFyXVxcXCI+PC9uZy1jb250ZW50PlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJuZy1zaWRlYmFyX19jb250ZW50XFxcIlxcbiAgICAgIFtjbGFzcy5uZy1zaWRlYmFyX19jb250ZW50LS1hbmltYXRlXT1cXFwiYW5pbWF0ZVxcXCJcXG4gICAgICBbbmdDbGFzc109XFxcImNvbnRlbnRDbGFzc1xcXCJcXG4gICAgICBbbmdTdHlsZV09XFxcIl9nZXRDb250ZW50U3R5bGUoKVxcXCI+XFxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVxcXCJbbmctc2lkZWJhci1jb250ZW50XVxcXCI+PC9uZy1jb250ZW50PlxcbiAgICA8L2Rpdj5cXG4gIFwiLFxuICAgICAgICAgICAgc3R5bGVzOiBbXCJcXG4gICAgOmhvc3Qge1xcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgICAgZGlzcGxheTogYmxvY2s7XFxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICB9XFxuXFxuICAgIC5uZy1zaWRlYmFyX19iYWNrZHJvcCB7XFxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgIHRvcDogMDtcXG4gICAgICBib3R0b206IDA7XFxuICAgICAgbGVmdDogMDtcXG4gICAgICByaWdodDogMDtcXG4gICAgICBiYWNrZ3JvdW5kOiAjMDAwO1xcbiAgICAgIG9wYWNpdHk6IDAuNzU7XFxuICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XFxuICAgICAgei1pbmRleDogMTtcXG4gICAgfVxcblxcbiAgICAubmctc2lkZWJhcl9fY29udGVudCB7XFxuICAgICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xcbiAgICAgIG92ZXJmbG93OiBhdXRvO1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICB0b3A6IDA7XFxuICAgICAgYm90dG9tOiAwO1xcbiAgICAgIGxlZnQ6IDA7XFxuICAgICAgcmlnaHQ6IDA7XFxuICAgIH1cXG5cXG4gICAgLm5nLXNpZGViYXJfX2NvbnRlbnQtLWFuaW1hdGUge1xcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gMC4zcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4zLCAxKSwgcGFkZGluZyAwLjNzIGN1YmljLWJlemllcigwLCAwLCAwLjMsIDEpO1xcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGN1YmljLWJlemllcigwLCAwLCAwLjMsIDEpLCBwYWRkaW5nIDAuM3MgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMywgMSk7XFxuICAgIH1cXG4gIFwiXSxcbiAgICAgICAgICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG4gICAgICAgIH0pLFxuICAgICAgICBfX3BhcmFtKDEsIEluamVjdChQTEFURk9STV9JRCkpLFxuICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0NoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgT2JqZWN0XSlcbiAgICBdLCBTaWRlYmFyQ29udGFpbmVyKTtcbiAgICByZXR1cm4gU2lkZWJhckNvbnRhaW5lcjtcbn0oKSk7XG5leHBvcnQgeyBTaWRlYmFyQ29udGFpbmVyIH07XG4iXX0=