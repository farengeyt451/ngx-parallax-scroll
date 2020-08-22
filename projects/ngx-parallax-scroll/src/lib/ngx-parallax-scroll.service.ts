import { Injectable } from '@angular/core';
import { ParallaxScrollDirective } from './ngx-parallax-scroll.directive';
import { Subject, Observable } from 'rxjs';
import { InstancesChanges, InstanceChangeReason } from './ngx-parallax.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NgxParallaxScrollService {
  private scrollInstances$ = new Subject<InstancesChanges>();
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
    this.emitInstancesChange('disable', identifier);
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
    this.emitInstancesChange('enable', identifier);
  }

  /**
   * Subscription to change of instances
   *
   * @returns { Observable<InstancesChanges> } observable of instances change
   */
  get instancesChanges(): Observable<InstancesChanges> {
    return this.scrollInstances$.asObservable();
  }

  /**
   * Service methods
   */
  private throwError(message: string, errorConstrictor: ErrorConstructor = Error) {
    throw new errorConstrictor(message);
  }

  private emitInstancesChange(reason: InstanceChangeReason, identifier: string) {
    const instance = this.instances.get(identifier);

    this.scrollInstances$.next({ identifier, reason, instance });
  }
}
