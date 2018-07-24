import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../../classes/bill';
import { Product } from '../../classes/product';
import { ProductType } from '../../classes/productType';
import { LoginProvider } from '../../providers/login/login';
import { ToastController } from 'ionic-angular';

@Injectable()
export class DataProvider {

  private url:string = 'https://vast-harbor-51468.herokuapp.com/v1';

  constructor(public http: HttpClient,
    private loginProvider: LoginProvider,
    private toastController: ToastController
  ) {
  }

  //---------------------------------------------------------------- bill functions ----------------------------------------------------------------
  getBills():Promise<Bill[]>{

    let specificUrl: string = this.url + "/bill/current/" + this.loginProvider.currentlyLoggedUser;

    return this.createHeader().then(header => {

      return this.http.get<Bill[]>(specificUrl, {headers:header}).toPromise()
      
      .then(
        data => {return data}
      )
      .catch((err:HttpErrorResponse) => {
        this.displayErrorToast(err);

        let emptyList:Bill[];
        return emptyList;
      });
    });
  }

  postBill(billToPost:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill/";

    let productsIds:Array<number> = new Array<number>(billToPost.products.length);

    let i:number;
    for (i = 0; i < billToPost.products.length; i++){
      productsIds[i] = billToPost.products[i].id;
    }

    let billToPostProcessed = {
      'tableId': billToPost.tableId,
      'guestsNumber': billToPost.guestsNumber,
      'waiterUsername': billToPost.waiterUsername,
      'productsIds': productsIds,
      'comment': billToPost.comment
    };

    return this.createHeader().then(header => {

      return this.http.post(specificUrl, JSON.stringify(billToPostProcessed), {headers:header, responseType: 'text'}).toPromise()
       .then((response:any) => {
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
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  cancelBill(billToCancel:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill/cancel/" + billToCancel.id;

    return this.createHeader().then(header => {

      return this.http.put(specificUrl, null, {headers:header, responseType: 'text'}).toPromise()
      .then((response:any) => { // fix to stop httpclient from parsing response with empty body
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
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  updateBill(billToPut:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill";

    let productsIds:Array<number> = new Array<number>(billToPut.products.length);

    let i:number;
    for (i = 0; i < billToPut.products.length; i++){
      productsIds[i] = billToPut.products[i].id;
    }

    let billToPutProcessed = {
      'id': billToPut.id,
      'tableId': billToPut.tableId,
      'guestsNumber': billToPut.guestsNumber,
      'waiterUsername': billToPut.waiterUsername,
      'productsIds': productsIds
    };

    return this.createHeader().then(header => {

      return this.http.put(specificUrl, JSON.stringify(billToPutProcessed), {headers:header, responseType: 'text'}).toPromise()
       .then((response:any) => {
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
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  closeBill(billToClose:Bill):Promise<boolean>{
    let specificUrl: string = this.url + "/bill/close/" + billToClose.id;

    return this.createHeader().then(header => {

      return this.http.put(specificUrl, null, {headers:header, responseType: 'text'}).toPromise()
      .then((response:any) => { // fix to stop httpclient from parsing response with empty body
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
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  //---------------------------------------------------------------- product types functions ----------------------------------------------------------------
  getProductTypes():Promise<ProductType[]>{

    let specificUrl: string = this.url + "/product_type/";

    return this.createHeader().then(header => {

      return this.http.get<ProductType[]>(specificUrl, {headers:header}).toPromise()
      
      .then(
        data => {return data}
        )
        .catch((err:HttpErrorResponse) => {
          this.displayErrorToast(err);

          let emptyList:ProductType[];
          return emptyList;
        });
    });
  }

  //---------------------------------------------------------------- products functions ----------------------------------------------------------------
  getProducts():Promise<Product[]>{
    let specificUrl: string = this.url + "/products/";

    return this.createHeader().then(header => {

      return this.http.get<Product[]>(specificUrl, {headers:header}).toPromise()
      
      .then(
        data => {
          for(let prod of data) prod.amount = 0; // we must zero them as satabase returns null
          return data;}
        )
        .catch((err:HttpErrorResponse) => {
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
        duration: 10000
      })
      toast.present();
    }

    else{
      let message:string;
      message = "else " + err.message;

      let toast = this.toastController.create({
        message: message,
        duration: 10000
      })
      toast.present();
    }
  }

}
