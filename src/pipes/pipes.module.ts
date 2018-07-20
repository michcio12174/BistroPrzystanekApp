import { NgModule } from '@angular/core';
import { ProductFilterPipe } from './product-filter/product-filter';
@NgModule({
	declarations: [ProductFilterPipe,
    ProductFilterPipe],
	imports: [],
	exports: [ProductFilterPipe,
    ProductFilterPipe]
})
export class PipesModule {}
