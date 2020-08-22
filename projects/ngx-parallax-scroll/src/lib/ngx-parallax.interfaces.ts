import { ParallaxScrollDirective } from './ngx-parallax-scroll.directive';

interface ParallaxScrollConfigBase {
  identifier: string;
  /**
   * Speed of moving source element
   *
   * Default value: 1
   */
  speed: number;

  /**
   * Smoothness (transition time) of moving source element
   *
   * Default value: 1
   */
  smoothness: number;

  /**
   * Direction of source element moving
   *
   * Default value: 'straight'
   */
  direction: NgxParallaxDirection;

  /**
   * Timing function for css transition
   *
   * Default value: 'linear'
   */
  timingFunction: string;

  /**
   * Throttle time
   *
   * Default value: 80
   */
  throttle: number;

  /**
   * Disable intersection observer
   *
   * If disabled don't recalculate position when source element out of viewport
   *
   * Default value: false
   */
  isIntersectionObserverDisabled: boolean;

  /**
  * Custom config for IntersectionObserver
  *
  * @link DOCS:
  * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  *
  * Default value: {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    }
  */
  intersectionObserverConfig: Partial<IntersectionObserverInit>;
}

export type NgxParallaxScrollConfig = Partial<ParallaxScrollConfigBase>;

export type NgxParallaxDirection = 'straight' | 'reverse';

export type InstanceChangeReason =
  | 'setInstance'
  | 'disable'
  | 'enable'
  | 'setProps'
  | 'setContent'
  | 'destroy';

export interface InstancesChanges {
  identifier: string;
  reason: InstanceChangeReason;
  instance: ParallaxScrollDirective;
}
