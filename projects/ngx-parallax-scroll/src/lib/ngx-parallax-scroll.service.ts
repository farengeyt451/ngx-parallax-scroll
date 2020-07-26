import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxParallaxScrollConfig } from './ngx-parallax.interfaces';

interface ConfigChange {
  type: string;
  payload: NgxParallaxScrollConfig | null;
}

@Injectable({
  providedIn: 'root',
})
export class NgxParallaxScrollService {
  private parallaxInstances: Map<string, any> = new Map();

  private parallaxConfig = new Subject<ConfigChange>();
  public parallaxConfigChange = this.parallaxConfig.asObservable();

  constructor() {}

  setInstance(name: string, state: any) {
    this.parallaxInstances.set(name, state);
    this.parallaxInstances.forEach((el) => {
      console.log('log: NgxParallaxScrollService -> setInstance -> el', el);
      el.ngxParallaxScroll.speed = 200;
    });
  }

  /**
   * Set config
   *
   * @param config { NgxParallaxScrollConfig }
   */
  public setConfig(config: NgxParallaxScrollConfig) {
    this.parallaxConfig.next({
      type: 'config',
      payload: config,
    });
  }

  /**
   * Disable parallax scroll
   *
   * @param config { NgxParallaxScrollConfig }
   */
  public disableParallaxScroll() {
    this.parallaxConfig.next({
      type: 'disableParallaxScroll',
      payload: null,
    });
  }
}
