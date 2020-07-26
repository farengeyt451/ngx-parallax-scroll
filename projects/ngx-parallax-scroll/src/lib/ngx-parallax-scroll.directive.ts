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
import { NgxParallaxScrollConfig, NgxParallaxDirection } from './ngx-parallax.interfaces';
import { NgxParallaxScrollService } from './ngx-parallax-scroll.service';

const DEFAULT_SPEED: number = 1;
const DEFAULT_SMOOTHNESS: number = 1;
const DEFAULT_DIRECTION: NgxParallaxDirection = 'straight';
const DEFAULT_TIMING_FUNCTION: string = 'linear';
const DEFAULT_THROTTLE_TIME: number = 80;
const DEFAULT_INTERSECTION_OBSERVER_DISABLED: boolean = false;
const DEFAULT_INTERSECTION_OBSERVER_CONFIG: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

interface ConfigChange {
  type: string;
  payload: NgxParallaxScrollConfig | null;
}

@Directive({
  selector: '[ngxParallaxScroll]',
})
export class ParallaxScrollDirective implements OnInit, OnDestroy {
  @Input() private ngxParallaxScroll?: Partial<NgxParallaxScrollConfig>;

  private observer: IntersectionObserver;
  private scrollSub$: Subscription;
  private isElementInViewport: boolean = true;
  private observeTarget: HTMLElement;
  private subs: Subscription = new Subscription();

  constructor(
    private parallaxSource: ElementRef,
    private renderer: Renderer2,
    private parallaxService: NgxParallaxScrollService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.setDefaultConfig();
    this.initIntersectionObserver();
    this.initParallax();
    this.setParallaxTransition();
    this.subToConfigChange();

    this.parallaxService.setInstance(String(Math.random()), this);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.unobserveTarget(this.observeTarget);
  }

  private setDefaultConfig() {
    this.ngxParallaxScroll = this.ngxParallaxScroll ? this.ngxParallaxScroll : {};
  }

  private initIntersectionObserver() {
    const {
      isIntersectionObserverDisabled = DEFAULT_INTERSECTION_OBSERVER_DISABLED,
    } = this.ngxParallaxScroll;

    if (isIntersectionObserverDisabled) return;

    const {
      intersectionObserverConfig = DEFAULT_INTERSECTION_OBSERVER_CONFIG,
    } = this.ngxParallaxScroll;

    console.log(intersectionObserverConfig);

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        this.isElementInViewport = entry.intersectionRatio < 1 ? false : true;
      });
    };

    this.observeTarget = this.parallaxSource.nativeElement;

    this.observer = new IntersectionObserver(callback, {
      ...DEFAULT_INTERSECTION_OBSERVER_CONFIG,
      ...intersectionObserverConfig,
    });
    this.observer.observe(this.observeTarget);
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
   * Set position based on evaluated speed
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
    this.subs.add(this.scrollSub$);
  }

  /**
   * Update parallax when config changed
   */
  private updateParallax() {
    this.disableParallaxScroll();
    this.reinitParallax();
  }

  private reinitParallax() {
    this.initParallax();
    this.initIntersectionObserver();
    this.setParallaxTransition();
  }

  private disableParallaxScroll() {
    this.unsubFromScroll();
    this.unobserveTarget(this.observeTarget);
  }

  private subToConfigChange() {
    const configChangeSub$ = this.parallaxService.parallaxConfigChange.subscribe(
      (data: ConfigChange) => {
        if (data.type === 'config') {
          this.ngxParallaxScroll = { ...this.ngxParallaxScroll, ...data.payload };
          this.updateParallax();
        } else if (data.type === 'disableParallaxScroll') {
          this.disableParallaxScroll();
        }
      }
    );

    this.subs.add(configChangeSub$);
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
   * @param direction { NgxParallaxDirection }
   **/
  private setParallaxSpeed(speed: number, direction: NgxParallaxDirection): number {
    return speed * (direction === 'straight' ? 1 : -1);
  }

  private unsubFromScroll() {
    this.scrollSub$ && this.scrollSub$.unsubscribe();
  }

  private unobserveTarget(target) {
    this.observer && this.observer.unobserve(target);
  }
}
