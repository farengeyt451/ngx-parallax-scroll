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

type stateTypes = 'isEnabled' | 'isDestroyed' | 'isElementInViewport';

interface State {
  isEnabled: boolean;
  isDestroyed: boolean;
  isElementInViewport: boolean;
}

let idCounter = 0;
// const DEFAULT_INTERSECTION_OBSERVER_DISABLED: boolean = false;
// const DEFAULT_INTERSECTION_OBSERVER_CONFIG: IntersectionObserverInit = {
//   root: null,
//   rootMargin: '0px',
//   threshold: 1,
// };

@Directive({
  selector: '[ngxParallaxScroll]',
})
export class ParallaxScrollDirective implements OnInit, OnDestroy {
  @Input() private ngxParallaxScroll?: Partial<NgxParallaxScrollConfig>;

  private id = idCounter++;
  private observeTarget: HTMLElement;
  private observer: IntersectionObserver;
  private scroll$: Subscription;
  private subscription: Subscription = new Subscription();

  private state: State = {
    isEnabled: true,
    isDestroyed: false,
    isElementInViewport: true,
  };

  private readonly defaultConfig: NgxParallaxScrollConfig = {
    speed: 1,
    smoothness: 1,
    direction: 'straight',
    timingFunction: 'linear',
    throttle: 80,
  };

  constructor(
    private parallaxSource: ElementRef,
    private renderer: Renderer2,
    private parallaxService: NgxParallaxScrollService,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformID)) return;

    console.log(this);

    this.writeInstanceToStorage();
    this.setDefaultConfig();
    // this.initIntersectionObserver();
    this.init();
    this.setParallaxTransition();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.unobserveTarget(this.observeTarget);
  }

  private writeInstanceToStorage() {
    const identifier = this.ngxParallaxScroll.identifier || `parallax-${this.id}`;
    this.parallaxService.setInstance(identifier, this);
  }

  private setDefaultConfig() {
    this.ngxParallaxScroll = { ...this.defaultConfig, ...this.ngxParallaxScroll };
  }

  // private initIntersectionObserver() {
  //   const {
  //     isIntersectionObserverDisabled = DEFAULT_INTERSECTION_OBSERVER_DISABLED,
  //   } = this.ngxParallaxScroll;

  //   if (isIntersectionObserverDisabled) return;

  //   const {
  //     intersectionObserverConfig = DEFAULT_INTERSECTION_OBSERVER_CONFIG,
  //   } = this.ngxParallaxScroll;

  //   const callback = (entries: IntersectionObserverEntry[]) => {
  //     entries.forEach((entry: IntersectionObserverEntry) => {
  //       this.isElementInViewport = entry.intersectionRatio < 1 ? false : true;
  //     });
  //   };

  //   this.observeTarget = this.parallaxSource.nativeElement;

  //   this.observer = new IntersectionObserver(callback, {
  //     ...DEFAULT_INTERSECTION_OBSERVER_CONFIG,
  //     ...intersectionObserverConfig,
  //   });
  //   this.observer.observe(this.observeTarget);
  // }

  private init() {
    const { speed, direction, throttle } = this.ngxParallaxScroll;
    const evaluatedSpeed: number = this.evaluateSpeed(speed, direction);

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
    this.scroll$ = fromEvent(window, 'scroll')
      .pipe(throttleTime(throttle))
      .subscribe(() => {
        this.processScrolling(evaluatedSpeed);
      });

    this.subscription.add(this.scroll$);
  }

  private processScrolling(evaluatedSpeed: number) {
    this.setParallaxElTransform(evaluatedSpeed);
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
    const { smoothness, timingFunction } = this.ngxParallaxScroll;

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
   *
   * @returns evaluatedSpeed { number }
   **/
  private evaluateSpeed(speed: number, direction: NgxParallaxDirection): number {
    return speed * (direction === 'straight' ? 1 : -1);
  }

  /** Methods */

  disable() {
    this.setState('isEnabled', false);
    this.unsubFromScroll();
  }

  enable() {
    this.setState('isEnabled', true);
    this.init();
  }

  /**
   * Service methods
   */
  private setState(stateProp: stateTypes, flag: boolean) {
    this.state.isEnabled = false;
  }

  private unsubFromScroll() {
    this.scroll$ && this.scroll$.unsubscribe();
  }

  private unobserveTarget(target) {
    this.observer && this.observer.unobserve(target);
  }
}
