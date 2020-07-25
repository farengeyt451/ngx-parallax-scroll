import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { ParallaxScrollConfig, ParallaxDirection } from './ngx-parallax.interfaces';

const DEFAULT_SPEED: number = 1;
const DEFAULT_SMOOTHNESS: number = 1;
const DEFAULT_DIRECTION: ParallaxDirection = 'straight';
const DEFAULT_TIMING_FUNCTION: string = 'linear';
const DEFAULT_THROTTLE_TIME: number = 80;
const DEFAULT_INTERSECTION_OBSERVER_DISABLED: boolean = false;
const DEFAULT_INTERSECTION_OBSERVER_CONFIG: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

@Directive({
  selector: '[ngxParallaxScroll]',
})
export class ParallaxScrollDirective implements OnInit, OnDestroy {
  @Input() private ngxParallaxScroll?: Partial<ParallaxScrollConfig> = {};

  private observer: IntersectionObserver;
  private scrollSub$: Subscription;
  private isElementInViewport: boolean = true;

  constructor(
    private parallaxSource: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.initIntersectionObserver();
    this.initParallax();
    this.setParallaxTransition();
  }

  ngOnDestroy() {
    this.scrollSub$ && this.scrollSub$.unsubscribe();
    this.observer && this.observer.disconnect();
  }

  private initIntersectionObserver() {
    const {
      isIntersectionObserverDisabled = DEFAULT_INTERSECTION_OBSERVER_DISABLED,
    } = this.ngxParallaxScroll;

    if (isIntersectionObserverDisabled) return;

    const {
      intersectionObserverConfig = DEFAULT_INTERSECTION_OBSERVER_CONFIG,
    } = this.ngxParallaxScroll;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        this.isElementInViewport = entry.intersectionRatio < 1 ? false : true;
      });
    };

    const target = this.parallaxSource.nativeElement;

    this.observer = new IntersectionObserver(callback, {
      ...DEFAULT_INTERSECTION_OBSERVER_CONFIG,
      ...intersectionObserverConfig,
    });
    this.observer.observe(target);
  }

  private initParallax() {
    const { throttle = DEFAULT_THROTTLE_TIME } = this.ngxParallaxScroll;
    const { speed = DEFAULT_SPEED, direction = DEFAULT_DIRECTION } = this.ngxParallaxScroll;
    const evaluatedSpeed: number = this.setParallaxSpeed(speed, direction);

    this.subToScroll(throttle, evaluatedSpeed);
  }

  /**
   * Listen for scroll event
   * Change source element position
   * Position based on evaluated speed
   *
   * @param throttle { number }
   * @param evaluatedSpeed { number }
   */
  private subToScroll(throttle: number, evaluatedSpeed: number) {
    this.scrollSub$ = fromEvent(window, 'scroll')
      .pipe(throttleTime(throttle))
      .subscribe(() => {
        this.isElementInViewport && this.setParallaxElTransform(evaluatedSpeed);
      });
  }

  /**
   * Enabling parallax effect
   *
   * @param evaluatedSpeed { number }
   */
  private setParallaxElTransform(evaluatedSpeed: number) {
    const scrolled = window.pageYOffset;
    this.renderer.setStyle(
      this.parallaxSource.nativeElement,
      'transform',
      `translateY(${scrolled * evaluatedSpeed}px) translateZ(0)`
    );
  }

  /**
   * Enabling parallax transition
   */
  private setParallaxTransition() {
    const {
      smoothness = DEFAULT_SMOOTHNESS,
      timingFunction = DEFAULT_TIMING_FUNCTION,
    } = this.ngxParallaxScroll;

    this.renderer.setStyle(
      this.parallaxSource.nativeElement,
      'transition',
      `transform ${smoothness}s ${timingFunction}`
    );
  }

  /**
   * Set coefficient of parallax source move speed
   * Change move direction speed value by multiplying -1
   *
   * @param speed { number }
   * @param direction { ParallaxDirection }
   **/
  private setParallaxSpeed(speed: number, direction: ParallaxDirection): number {
    return speed * (direction === 'straight' ? 1 : -1);
  }
}
