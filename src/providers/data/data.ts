import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../../classes/bill';
import { Product } from '../../classes/product';
import { ProductType } from '../../classes/productType';
import { LoginProvider } from '../../providers/login/login';
import { ToastController, LoadingController, Loading } from 'ionic-angular';
import { jsonpCallbackContext } from '../../../node_modules/@angular/common/http/src/module';

@Injectable()
export class DataProvider {

  private url:string = 'https://vast-harbor-51468.herokuapp.com/v1';
  private spinner:Loading;

  constructor(public http: HttpClient,
    private loginProvider: LoginProvider,
    private toastController: ToastController,
    private loadingCtrl: LoadingController
  ) {
  }

  //---------------------------------------------------------------- bill functions ----------------------------------------------------------------
  getBills():Promise<Bill[]>{

    let specificUrl: string = this.url + "/bill/current/" + this.loginProvider.currentlyLoggedUser;

    this.startSpinner('Pobieram listę rachunków...')

    return this.createHeader().then(header => {

      return this.http.get<Bill[]>(specificUrl, {headers:header}).toPromise()
      .then(
        data => {
          this.stopSpinner();
          return data;
        }
      )
      .catch((err:HttpErrorResponse) => {
        this.stopSpinner()
        this.displayErrorToast(err);

        let emptyList:Bill[];
        return emptyList;
      });
    });
  }

