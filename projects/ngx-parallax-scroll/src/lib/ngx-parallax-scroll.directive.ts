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
import {
  NgxParallaxScrollConfig,
  NgxParallaxDirection,
  StateChanges,
  StateChangesReason,
} from './ngx-parallax.interfaces';
import { NgxParallaxScrollService } from './ngx-parallax-scroll.service';

type stateTypes = 'isEnabled' | 'isDestroyed' | 'isElementInViewport' | 'isWillChangeEnabled';

interface State {
  isEnabled: boolean;
  isDestroyed: boolean;
  isElementInViewport: boolean;
  isWillChangeEnabled: boolean;
  isIntersectionObserverDisabled: boolean;
}

let idCounter = 0;

@Directive({
  selector: '[ngxParallaxScroll]',
})
export class ParallaxScrollDirective implements OnInit, OnDestroy {
  @Input() private ngxParallaxScroll?: Partial<NgxParallaxScrollConfig>;

  private identifier: string;
  private observeTarget: HTMLElement;
  private observer: IntersectionObserver;
  private scroll$: Subscription;
  private subscription: Subscription = new Subscription();

  private state: State = {
    isEnabled: true,
    isDestroyed: false,
    isElementInViewport: true,
    isWillChangeEnabled: true,
    isIntersectionObserverDisabled: false,
  };

  private readonly defaultConfig: NgxParallaxScrollConfig = {
    speed: 1,
    smoothness: 1,
    direction: 'straight',
    timingFunction: 'linear',
    throttle: 80,
    isWillChangeEnabled: true,
    isIntersectionObserverDisabled: false,
    intersectionObserverConfig: {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    },
  };

  constructor(
    private parallaxSource: ElementRef,
    private renderer: Renderer2,
    private parallaxService: NgxParallaxScrollService,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformID)) return;

    this.setDefaultConfig();
    this.init();
    this.initIntersectionObserver();
    this.setWillChangeOptimization();
    this.setParallaxTransition();
    this.writeInstanceToStorage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.unobserveTarget(this.observeTarget);
  }

  private writeInstanceToStorage() {
    this.identifier = this.ngxParallaxScroll.identifier || `parallax-${idCounter}`;
    this.parallaxService.setInstance(this.identifier, this);
  }

  private setDefaultConfig() {
    this.ngxParallaxScroll = { ...this.defaultConfig, ...this.ngxParallaxScroll };
  }

  private init() {
    const { speed, direction, throttle } = this.ngxParallaxScroll;
    const evaluatedSpeed: number = this.evaluateSpeedDirection(speed, direction);

    this.subToScroll(throttle, evaluatedSpeed);
  }

  private initIntersectionObserver() {
    const { isIntersectionObserverDisabled } = this.ngxParallaxScroll;
    const { intersectionObserverConfig } = this.ngxParallaxScroll;

    if (isIntersectionObserverDisabled) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        const isElementInViewport = entry.intersectionRatio < 1 ? false : true;
        this.handleIntersection(isElementInViewport);
      });
    };

    this.observeTarget = this.parallaxSource.nativeElement;

    this.observer = new IntersectionObserver(callback, intersectionObserverConfig);

    this.observer.observe(this.observeTarget);
  }

  private handleIntersection(isElementInViewport: boolean) {
    if (isElementInViewport) {
      this.enable('EnteredTheViewport');
      this.setState('isElementInViewport', true);
    } else {
      this.disable('LeftTheViewport');
      this.setState('isElementInViewport', false);
    }
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

    if (this.state.isElementInViewport) {
      this.renderer.setStyle(
        this.parallaxSource.nativeElement,
        'transform',
        `translateY(${scrolled * evaluatedSpeed}px) translateZ(0)`
      );
    }
  }

  /**
   * Enabling css 'will-change' prop
   *
   */
  private setWillChangeOptimization() {
    if (!this.ngxParallaxScroll.isWillChangeEnabled) {
      this.setState('isWillChangeEnabled', false);
    } else {
      this.renderer.setStyle(this.parallaxSource.nativeElement, 'will-change', `transform`);
    }
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
   * @returns evaluatedSpeedDirection { number }
   **/
  private evaluateSpeedDirection(speed: number, direction: NgxParallaxDirection): number {
    return speed * (direction === 'straight' ? 1 : -1);
  }

  /** Methods */

  disable(reason: StateChangesReason) {
    this.setState('isEnabled', false);
    this.unsubFromScroll();
    this.emitStateChange(reason);
  }

  enable(reason: StateChangesReason) {
    this.setState('isEnabled', true);
    this.init();
    this.emitStateChange(reason);
  }

  /**
   * Service methods
   */
  private setState(stateProp: stateTypes, flag: boolean) {
    this.state[stateProp] = flag;
  }

  private unsubFromScroll() {
    this.scroll$ && this.scroll$.unsubscribe();
  }

  private unobserveTarget(target) {
    this.observer && this.observer.unobserve(target);
  }

  private emitStateChange(reason: StateChangesReason) {
    const identifier = this.ngxParallaxScroll.identifier;

    this.parallaxService.emitStateChange(identifier, reason, this);
  }
}
