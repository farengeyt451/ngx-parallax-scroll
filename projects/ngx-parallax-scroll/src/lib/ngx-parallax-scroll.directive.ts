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
  PLATFORM_ID,
} from '@angular/core';
import { isDevMode } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { ParallaxScrollConfig, ParallaxDirection } from './ngx-parallax.interfaces';

const DEFAULT_SPEED: number = 1;
const DEFAULT_SMOOTHNESS: number = 1;
const DEFAULT_TIMING_FUNCTION: string = 'linear';
const DEFAULT_DIRECTION: ParallaxDirection = 'straight';
const DEFAULT_THROTTLE_TIME: number = 80;

@Directive({
  selector: '[ngxParallaxScroll]',
})
export class ParallaxScrollDirective implements OnInit, OnDestroy {
  @Input() private parallaxProps?: ParallaxScrollConfig = {};

  private scrollSubscription: Subscription;

  constructor(
    public elem: ElementRef,
    public renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.initParallax();
    this.setParallaxElTransform();
    this.setParallaxTransition();
  }

  ngOnDestroy() {
    this.scrollSubscription && this.scrollSubscription.unsubscribe();
  }

  /**
   * Sub to scroll
   * Update element position when 'scroll' event fire
   **/
  private initParallax() {
    const { throttleT = DEFAULT_THROTTLE_TIME } = this.parallaxProps;

    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(throttleTime(throttleT))
      .subscribe(() => {
        this.setParallaxElTransform();
      });
  }

  private setParallaxElTransform() {
    const scrolled = window.pageYOffset;
    const { speed = DEFAULT_SPEED, direction = DEFAULT_DIRECTION } = this.parallaxProps;

    this.renderer.setStyle(
      this.elem.nativeElement,
      'transform',
      `translateY(${scrolled * this.setParallaxSpeed(speed, direction)}px) translateZ(0)`
    );
  }

  // Setting parallax smooth effect styles, based on CSS animation-timing-function
  private setParallaxTransition() {
    const {
      smoothness = DEFAULT_SMOOTHNESS,
      timingFunction = DEFAULT_TIMING_FUNCTION,
    } = this.parallaxProps;

    this.renderer.setStyle(
      this.elem.nativeElement,
      'transition',
      `transform ${smoothness}s ${timingFunction}`
    );
  }

  private setParallaxSpeed(speed: number, direction: ParallaxDirection): number {
    return speed * (direction === 'straight' ? 1 : -1);
  }
}
