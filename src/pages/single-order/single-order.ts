import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bill } from "../../classes/bill"
import { Product } from "../../classes/product"
import { ProductType } from "../../classes/productType"
import { DataProvider } from '../../providers/data/data'
import { OrdersListPage } from "../orders-list/orders-list"
import { ToastController } from 'ionic-angular';//debug

@IonicPage()
@Component({
  selector: 'page-single-order',
  templateUrl: 'single-order.html',
})
export class SingleOrderPage {

  //all products
  private allProducts: Product[] = new Array<Product>();
  //all product types
  private productTypes: ProductType[] = new Array<ProductType>();
  //products count - 
  //an index in an array corresponds to the product id and number corresponds to how many was ordered
  //indexes/ids are offset by one - id 1 is in the 0th element of the array
  //remeber whan using it!
  private productCount: number[];

  private sumOfPrices: number = 0;

  //----------------flags controling state of the view----------------
  //decides whether display table choice part of view or products choice
  private showTableChoice:boolean;
  private showCurrentOrder:boolean;
  private showAddingNewProduct:boolean;
  //----------------flag controling method of saving bill----------------
  private billFromScratch:boolean;


  //represents the current order
  private currentOrder:Bill = new Bill;

  //where to go after bill is posted
  private pageAfterPostingBill = OrdersListPage;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataProvider:DataProvider,
    private toastController: ToastController//debug
  ){}

  ionViewWillEnter(){
    this.showTableChoice = true;
    this.showCurrentOrder = false;
    this.showCurrentOrder = false;

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

        //check if we go from scratch or editing a bill
        if(this.navParams.get('bill')) {//we have bill
          this.billFromScratch = false;

          this.currentOrder = this.navParams.get('bill');

          for(let product of this.currentOrder.products){
            this.productCount[product.id - 1] += 1;//adding to array that counts number of items
            this.sumOfPrices += product.cost;
          }
        }

        else {//from scratch
          this.billFromScratch = true;
          this.currentOrder = new Bill;
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
    if(this.currentOrder.guestsNumber != 0 && this.currentOrder.tableId != 0)
    {
      this.showTableChoice = false;
      this.showCurrentOrder = true;
      this.showAddingNewProduct = false;
    }
    else{
      let toast = this.toastController.create({
        message: "Wybierz stolik i liczbę gości",
        duration: 5000
      })
      toast.present();
    }
  }

  chooseTable(tableNumber:number):void{
    this.currentOrder.tableId = tableNumber;
  }

  addProduct(productToAdd:Product):void{
    this.productCount[productToAdd.id - 1] += 1;//adding to array that counts number of items
    this.currentOrder.products.push(productToAdd);//adding to the order object

    this.sumOfPrices += productToAdd.cost;
  }

  removeProduct(productToRemove:Product):void{
    if(this.productCount[productToRemove.id - 1] > 0){
      this.productCount[productToRemove.id - 1] -= 1;//remove from counting array

      let index = this.currentOrder.products.indexOf(productToRemove)//find index and remove
      this.currentOrder.products.splice(index, 1);
      
    this.sumOfPrices -= productToRemove.cost;
    }
  }

  addOrderToDatabase():void{
    if(this.currentOrder.products && this.currentOrder.products.length > 0){

      if(this.billFromScratch){//we were creating new order
        this.dataProvider.postBill(this.currentOrder).then(response =>{
        if(response)
          this.navCtrl.setRoot(this.pageAfterPostingBill);
        });
      }

      else{//we were editing order
        
        this.dataProvider.updateBill(this.currentOrder).then(response =>{
        if(response)
          this.navCtrl.setRoot(this.pageAfterPostingBill);
        });
      }
      
    }
    else{
      let toast = this.toastController.create({
        message: "Zamówienie jest puste",
        duration: 5000
      })
      toast.present();
    }
    
  }
  
  //-----------------------------------------functions for order overview-----------------------------------------

  getProductName(productId:number):string{
    return (this.allProducts.find(currentProduct => currentProduct.id == productId)).name;
  }

  getProductPrice(productId:number):number{
    return (this.allProducts.find(currentProduct => currentProduct.id == productId)).cost;
  }
}