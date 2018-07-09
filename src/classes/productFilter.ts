import { Pipe, PipeTransform } from '@angular/core';
import { Product } from "./product"

//pipe filters array of products and returns ony those with given product category id

@Pipe({name: 'productFilter'})
export class ProductFilterPipe implements PipeTransform {

    transform(products: Product[], id: number): Product[] {
        return products.filter(product => product.typeId == id);
      }
}