import { Product } from './product'

export class Bill{
    id:number;
    tableId:number = 0;
    guestsNumber:number = 0;
    waiterUsername:string = "-";
    products:Product[] = new Array<Product>(); //id produktów w zamówieniu
}