export interface IParallaxScrollConfig {
  // Set parallax speed, requared
  parallaxSpeed: number;

  // Set parallax smoothness (transition time), requared
  parallaxSmoothness: number;

  // Set parallax direction, optional, default - 'straight'
  parallaxDirection?: string;

  // Set parallax timing function for transition, optional, default - 'linear'
  parallaxTimingFunction?: string;

  // Set parallax throttle time (scroll throttling in ms), optional, default - '0ms'
  parallaxThrottleTime?: number;
}

export type ParallaxDirection = 'straight' | 'reverse';
