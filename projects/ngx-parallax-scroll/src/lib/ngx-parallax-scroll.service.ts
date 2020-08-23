import { Injectable, isDevMode } from '@angular/core';
import { ParallaxScrollDirective } from './ngx-parallax-scroll.directive';
import { Subject, Observable } from 'rxjs';
import { StateChanges, StateChangesReason } from './ngx-parallax.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NgxParallaxScrollService {
  private parallaxScrollState$ = new Subject<StateChanges>();
  private instances: Map<string, ParallaxScrollDirective> = new Map();

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
    this.instances.set(identifier, instance);
  }

  /**
   * Get specific instance
   *
   * @param identifier { string }
   * @returns { ParallaxScrollDirective | null }
   */
  public getInstance(identifier: string): ParallaxScrollDirective | null {
    return this.instances.has(identifier) ? this.instances.get(identifier) : null;
  }

  /**
   * Get all instances
   *
   * @returns { Map<string, ParallaxScrollDirective> | null }
   */
  public getInstances(): Map<string, ParallaxScrollDirective> | null {
    return this.instances.size ? this.instances : null;
  }

  /**
   * Methods
   */

  /**
   * Disable parallax scroll
   *
   * @param identifier { string }
   */
  public disable(identifier: string) {
    if (!this.instances.has(identifier)) {
      this.throwError(`Instance with identifier '${identifier}' does not exist`);
    }
    this.instances.get(identifier).disable();
  }

  /**
   * Enable parallax scroll
   *
   * @param identifier { string }
   */
  public enable(identifier: string) {
    if (!this.instances.has(identifier)) {
      this.throwError(`Instance with identifier '${identifier}' does not exist`);
    }
    this.instances.get(identifier).enable();
  }

  /**
   * Subscription to change of instances
   *
   * @returns { Observable<StateChanges> } observable of instances change
   */
  get stateChanges(): Observable<StateChanges> {
    return this.parallaxScrollState$.asObservable();
  }

  /**
   * Service methods
   */
  private throwError(message: string, errorConstrictor: ErrorConstructor = Error) {
    if (!isDevMode()) return;
    throw new errorConstrictor(message);
  }

  emitStateChange(
    identifier: string,
    reason: StateChangesReason,
    instance: ParallaxScrollDirective
  ) {
    this.parallaxScrollState$.next({ identifier, reason, instance });
  }
}
