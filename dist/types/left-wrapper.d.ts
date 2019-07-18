/**
 * left-wrapper
 * 移动端左滑插件
 */
interface CssStyles {
    [propName: string]: any;
}
interface WrapperOpts {
    slideWidth?: number;
    duration?: number;
}
interface Wrapper {
    wrapper: HTMLElement | null;
    leftSlide: HTMLElement | null;
    rightSlide: HTMLElement | null;
    touchStart: (e: TouchEvent | MouseEvent) => void;
    touchMove: (e: TouchEvent | MouseEvent) => void;
    touchEnd: (e: TouchEvent | MouseEvent) => void;
}
declare class LeftWrapper implements Wrapper {
    /**
     * 获取滚动条高度
     */
    static getScrollTop: () => number;
    /**
     * 设置滚动条高度
     */
    static setScrollTop: (scrollTop: number) => void;
    /**
     * 设置样式
     * @param element dom元素
     * @param cssStyles 样式
     */
    static jsCss: (element: HTMLElement, cssStyles: CssStyles) => void;
    wrapper: HTMLElement | null;
    leftSlide: HTMLElement | null;
    rightSlide: HTMLElement | null;
    bodyInitStyle: string;
    bodyDom: HTMLElement | null;
    slideWidth: number;
    slideX: number;
    transitionDuration: number;
    initStateData: {
        target: null;
        moveX: number;
        startX: number;
        endX: number;
        moveY: number;
        startY: number;
        endY: number;
        forbiddenScroll: boolean;
        forbiddenWrapper: boolean;
        isTrend: boolean;
        fixedTop: number;
    };
    state: {
        target: null;
        moveX: number;
        startX: number;
        endX: number;
        moveY: number;
        startY: number;
        endY: number;
        forbiddenScroll: boolean;
        forbiddenWrapper: boolean;
        isTrend: boolean;
        fixedTop: number;
    };
    cssInitStyles: {
        overflow: {
            overflow: string;
        };
        zIndex: {
            zIndex: number;
        };
        relative: {
            position: string;
        };
        absolute: {
            position: string;
            transform: string;
        };
        fixed: {
            position: string;
            width: string;
        };
    };
    constructor(wrapper: HTMLElement | null, opts?: WrapperOpts);
    /**
     * 初始化样式
     */
    initStyle: () => void;
    /**
     * 初始化监听事件
     */
    initEventListener: () => void;
    /**
     * 阻止滚动, 允许左滑
     */
    stopScroll(): void;
    /**
     * 允许滚动, 禁止左滑
     */
    allowScroll(): void;
    /** 类型谓词
     * 是否是移动事件
     * @param e 事件对象
     */
    isTouch(e: TouchEvent | MouseEvent): e is TouchEvent;
    /**
     * 是否有左滑的趋势
     */
    wrapperTrend(): boolean;
    /**
     * 开始移动
     */
    touchStart(e: TouchEvent | MouseEvent): void;
    /**
     * 移动中
     */
    touchMove(e: TouchEvent | MouseEvent): void;
    /**
     * 移动结束
     */
    touchEnd(e: TouchEvent | MouseEvent): void;
    /**
     * 移动中设置滑动的x轴位置slideX
     * @param x 滑动的距离(moveX)
     */
    moveSlideX(x: number): void;
    /**
     * 过渡效果改变translateX
     */
    transitionX(): void;
    /**
     * 改变translateX实现滑动
     */
    doTranslateX(): void;
    /**
     * 每次滑动结束后，重置状态
     */
    resetWrapperState(): void;
}
export default LeftWrapper;
