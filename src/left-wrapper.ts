/**
 * left-wrapper
 * 移动端左滑插件
 */

// 定义事件
type EventString = 'touchStart' | 'touchMove' | 'touchEnd'
enum TouchEventsName {
  touchStart = 'touchstart',
  touchMove = 'touchmove',
  touchEnd = 'touchend'
}

interface CssStyles {
  [propName: string]: any
}

interface WrapperOpts {
  slideWidth?: number // 左滑最大值
  duration?: number // 滑动结束后动画持续时间
}

interface Wrapper {
  wrapper: HTMLElement | null
  leftSlide: HTMLElement | null
  rightSlide: HTMLElement | null
  touchStart: (e: TouchEvent | MouseEvent) => void
  touchMove: (e: TouchEvent | MouseEvent) => void
  touchEnd: (e: TouchEvent | MouseEvent) => void
}

class LeftWrapper implements Wrapper {
  /**
   * 获取滚动条高度
   */
  static getScrollTop = (): number => {
    let scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
    return scrollTop
  }

  /**
   * 设置滚动条高度
   */
  static setScrollTop = (scrollTop: number): void => {
    document.body.scrollTop = scrollTop
    document.documentElement.scrollTop = scrollTop
  }

  /**
   * 设置样式
   * @param element dom元素
   * @param cssStyles 样式
   */
  static jsCss = (element: HTMLElement, cssStyles: CssStyles): void => {
    const cssStyless = Object.keys(cssStyles)
    if (cssStyless.length > 0) {
      cssStyless.forEach(property => {
        const cssStyle = cssStyles[property]
        element.style[property as any] = cssStyle
      })
    }
  }

  wrapper: HTMLElement | null = null // 目标最外层
  leftSlide: HTMLElement | null = null // 左滑元素
  rightSlide: HTMLElement | null = null // 右边元素
  bodyInitStyle: string = '' // body元素初始样式
  bodyDom: HTMLElement | null = document.querySelector('body') // body元素
  slideWidth: number = 0 // 左滑移动的最大距离
  slideX: number = 0 // 左滑移动的距离
  transitionDuration: number = 300 // 过渡时间

  initStateData = {
    target: null, // 目标元素
    moveX: 0, // x轴移动的距离
    startX: 0, // 开始移动时x坐标
    endX: 0, // 结束移动时x坐标
    moveY: 0, // y轴移动的距离
    startY: 0, // 开始移动时y坐标
    endY: 0, // 结束移动时y坐标
    forbiddenScroll: false, // 禁止页面滚动
    forbiddenWrapper: false, // 禁止左滑
    isTrend: false, // 是否判断过趋势
    fixedTop: 0 // body固定时的top值
  }

  state = { ...this.initStateData } // 移动过程中的状态

