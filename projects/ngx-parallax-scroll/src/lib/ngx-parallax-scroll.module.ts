import { NgModule } from '@angular/core';
import { NgxParallaxScrollComponent } from './ngx-parallax-scroll.component';
import { ParallaxScrollDirective } from './ngx-parallax-scroll.directive';

@NgModule({
  declarations: [NgxParallaxScrollComponent, ParallaxScrollDirective],
  imports: [],
  exports: [NgxParallaxScrollComponent, ParallaxScrollDirective]
})
export class NgxParallaxScrollModule {}
