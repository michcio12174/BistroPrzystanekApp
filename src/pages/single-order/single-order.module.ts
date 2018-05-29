import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleOrderPage } from './single-order';

@NgModule({
  declarations: [
    SingleOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleOrderPage),
  ],
})
export class SingleOrderPageModule {}
