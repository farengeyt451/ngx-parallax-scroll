import { Component, OnInit, Input } from '@angular/core';
import { NgxParallaxScrollConfig } from './ngx-parallax.interfaces';

@Component({
  selector: 'ngx-parallax-scroll',
  template: ``,
  styles: [`.parallax-container display: inline-block;`],
})
export class NgxParallaxScrollComponent implements OnInit {
  @Input() config: NgxParallaxScrollConfig;

  constructor() {}

  ngOnInit() {}
}
