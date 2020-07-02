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
const DEFAULT_TIMING_FUNCTION: string = 'linear';
const DEFAULT_DIRECTION: ParallaxDirection = 'straight';
const DEFAULT_THROTTLE_TIME: number = 80;

@Directive({
  selector: '[ngxParallaxScroll]',
})
export class ParallaxScrollDirective implements OnInit, OnDestroy {
  @Input() private parallaxProps?: ParallaxScrollConfig = {};

  private scrollSub$: Subscription;

  constructor(
    public elem: ElementRef,
    public renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    this.initParallax();
    this.setParallaxTransition();
  }

  ngOnDestroy() {
    this.scrollSub$ && this.scrollSub$.unsubscribe();
  }

  private initParallax() {
    const { throttleT = DEFAULT_THROTTLE_TIME } = this.parallaxProps;
    const { speed = DEFAULT_SPEED, direction = DEFAULT_DIRECTION } = this.parallaxProps;
    const evaluatedSpeed: number = this.setParallaxSpeed(speed, direction);

    this.scrollSub$ = fromEvent(window, 'scroll')
      .pipe(throttleTime(throttleT))
      .subscribe(() => {
        this.setParallaxElTransform(evaluatedSpeed);
      });
  }

  private setParallaxElTransform(evaluatedSpeed: number) {
    const scrolled = window.pageYOffset;
    this.renderer.setStyle(
      this.elem.nativeElement,
      'transform',
      `translateY(${scrolled * evaluatedSpeed}px) translateZ(0)`
    );
  }

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
