export class Bill{
    id:number;
    tableId:string = "0";
    guestsNumber:number = 0;
    waiterUsername:string = "-";
    productsIds:number[] = new Array<number>(); //id produktów w zamówieniu
}