  postBill(billToPost:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill/";

    this.startSpinner('Zapisuję rachunek...');

    let productsIdsAndAmounts = new Object();

    let i:number;
      for (i = 0; i < billToPost.products.length; i++){
      productsIdsAndAmounts[billToPost.products[i].id.toString()] = billToPost.products[i].amount;
    }

    let billToPostProcessed = {
      'tableId': billToPost.tableId,
      'guestsNumber': billToPost.guestsNumber,
      'waiterUsername': billToPost.waiterUsername,
      'productsIds': productsIdsAndAmounts,
      'comment': billToPost.comment
    };

    return this.createHeader().then(header => {

      return this.http.post(specificUrl, JSON.stringify(billToPostProcessed), {headers:header, responseType: 'text'}).toPromise()
       .then((response:any) => {
         this.stopSpinner();
         return true;
       })

      // return this.http.post(specificUrl, JSON.stringify(billToPostProcessed), {headers:header}).toPromise()
      // .then((response:HttpResponse<any>) => {
      //   if(response.status == 200){

      //     return true;
      //   }
      //   else{
      //     let message:string = "Error, response code " + response.status.toString();

      //     let toast = this.toastController.create({
      //       message: message,
      //       duration: 5000
      //     })
      //     toast.present();
 
      //     return false;
      //   }
      // })
      .catch((err:HttpErrorResponse) => {
        this.stopSpinner();
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  updateBill(billToPut:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill";

    this.startSpinner("Edytuję rachunek...");

    let productsIdsAndAmounts = new Object();

    let i:number;
    for (i = 0; i < billToPut.products.length; i++){
      productsIdsAndAmounts[billToPut.products[i].id.toString()] = billToPut.products[i].amount;
    }

    let billToPutProcessed = {
      'id': billToPut.id,
      'tableId': billToPut.tableId,
      'guestsNumber': billToPut.guestsNumber,
      'waiterUsername': billToPut.waiterUsername,
      'productsIds': productsIdsAndAmounts
    };

    return this.createHeader().then(header => {

      return this.http.put(specificUrl, JSON.stringify(billToPutProcessed), {headers:header, responseType: 'text'}).toPromise()
       .then((response:any) => {
         this.stopSpinner();
         return true;
       })

      // return this.http.put(specificUrl, JSON.stringify(billToPutProcessed), {headers:header}).toPromise()
      // .then((response:HttpResponse<any>) => {
      //   if(response.status == 200){

      //     return true;
      //   }
      //   else{
      //     let message:string = "Error, response code " + response.status.toString();

      //     let toast = this.toastController.create({
      //       message: message,
      //       duration: 5000
      //     })
      //     toast.present();
 
      //     return false;
      //   }
      // })
      .catch((err:HttpErrorResponse) => {
        this.stopSpinner();
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  cancelBill(billToCancel:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill/cancel/" + billToCancel.id;

    this.startSpinner('Anuluję rachunek...');

    return this.createHeader().then(header => {

      return this.http.put(specificUrl, null, {headers:header, responseType: 'text'}).toPromise()
      .then((response:any) => { // fix to stop httpclient from parsing response with empty body
        this.stopSpinner();
        return true;
      })

      // return this.http.put(specificUrl, null, {headers:header}).toPromise()
      // .then((response:HttpResponse<any>) => {
      //   if(response.status == 200){

      //     let toast = this.toastController.create({
      //       message: "Rachunek anulowany",
      //       duration: 5000
      //     })
      //     toast.present();

      //     return true;
      //   }
      //   else{

      //     let toast = this.toastController.create({
      //       message: "Błąd " + response.status.toString(),
      //       duration: 5000
      //     })
      //     toast.present();

      //     return false;
      //   }
      // })
      .catch((err:HttpErrorResponse) => {
        this.stopSpinner();
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  closeBill(billToClose:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill/close/" + billToClose.id;

    this.startSpinner('Zamukam rachunek...');

    return this.createHeader().then(header => {

      return this.http.put(specificUrl, null, {headers:header, responseType: 'text'}).toPromise()
      .then((response:any) => { // fix to stop httpclient from parsing response with empty body
        this.stopSpinner();
        return true;
      })
      
      //return this.http.put(specificUrl, null, {headers:header}).toPromise()
      // .then((response:HttpResponse<any>) => {
      //   if(response.status == 200){

      //     let toast = this.toastController.create({
      //       message: "Rachunek zamknięty",
      //       duration: 5000
      //     })
      //     toast.present();

      //     return true;
      //   }
      //   else{

      //     let toast = this.toastController.create({
      //       message: "Błąd " + response.status.toString(),
      //       duration: 5000
      //     })
      //     toast.present();

      //     return false;
      //   }
      // })
      .catch((err:HttpErrorResponse) => {
        this.stopSpinner();
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  //---------------------------------------------------------------- product types functions ----------------------------------------------------------------
  getProductTypes():Promise<ProductType[]>{

    let specificUrl: string = this.url + "/product_type/";

    this.startSpinner('Pobieram typy produktów...');

    return this.createHeader().then(header => {

      return this.http.get<ProductType[]>(specificUrl, {headers:header}).toPromise()
      
      .then(
        data => {
          this.stopSpinner();
          return data;
        }
        )
        .catch((err:HttpErrorResponse) => {
          this.stopSpinner();
          this.displayErrorToast(err);

          let emptyList:ProductType[];
          return emptyList;
        });
    });
  }

  //---------------------------------------------------------------- products functions ----------------------------------------------------------------
  getProducts():Promise<Product[]>{
    let specificUrl: string = this.url + "/products/";

    this.startSpinner('Pobieram listę produktów...')

    return this.createHeader().then(header => {

      return this.http.get<Product[]>(specificUrl, {headers:header}).toPromise()
      
      .then(
        data => {
          for(let prod of data) prod.amount = 0; // we must zero them as database returns null
          this.stopSpinner();
          return data;
        }
        )
        .catch((err:HttpErrorResponse) => {
          this.stopSpinner();
          this.displayErrorToast(err);

          let emptyList:Product[];
          return emptyList;
        });
    });
  }


  //---------------------------------------------------------------- header creation ----------------------------------------------------------------
  createHeader():Promise<HttpHeaders>{

    return this.loginProvider.getCurrentToken().then(parsedToken => {

      let myHeaders = new HttpHeaders({
        "Authorization": "Bearer " + parsedToken.access_token,
        "Content-Type": "application/json",
        "Company-id": "1",
      })

      return myHeaders;
    });
  }

  //---------------------------------------------------------------- error signaling ----------------------------------------------------------------
  displayErrorToast(err:HttpErrorResponse):void{
    if (err.error instanceof Error){

      let message:string;
      message = "if " +  err.error.message;

      let toast = this.toastController.create({
        message: message,
        duration: 5000
      })
      toast.present();
    }

    else{
      let message:string;
      message = "else " + err.message;

      let toast = this.toastController.create({
        message: message,
        duration: 5000
      })
      toast.present();
    }
  }

  //---------------------------------------------------------------- spinner control ----------------------------------------------------------------
  startSpinner(message:string):void{

    this.spinner = this.loadingCtrl.create({
      content: message
    });
    this.spinner.present();
  }

  stopSpinner():void{
    this.spinner.dismiss();
  }

}
