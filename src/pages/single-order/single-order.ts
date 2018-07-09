import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bill } from "../../classes/bill"
import { Product } from "../../classes/product"
import { ProductType } from "../../classes/productType"
import { DataProvider } from '../../providers/data/data'

@IonicPage()
@Component({
  selector: 'page-single-order',
  templateUrl: 'single-order.html',
})
export class SingleOrderPage {

  //products ordered
  private orderedProducts: Product[] = new Array<Product>();
  //all products
  private allProducts: Product[] = new Array<Product>();
  //all product types
  private productTypes: ProductType[] = new Array<ProductType>();

  private sumOfPrices: number = 5.5;

  //----------------flags controling state of the view----------------
  //decides whether display table choice part of view or products choice
  private showTableChoice:boolean;
  private showCurrentOrder:boolean;
  private showAddingNewProduct:boolean;


  //represents the current order
  private currentOrder:Bill;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataProvider:DataProvider
  ){}

  ionViewWillEnter(){
    this.showTableChoice = true;
    this.showCurrentOrder = false;
    this.showCurrentOrder = false;
    
    this.currentOrder = new Bill;

    //get available products and their types
    this.dataProvider.getProductTypes().then(productTypes =>{
      this.productTypes = productTypes;

      this.dataProvider.getProducts().then(products =>{
        this.allProducts = products;
      })
    })
  }

  goToTableChoice():void{
    this.showTableChoice = true;
    this.showCurrentOrder = false;
    this.showAddingNewProduct = false;
  }

  goToAddingProducts():void{
    this.showTableChoice = false;
    this.showCurrentOrder = false;
    this.showAddingNewProduct = true;
  }

  chooseTable(tableNumber:string):void{
    this.showTableChoice = false;
    this.showCurrentOrder = true;
    this.showAddingNewProduct = false;
    this.currentOrder.tableId = tableNumber;
  }

  addProduct():void{

    this.updateSum();
  }

  removeProduct():void{

  }

  addOrderToDatabase():void{

  }

  updateSum():void{
    let tempSum:number = 0;

    for(let orderedProduct of this.orderedProducts){
      tempSum += orderedProduct.cost;
    }

    this.sumOfPrices = tempSum;
  }
}
