import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isDevMode } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { IParallaxScrollConfig, ParallaxDirection } from './ngx-parallax.interfaces';

@Directive({
  selector: '[ngxParallaxScroll]'
})
export class ParallaxScrollDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // Required input from config object or input props
  @Input() private config?: IParallaxScrollConfig;

  @Input()
  parallaxSpeed: number;

  @Input()
  parallaxSmoothness: number;

  @Input()
  parallaxDirection?: ParallaxDirection;

  @Input()
  parallaxTimingFunction?: string;

  @Input()
  parallaxThrottleTime?: number;

  // Setting the values after validation
  private _parallaxSpeedVal: number;
  private _parallaxSmoothnessVal: number;
  private _parallaxTimingFunVal: string = 'linear';
  private _parallaxThrottleTime: number = 0;

  scrollSubscribtion: Subscription;
  isPrxElInViewport: boolean;
  directiveName: string = this.constructor.name;

  constructor(
    public elem: ElementRef,
    public renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;

    // Initing parallax effect and setting element styles
    this.initParallax();
    this.setParallaxElTransform();
    this.setParallaxTransition();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Setting parallax options from config object or input props
    const prlxSpeed =
      (changes['parallaxSpeed'] && changes['parallaxSpeed'].currentValue) ||
      (changes['config'] && changes['config'].currentValue.parallaxSpeed);

    const prlxSmoothness =
      (changes['parallaxSmoothness'] && changes['parallaxSmoothness'].currentValue) ||
      (changes['config'] && changes['config'].currentValue.parallaxSmoothness);

    const prlxDirection =
      (changes['parallaxDirection'] && changes['parallaxDirection'].currentValue) ||
      (changes['config'] && changes['config'].currentValue.parallaxDirection);

    const prlxTimingFunction =
      (changes['parallaxTimingFunction'] && changes['parallaxTimingFunction'].currentValue) ||
      (changes['config'] && changes['config'].currentValue.parallaxTimingFunction);

    const prlxThrottleTime =
      (changes['parallaxThrottleTime'] && changes['parallaxThrottleTime'].currentValue) ||
      (changes['config'] && changes['config'].currentValue.parallaxThrottleTime);

    this.setParallaxSpeed(prlxSpeed);
    this.setParallaxSmoothness(prlxSmoothness);
    this.setParallaxDirection(prlxDirection);
    this.setParallaxTimingFun(prlxTimingFunction);
    this.setParallaxThrottleTime(prlxThrottleTime);
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.scrollSubscribtion && this.scrollSubscribtion.unsubscribe();
  }

  // Setting parallax effect and setting element styles
  initParallax(): void {
    this.scrollSubscribtion = fromEvent(window, 'scroll')
      .pipe(throttleTime(this.prlxThrottleTime))
      .subscribe(() => {
        this.setParallaxElTransform();
      });
  }

  // Setting parallax speed effect styles
  setParallaxElTransform(): void {
    let scrolled = window.pageYOffset;
    this.renderer.setStyle(
      this.elem.nativeElement,
      'transform',
      `translateY(${scrolled * this.prlxSpeed}px) translateZ(0)`
    );
  }

  // Setting parallax smooth effect styles, based on CSS animation-timing-function
  setParallaxTransition() {
    this.renderer.setStyle(
      this.elem.nativeElement,
      'transition',
      `transform ${this.prlxSmoothness}s ${this.prlxTimingFun}`
    );
  }

  // Setting parallax properties
  setParallaxSpeed(speedVal: any): void {
    const propName = 'parallaxSpeed';
    this.validateParallaxSpeed(speedVal, propName, 'number') && (this._parallaxSpeedVal = speedVal);
  }

  setParallaxSmoothness(smoothnessVal: any): void {
    const propName = 'parallaxSmoothness';
    this.validateParallaxSmoothness(smoothnessVal, propName, 'number') &&
      (this._parallaxSmoothnessVal = smoothnessVal);
  }

  setParallaxDirection(directionVal: any): void {
    const propName = 'parallaxDirection';
    directionVal &&
      this.isTypeOf(directionVal, 'string', propName) &&
      directionVal === 'reverse' &&
      (this._parallaxSpeedVal *= -1);
  }

  setParallaxTimingFun(timingFun: any): void {
    const propName = 'parallaxTimingFunction';
    timingFun &&
      this.isTypeOf(timingFun, 'string', propName) &&
      (this._parallaxTimingFunVal = timingFun);
  }

  setParallaxThrottleTime(throttleTime: any): void {
    const propName = 'parallaxThrottleTime';
    throttleTime &&
      this.isTypeOf(throttleTime, 'number', propName) &&
      (this._parallaxThrottleTime = throttleTime);
  }

  // Getters for parallax options
  get prlxSpeed() {
    return this._parallaxSpeedVal;
  }

  get prlxSmoothness() {
    return this._parallaxSmoothnessVal;
  }

  get prlxTimingFun() {
    return this._parallaxTimingFunVal;
  }

  get prlxThrottleTime() {
    return this._parallaxThrottleTime;
  }

  // Validation functions
  isProvided(value: any, propName: string): boolean {
    const isNotProvided = value == null || value === '';
    if (isNotProvided && isDevMode()) {
      throw new Error(
        `${this.directiveName}: @Input [${propName}] is required, but was not provided`
      );
    }
    return true;
  }

  isTypeOf(value: any, requiredType: 'string' | 'number' | 'boolean', propName: string): boolean {
    const isRequiredType = typeof value === requiredType;
    if (!isRequiredType && isDevMode()) {
      throw new Error(
        `${
          this.directiveName
        }: @Input [${propName}] is expected to be of type '${requiredType}', but type '${typeof value}' was provided`
      );
    }
    return true;
  }

  isPositive(value: number, propName: string): boolean {
    const isRequiredType = typeof value === 'number';
    const isValid = value >= 0;

    if (isRequiredType && !isValid && isDevMode()) {
      throw new Error(
        `${
          this.directiveName
        }: @Input [${propName}] is expected to be positive value, but negative '${value}' value was provided`
      );
    }
    return true;
  }

  // Executing validation functions to validate parallax speed
  validateParallaxSpeed(
    value: any,
    propName: string,
    requiredType: 'string' | 'number' | 'boolean'
  ) {
    return (
      this.isProvided(value, propName) &&
      this.isTypeOf(value, requiredType, propName) &&
      this.isPositive(value, propName)
    );
  }

  // Executing validation functions to validate parallax smoothness
  validateParallaxSmoothness(
    value: any,
    propName: string,
    requiredType: 'string' | 'number' | 'boolean'
  ) {
    return (
      this.isProvided(value, propName) &&
      this.isTypeOf(value, requiredType, propName) &&
      this.isPositive(value, propName)
    );
  }
}