  cssInitStyles = {
    // 需要用到的样式
    overflow: {
      overflow: 'hidden'
    },
    zIndex: {
      zIndex: 1
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
  }

  constructor(wrapper: HTMLElement | null, opts: WrapperOpts = {}) {
    if (!wrapper || !(wrapper instanceof HTMLElement)) {
      console.error('Param wrapper must be HTMLElement')
      return this
    }
    this.wrapper = wrapper!
    this.leftSlide = this.wrapper.children[0] as HTMLElement
    this.rightSlide = this.wrapper.children[1] as HTMLElement
    this.bodyInitStyle = this.bodyDom!.getAttribute('style') || ''
    this.slideWidth = opts.slideWidth || 0
    this.transitionDuration = opts.duration || 300

    // 初始化
    this.initStyle()
    this.initEventListener()
  }

  /**
   * 初始化样式
   */
  initStyle = (): void => {
    LeftWrapper.jsCss(this.wrapper!, {
      ...this.cssInitStyles.overflow,
      ...this.cssInitStyles.relative
    })
    LeftWrapper.jsCss(this.leftSlide!, {
      ...this.cssInitStyles.absolute,
      ...this.cssInitStyles.zIndex
    })
    LeftWrapper.jsCss(this.rightSlide!, {
      ...this.cssInitStyles.overflow,
      ...this.cssInitStyles.relative
    })
  }

  /**
   * 初始化监听事件
   */
  initEventListener = (): void => {
    if ('ontouchstart' in window) {
      Object.keys(TouchEventsName).forEach(event => {
        this.leftSlide!.addEventListener(
          TouchEventsName[event as EventString],
          e => this[event as EventString](e),
          {
            capture: false
          }
        )
      })
    }
  }

  /**
   * 阻止滚动, 允许左滑
   */
  stopScroll(): void {
    this.state.forbiddenScroll = true
    this.state.fixedTop = LeftWrapper.getScrollTop()
    const css = {
      ...this.cssInitStyles.fixed,
      top: `-${this.state.fixedTop}px`
    }
    LeftWrapper.jsCss(this.bodyDom!, css)
    this.state.forbiddenWrapper = false
  }
  /**
   * 允许滚动, 禁止左滑
   */
  allowScroll(): void {
    this.state.forbiddenScroll = false
    this.bodyDom!.setAttribute('style', this.bodyInitStyle)
    this.state.forbiddenWrapper = true
  }
  /** 类型谓词
   * 是否是移动事件
   * @param e 事件对象
   */
  isTouch(e: TouchEvent | MouseEvent): e is TouchEvent {
    return (e as TouchEvent).targetTouches !== undefined
  }
  /**
   * 是否有左滑的趋势
   */
  wrapperTrend(): boolean {
    this.state.isTrend = true
    if (Math.abs(this.state.moveX) >= Math.abs(this.state.moveY)) {
      // 有左滑的趋势
      this.stopScroll()
      return true
    } else {
      this.allowScroll()
      return false
    }
  }
  /**
   * 开始移动
   */
  touchStart(e: TouchEvent | MouseEvent): void {
    if (this.isTouch(e)) {
      this.state.startX = e.targetTouches[0].pageX
      this.state.startY = e.targetTouches[0].pageY
    } else {
      this.state.startX = e.pageX
      this.state.startY = e.pageY
    }
  }
  /**
   * 移动中
   */
  touchMove(e: TouchEvent | MouseEvent): void {
    if (this.state.forbiddenWrapper) {
      // 禁止左滑
      return
    }
    let curerntX: number = 0
    let curerntY: number = 0
    if (this.isTouch(e)) {
      curerntX = e.targetTouches[0].pageX
      curerntY = e.targetTouches[0].pageY
    } else {
      curerntX = e.pageX
      curerntY = e.pageY
    }
    this.state.moveX = curerntX - this.state.startX
    this.state.moveY = curerntY - this.state.startY
    if (!this.state.isTrend) {
      // 是否判断过趋势，当没有判断过
      if (!this.wrapperTrend()) {
        // 没有左滑的趋势，可以滚动，不能左滑
        return
      }
    }
    this.moveSlideX(this.state.moveX)
    this.state.startX = curerntX
    this.state.startY = curerntY
  }
  /**
   * 移动结束
   */
  touchEnd(e: TouchEvent | MouseEvent): void {
    const absMoveX = Math.abs(this.slideX)
    const halfSlide = this.slideWidth / 2
    if (absMoveX >= halfSlide) {
      // 两种情况
      // 当前x轴位置大于设置距离的一半，则将当前x轴位置变成设置距离
      // this.state.moveX > 0表示右滑，右滑则将slideX直接变为0
      this.slideX = this.state.moveX > 0 ? 0 : -this.slideWidth
    } else {
      this.slideX = 0
    }
    this.transitionX()
    this.resetWrapperState()
  }
  /**
   * 移动中设置滑动的x轴位置slideX
   * @param x 滑动的距离(moveX)
   */
  moveSlideX(x: number): void {
    let translateX = this.slideX + x
    this.slideX =
      translateX >= 0 ? 0 : Math.abs(translateX) >= this.slideWidth ? -this.slideWidth : translateX
    this.doTranslateX()
  }
  /**
   * 过渡效果改变translateX
   */
  transitionX(): void {
    LeftWrapper.jsCss(this.leftSlide!, {
      transitionDuration: `${this.transitionDuration}ms`,
      transform: `translateX(${this.slideX}px)`
    })
  }
  /**
   * 改变translateX实现滑动
   */
  doTranslateX(): void {
    LeftWrapper.jsCss(this.leftSlide!, {
      transitionDuration: '0ms',
      transform: `translateX(${this.slideX}px)`
    })
  }
  /**
   * 每次滑动结束后，重置状态
   */
  resetWrapperState(): void {
    this.bodyDom!.setAttribute('style', this.bodyInitStyle)
    if (this.state.fixedTop > 0) {
      // 如果固定body前滚动条有高度，则定位到相应位置
      LeftWrapper.setScrollTop(this.state.fixedTop)
    }
    this.state = { ...this.initStateData }
  }
}
export default LeftWrapper
