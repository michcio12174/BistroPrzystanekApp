import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../../classes/bill';
import { Product } from '../../classes/product';
import { ProductType } from '../../classes/productType';
import { LoginProvider } from '../../providers/login/login';
import { ToastController } from 'ionic-angular';//debug

@Injectable()
export class DataProvider {

  private url:string = 'https://vast-harbor-51468.herokuapp.com/v1';

  constructor(public http: HttpClient,
    private loginProvider: LoginProvider,
    private toastController: ToastController,//debug
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

    return this.createHeader().then(header => {

      return this.http.post(specificUrl, JSON.stringify(billToPost), {headers:header}).toPromise()
      .then((response:HttpResponse<any>) => {
        if(response.status == 200){

          let toast = this.toastController.create({
            message: "success",
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
          toast.present();
 
          return false
        }
      })
      .catch((err:HttpErrorResponse) => {
        this.displayErrorToast(err);
        return false;
      });
    });
  }

  deleteBill():void{

  }

  updateBill():void{

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
        duration: 5000
      })
      toast.present();

    }

    else{
      let message:string;
      message = "else " + err.message + err.statusText;

      let toast = this.toastController.create({
        message: message,
        duration: 5000
      })
      toast.present();
    }
  }

}
