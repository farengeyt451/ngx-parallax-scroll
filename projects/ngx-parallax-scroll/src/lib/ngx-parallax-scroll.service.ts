import { Injectable } from '@angular/core';
import { ParallaxScrollDirective } from './ngx-parallax-scroll.directive';

@Injectable({
  providedIn: 'root',
})
export class NgxParallaxScrollService {
  private parallaxInstances: Map<string, ParallaxScrollDirective> = new Map();

  constructor() {}

  /**
   * Working with storage
   */

  /**
   * Write instances to storage
   *
   * @param identifier { string }
   * @param instance { ParallaxScrollDirective }
   */
  setInstance(identifier: string, instance: ParallaxScrollDirective) {
    this.parallaxInstances.set(identifier, instance);
  }

  /**
   * Get specific instance
   *
   * @param identifier { string }
   * @returns { ParallaxScrollDirective | null }
   */
  public getInstance(identifier: string): ParallaxScrollDirective | null {
    return this.parallaxInstances.has(identifier) ? this.parallaxInstances.get(identifier) : null;
  }

  /**
   * Get all instances
   *
   * @returns { Map<string, ParallaxScrollDirective> | null }
   */
  public getInstances(): Map<string, ParallaxScrollDirective> | null {
    return this.parallaxInstances.size ? this.parallaxInstances : null;
  }

  /**
   * Methods
   */

  /**
   * Disable parallax scroll
   *
   * @param identifier { string }
   */
  public disableParallaxScroll(identifier: string) {
    if (!this.parallaxInstances.has(identifier)) {
      this.throwError(`Instance with identifier '${identifier}' does not exist`);
    }

    this.parallaxInstances.get(identifier).disable();
  }

  /**
   * Enable parallax scroll
   *
   * @param identifier { string }
   */
  public enableParallaxScroll(identifier: string) {
    if (!this.parallaxInstances.has(identifier)) {
      this.throwError(`Instance with identifier '${identifier}' does not exist`);
    }

    this.parallaxInstances.get(identifier).enable();
  }

  private throwError(message: string, errorConstrictor: ErrorConstructor = Error) {
    throw new errorConstrictor(message);
  }
}
