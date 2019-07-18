/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * left-wrapper
 * 移动端左滑插件
 */
var TouchEventsName;
(function (TouchEventsName) {
    TouchEventsName["touchStart"] = "touchstart";
    TouchEventsName["touchMove"] = "touchmove";
    TouchEventsName["touchEnd"] = "touchend";
})(TouchEventsName || (TouchEventsName = {}));
var LeftWrapper = /** @class */ (function () {
    function LeftWrapper(wrapper, opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        this.wrapper = null; // 目标最外层
        this.leftSlide = null; // 左滑元素
        this.rightSlide = null; // 右边元素
        this.bodyInitStyle = ''; // body元素初始样式
        this.bodyDom = document.querySelector('body'); // body元素
        this.slideWidth = 0; // 左滑移动的最大距离
        this.slideX = 0; // 左滑移动的距离
        this.transitionDuration = 300; // 过渡时间
        this.initStateData = {
            target: null,
            moveX: 0,
            startX: 0,
            endX: 0,
            moveY: 0,
            startY: 0,
            endY: 0,
            forbiddenScroll: false,
            forbiddenWrapper: false,
            isTrend: false,
            fixedTop: 0 // body固定时的top值
        };
        this.state = __assign({}, this.initStateData); // 移动过程中的状态
        this.cssInitStyles = {
            overflow: {
                overflow: 'hidden'
            },
            zIndex: {
                zIndex: 1,
            },
            relative: {
                position: 'relative'
            },
            absolute: {
                position: 'absolute',
                transform: 'translateX(0)'
            },
            fixed: {
                position: 'fixed',
                width: '100%'
            }
        };
        /**
         * 初始化样式
         */
        this.initStyle = function () {
            LeftWrapper.jsCss(_this.wrapper, __assign({}, _this.cssInitStyles.overflow, _this.cssInitStyles.relative));
            LeftWrapper.jsCss(_this.leftSlide, __assign({}, _this.cssInitStyles.absolute, _this.cssInitStyles.zIndex));
            LeftWrapper.jsCss(_this.rightSlide, __assign({}, _this.cssInitStyles.overflow, _this.cssInitStyles.relative));
        };
        /**
         * 初始化监听事件
         */
        this.initEventListener = function () {
            if ('ontouchstart' in window) {
                Object.keys(TouchEventsName).forEach(function (event) {
                    _this.leftSlide.addEventListener(TouchEventsName[event], function (e) { return _this[event](e); }, {
                        capture: false
                    });
                });
            }
        };
        if (!wrapper || !(wrapper instanceof HTMLElement)) {
            console.error('Param wrapper must be HTMLElement');
            return this;
        }
        this.wrapper = wrapper;
        this.leftSlide = this.wrapper.children[0];
        this.rightSlide = this.wrapper.children[1];
        this.bodyInitStyle = this.bodyDom.getAttribute('style') || '';
        this.slideWidth = opts.slideWidth || 0;
        this.transitionDuration = opts.duration || 300;
        // 初始化
        this.initStyle();
        this.initEventListener();
    }
    /**
     * 阻止滚动, 允许左滑
     */
    LeftWrapper.prototype.stopScroll = function () {
        this.state.forbiddenScroll = true;
        this.state.fixedTop = LeftWrapper.getScrollTop();
        var css = __assign({}, this.cssInitStyles.fixed, { top: "-" + this.state.fixedTop + "px" });
        LeftWrapper.jsCss(this.bodyDom, css);
        this.state.forbiddenWrapper = false;
    };
    /**
     * 允许滚动, 禁止左滑
     */
    LeftWrapper.prototype.allowScroll = function () {
        this.state.forbiddenScroll = false;
        this.bodyDom.setAttribute('style', this.bodyInitStyle);
        this.state.forbiddenWrapper = true;
    };
    /** 类型谓词
     * 是否是移动事件
     * @param e 事件对象
     */
    LeftWrapper.prototype.isTouch = function (e) {
        return e.targetTouches !== undefined;
    };
    /**
     * 是否有左滑的趋势
     */
    LeftWrapper.prototype.wrapperTrend = function () {
        this.state.isTrend = true;
        if (Math.abs(this.state.moveX) >= Math.abs(this.state.moveY)) {
            // 有左滑的趋势
            this.stopScroll();
            return true;
        }
        else {
            this.allowScroll();
            return false;
        }
    };
    /**
     * 开始移动
     */
    LeftWrapper.prototype.touchStart = function (e) {
        if (this.isTouch(e)) {
            this.state.startX = e.targetTouches[0].pageX;
            this.state.startY = e.targetTouches[0].pageY;
        }
        else {
            this.state.startX = e.pageX;
            this.state.startY = e.pageY;
        }
    };
    /**
     * 移动中
     */
    LeftWrapper.prototype.touchMove = function (e) {
        if (this.state.forbiddenWrapper) {
            // 禁止左滑
            return;
        }
        var curerntX = 0;
        var curerntY = 0;
        if (this.isTouch(e)) {
            curerntX = e.targetTouches[0].pageX;
            curerntY = e.targetTouches[0].pageY;
        }
        else {
            curerntX = e.pageX;
            curerntY = e.pageY;
        }
        this.state.moveX = curerntX - this.state.startX;
        this.state.moveY = curerntY - this.state.startY;
        if (!this.state.isTrend) { // 是否判断过趋势，当没有判断过
            if (!this.wrapperTrend()) { // 没有左滑的趋势，可以滚动，不能左滑
                return;
            }
        }
        this.moveSlideX(this.state.moveX);
        this.state.startX = curerntX;
        this.state.startY = curerntY;
    };
    /**
     * 移动结束
     */
    LeftWrapper.prototype.touchEnd = function (e) {
        var absMoveX = Math.abs(this.slideX);
        var halfSlide = this.slideWidth / 2;
        if (absMoveX >= halfSlide) {
            // 两种情况
            // 当前x轴位置大于设置距离的一半，则将当前x轴位置变成设置距离
            // this.state.moveX > 0表示右滑，右滑则将slideX直接变为0
            this.slideX = this.state.moveX > 0 ? 0 : -this.slideWidth;
        }
        else {
            this.slideX = 0;
        }
        this.transitionX();
        this.resetWrapperState();
    };
    /**
     * 移动中设置滑动的x轴位置slideX
     * @param x 滑动的距离(moveX)
     */
    LeftWrapper.prototype.moveSlideX = function (x) {
        var translateX = this.slideX + x;
        this.slideX = translateX >= 0 ? 0 : Math.abs(translateX) >= this.slideWidth ? -this.slideWidth : translateX;
        this.doTranslateX();
    };
    /**
     * 过渡效果改变translateX
     */
    LeftWrapper.prototype.transitionX = function () {
        LeftWrapper.jsCss(this.leftSlide, {
            transitionDuration: this.transitionDuration + "ms",
            transform: "translateX(" + this.slideX + "px)"
        });
    };
    /**
     * 改变translateX实现滑动
     */
    LeftWrapper.prototype.doTranslateX = function () {
        LeftWrapper.jsCss(this.leftSlide, {
            transitionDuration: '0ms',
            transform: "translateX(" + this.slideX + "px)"
        });
    };
    /**
     * 每次滑动结束后，重置状态
     */
    LeftWrapper.prototype.resetWrapperState = function () {
        this.bodyDom.setAttribute('style', this.bodyInitStyle);
        if (this.state.fixedTop > 0) {
            // 如果固定body前滚动条有高度，则定位到相应位置
            LeftWrapper.setScrollTop(this.state.fixedTop);
        }
        this.state = __assign({}, this.initStateData);
    };
    /**
     * 获取滚动条高度
     */
    LeftWrapper.getScrollTop = function () {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    };
    /**
     * 设置滚动条高度
     */
    LeftWrapper.setScrollTop = function (scrollTop) {
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
    };
    /**
     * 设置样式
     * @param element dom元素
     * @param cssStyles 样式
     */
    LeftWrapper.jsCss = function (element, cssStyles) {
        var cssStyless = Object.keys(cssStyles);
        if (cssStyless.length > 0) {
            cssStyless.forEach(function (property) {
                var cssStyle = cssStyles[property];
                element.style[property] = cssStyle;
            });
        }
    };
    return LeftWrapper;
}());

export default LeftWrapper;
//# sourceMappingURL=left-wrapper.es5.js.map
