import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleOrderPage } from './single-order';
import { PipesModule } from '../../pipes/pipes.module';
import { Autosize } from 'ionic2-autosize';

@NgModule({
  declarations: [
    SingleOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleOrderPage),
    PipesModule
  ],
})
export class SingleOrderPageModule {}
