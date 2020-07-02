export interface ParallaxScrollConfig {
  speed?: number;
  smoothness?: number;
  direction?: ParallaxDirection;
  timingFunction?: string;
  throttleT?: number;
}

export type ParallaxDirection = 'straight' | 'reverse';
