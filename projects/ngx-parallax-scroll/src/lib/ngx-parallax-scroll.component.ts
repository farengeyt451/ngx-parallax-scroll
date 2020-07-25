import { Component, OnInit, Input } from '@angular/core';
import { ParallaxScrollConfig } from './ngx-parallax.interfaces';

@Component({
  selector: 'ngx-parallax-scroll',
  template: ``,
  styles: [`.parallax-container display: inline-block;`],
})
export class NgxParallaxScrollComponent implements OnInit {
  @Input() config: ParallaxScrollConfig;

  constructor() {}

  ngOnInit() {}
}
