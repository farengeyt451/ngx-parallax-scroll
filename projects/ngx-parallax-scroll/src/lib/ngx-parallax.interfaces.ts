export interface ParallaxScrollConfig {
  // Set parallax speed, required
  speed?: number;

  // Set parallax smoothness (transition time), required
  smoothness?: number;

  // Set parallax direction, optional, default - 'straight'
  direction?: ParallaxDirection;

  // Set parallax timing function for transition, optional, default - 'linear'
  timingFunction?: string;

  // Set parallax throttle time (scroll throttling in ms), optional, default - '0ms'
  throttleT?: number;
}

export type ParallaxDirection = 'straight' | 'reverse';
