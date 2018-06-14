import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bill } from "../../classes/bill"
import { Product } from "../../classes/product"
import { ProductType } from "../../classes/productType"

@IonicPage()
@Component({
  selector: 'page-single-order',
  templateUrl: 'single-order.html',
})
export class SingleOrderPage {

  private orderedProducts: Product[] = new Array<Product>();
  private productTypes: ProductType[] = new Array<ProductType>();
  private sumOfPrices: number = 5.5;
  //decides whether display table choice part of view or products choice
  private tableWasChosen:boolean;
  //represents the current order
  private currentOrder:Bill;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    let product1:Product = new Product();
    product1.cost = 10.4;
    product1.name = "product1";
    product1.typeID = 1;

    let product2:Product = new Product();
    product2.cost = 14.34;
    product2.name = "product2";
    product2.typeID = 3;
    
    this.orderedProducts.push(product1)
    this.orderedProducts.push(product2)

    this.updateSum();
  }

  ionViewDidLoad() {
    this.tableWasChosen = false;
    this.currentOrder = new Bill;
  }

  chooseTable(tableNumber:string):void{
    this.tableWasChosen = true;
    this.currentOrder.tableId = tableNumber;
  }

  addProduct():void{

    this.updateSum();
  }

  removeProduct():void{

  }

  addOrder():void{

  }

  updateSum():void{
    let tempSum:number = 0;

    for(let orderedProduct of this.orderedProducts){
      tempSum += orderedProduct.cost;
    }

    this.sumOfPrices = tempSum;
  }
}
