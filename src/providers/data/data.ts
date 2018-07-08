import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
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

  postBill():void{

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


  //creating header of the request with token from storage
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

  displayErrorToast(err:HttpErrorResponse):void{
    if (err.error instanceof Error){

      let message:string;
      message = "else " +  err.error.message;

      let toast = this.toastController.create({
        message: message,
        duration: 4000
      })
      toast.present();

    }

    else{
      let message:string;
      message = err.message;

      let toast = this.toastController.create({
        message: message,
        duration: 10000
      })
      toast.present();
    }
  }

}
