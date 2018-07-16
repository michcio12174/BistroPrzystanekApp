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
    private toastController: ToastController,
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

    let billToPostProcessed = {
      'tableId': billToPost.tableId,
      'guestsNumber': billToPost.guestsNumber,
      'waiterUsername': billToPost.waiterUsername,
      'productsIds': billToPost.productsIds
    };

    return this.createHeader().then(header => {

      return this.http.post(specificUrl, JSON.stringify(billToPostProcessed), {headers:header}).toPromise()
      .then((response:HttpResponse<any>) => {
        if(response.status == 200){

          let toast = this.toastController.create({
            message: 'huraaaaaaaaaaa',
            duration: 5000
          })
          toast.present();
          return true;
        }
        else{
          let message:string = "Error, response code " + response.status.toString();

          let toast = this.toastController.create({
            message: message,
            duration: 5000
          })
          //toast.present();
 
          return false
        }
      })
      .catch((err:HttpErrorResponse) => {
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  cancelBill(billToCancel:Bill):void{
    let specificUrl: string = this.url + "/bill/cancel/" + billToCancel.id + "/";

    this.createHeader().then(header => {

      this.http.put(specificUrl, null, {headers:header}).toPromise()
      .then((response:HttpResponse<any>) => {
        if(response.status == 200){
          return true;
        }
        else{

          let toast = this.toastController.create({
            message: "Rachunek anulowany",
            duration: 5000
          })
          toast.present();
 
        }
      })
      .catch((err:HttpErrorResponse) => {
        this.displayErrorToast(err);
      });
    });
  }

  updateBill():void{
    //TODO
  }

  closeBill(billToClose:Bill){
    let specificUrl: string = this.url + "/bill/close/" + billToClose.id + "/";

    this.createHeader().then(header => {

      this.http.put(specificUrl, null, {headers:header}).toPromise()
      .then((response:HttpResponse<any>) => {
        if(response.status == 200){
          return true;
        }
        else{

          let toast = this.toastController.create({
            message: "Rachunek zamknięty",
            duration: 5000
          })
          toast.present();
 
        }
      })
      .catch((err:HttpErrorResponse) => {
        this.displayErrorToast(err);
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
        data => {return data}
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
