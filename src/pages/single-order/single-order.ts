import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Bill } from "../../classes/bill"
import { Product } from "../../classes/product"
import { ProductType } from "../../classes/productType"
import { DataProvider } from '../../providers/data/data'
import { ToastController } from 'ionic-angular';
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
    private toastController: ToastController,
    public alertCtrl: AlertController
  ){}

  ionViewWillEnter(){
    this.showTableChoice = true;
    this.showCurrentOrder = false;
    this.showAddingNewProduct = false;

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
    if(this.currentOrder.products && this.currentOrder.products.length > 0){
      this.showTableChoice = false;
      this.showCurrentOrder = true;
      this.showAddingNewProduct = false;
    }
    else{
      let toast = this.toastController.create({
        message: "Zamówienie jest puste",
        duration: 3000
      })
      toast.present();
    }
  }

  chooseTable(tableNumber:number):void{
    this.currentOrder.tableId = tableNumber;
  }

  addProduct(productToAdd:Product, amount:number):void{
    //I need to iterate the amount only once as javascript arrays hold references
    //therefore reference to product in allProducts ponts to the same thing as one pushed to currentOrder.products
    //in fact the passed product is reference takem from products array, so I can iterate its amount directly
    productToAdd.amount += amount;

    //managing list of products in order
    let index = this.currentOrder.products.findIndex(x => x.id == productToAdd.id);
    if(index < 0) this.currentOrder.products.push(productToAdd);

    //managing price
    this.recalculatePrice();
  }
  
  //see comment in function above
  removeProduct(productToRemove:Product, amount:number):void{

    //check if product was included in the order
    let index = this.currentOrder.products.findIndex(x => x.id == productToRemove.id);
    if(index >= 0){
      //it was, decrease amount, else do nothing as amount was 0
      productToRemove.amount -= amount;

      //do we have negative value or 0?
      if(productToRemove.amount <= 0){
        //yes, remove the product from bill
        this.currentOrder.products.splice(index, 1);

        productToRemove.amount = 0;
        
        //managing price
        this.recalculatePrice();
      }
    }
  }

  recalculatePrice():void{
    this.sumOfPrices = 0;

    for(let curProduct of this.currentOrder.products){
      this.sumOfPrices += curProduct.amount * curProduct.cost;
    }
  }

  showSummaryAlert():void{
    let orderSummary:string = '';
    for(let currentProcuct of this.currentOrder.products){
      orderSummary += '&#x2022 ' + currentProcuct.name + ' x ' + currentProcuct.amount + '<br>';
    }

    let titleString:string = 'Nowe zamówienie';
    if(this.currentOrder.id) titleString = 'Zamówienie ' + this.currentOrder.id;
    let alert = this.alertCtrl.create({
      title: titleString,
      message: orderSummary,
      buttons: [
        {
          text: 'Wróć',
          role: 'cancel'
        },
        {
          text: 'Zapisz',
          handler: () => {
            this.addOrderToDatabase();
          }
        }
      ]
    });
    alert.present();
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
        duration: 3000
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