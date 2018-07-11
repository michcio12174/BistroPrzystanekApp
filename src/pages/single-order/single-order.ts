import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bill } from "../../classes/bill"
import { Product } from "../../classes/product"
import { ProductType } from "../../classes/productType"
import { DataProvider } from '../../providers/data/data'
import { ToastController } from 'ionic-angular';//debug

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
  //products count - a index in an array corresponds to the product id nd number corresponds to how many was ordered
  private productCount: number[];

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
    public dataProvider:DataProvider,
    private toastController: ToastController,//debug
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

        let maxId:number = 0;

        //check what is the largest id number, so that productCount will be able to count all ids 
        for (let currentProduct of products){
          if(currentProduct.id > maxId) maxId = currentProduct.id;
        }

        this.productCount = new Array<number>(maxId);
        //zero the array
        for(let i = 0; i < maxId; i++){
          this.productCount[i] = 0;
        }
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

  goToOrderOverview():void{
    this.showTableChoice = false;
    this.showCurrentOrder = true;
    this.showAddingNewProduct = false;
  }

  chooseTable(tableNumber:string):void{
    this.goToOrderOverview();
    this.currentOrder.tableId = tableNumber;
  }

  addProduct(productToAdd:Product):void{
    this.productCount[productToAdd.id - 1] += 1;

    this.updateSum();
  }

  removeProduct(productToRemove:Product):void{
    if(this.productCount[productToRemove.id - 1] > 0){
      this.productCount[productToRemove.id - 1] -= 1;
    }

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
