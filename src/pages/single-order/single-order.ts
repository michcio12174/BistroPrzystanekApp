import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bill } from "../../classes/bill"
import { Product } from "../../classes/product"
import { ProductType } from "../../classes/productType"
import { DataProvider } from '../../providers/data/data'
import { ToastController } from 'ionic-angular';//debug
import { Autosize } from 'ionic2-autosize';

@IonicPage()
@Component({
  selector: 'page-single-order',
  templateUrl: 'single-order.html'
})
export class SingleOrderPage {

  //all products
  private allProducts: Product[] = new Array<Product>();
  //all product types
  private productTypes: ProductType[] = new Array<ProductType>();

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

        //check if we go from scratch or editing a bill
        
        //we have bill
        if(this.navParams.get('bill')) {
          this.billFromScratch = false;

          this.currentOrder = this.navParams.get('bill');

          let index:number;
          for(let product of this.currentOrder.products){
            this.sumOfPrices += product.cost * product.amount;

            //finding the products already in the order and increasing their amount according to the order
            //in adding new product a amount from this.allProducts is displayed
            index = this.allProducts.findIndex((x:Product) => x.id == product.id);
            if(index >= 0) this.allProducts[index].amount = product.amount;
          }
        }
        
        //from scratch
        else {
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

  addProduct(productToAdd:Product, amount:number):void{
    let index = this.currentOrder.products.indexOf(productToAdd);//find index

    this.currentOrder.products[index].amount += amount;
    this.sumOfPrices += productToAdd.cost * amount;
  }

  removeProduct(productToRemove:Product, amount:number):void{
    let index = this.currentOrder.products.indexOf(productToRemove);//find index

    if(index >= 0){
      this.currentOrder.products[index].amount -= amount;

      this.sumOfPrices -= productToRemove.cost * amount;
    }
  }

  addOrderToDatabase():void{
    if(this.currentOrder.products && this.currentOrder.products.length > 0){

      if(this.billFromScratch){//we were creating new order
        this.dataProvider.postBill(this.currentOrder).then(response =>{
        if(response)
          this.navCtrl.setRoot('OrdersListPage');
        });
      }

      else{//we were editing order
        
        this.dataProvider.updateBill(this.currentOrder).then(response =>{
        if(response)
          this.navCtrl.setRoot('OrdersListPage');
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