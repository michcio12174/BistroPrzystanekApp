import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthResponse } from '../../classes/authResponse';
import { ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class LoginProvider {

  private url:string = 'https://vast-harbor-51468.herokuapp.com/v1';
  private tokenPath:string = '/oauth/token';

  public currentlyLoggedUser: string;

  constructor(private http: HttpClient,
    private storage: Storage,
    private toastController: ToastController,
    private loadingCtrl: LoadingController
  ) {
  }

  //sprawdza czy użytkownik istnieje w bazie i czy hasło jest poprawne
  logIn(enteredUsername: string, enteredPassword: string): Promise<boolean> {
    let specificUrl: string = this.url + this.tokenPath;

    //information about type of authorisation is followed by base64 username:password
    let myHeaders = new HttpHeaders({
      "Authorization": "Basic " + btoa('gop-client:bfjddf7$%534hdf##474sd&*nMdfWE3'),
      "Content-Type": "application/x-www-form-urlencoded"
    })

    let body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', enteredUsername.trim())
      .set('password', enteredPassword.trim());

    //setting the loading spinner
    let loading = this.loadingCtrl.create({
      content: 'Loguję...'
    });
    loading.present();

    return this.http.post<AuthResponse>(specificUrl, body, {headers:myHeaders}).toPromise()
    .then(response => {
        
      this.storage.set('loggedUser', enteredUsername); //zapisuję sobie dane urzytkownika
      this.storage.set('currentToken', JSON.stringify(response)); //zapisuję otrzymany token
      let currentDate = new Date();
      this.storage.set('tokenExpirationDate', new Date(currentDate.getTime() + (response.expires_in * 1000))); //zapisuję kiedy token straci ważność
        
      this.currentlyLoggedUser = enteredUsername.trim();//zapamiętuję nazwę urzytkownika

      loading.dismiss();
      return true;
        
     }).catch(error => {
      console.log(error);
      loading.dismiss();
      return false;
     });
  }

  //check if a logged user data is stored in the memory
  isLoggedIn(): Promise<boolean>{
    return this.storage.get("loggedUser").then(response => {
      if (response) {
        this.currentlyLoggedUser = response;

        return this.checkIfTokenExpired();
      }
      else return false;
    });
  }

  logOut(): void{
    this.currentlyLoggedUser = null;
    this.storage.remove("loggedUser");
  }

  //retreive token from memory as JSON string and parse it
  getCurrentToken(): Promise<AuthResponse>{
    return this.storage.get("currentToken").then(token => {
      let parsedToken:AuthResponse = JSON.parse(token);
      return parsedToken;
    });
  }

  checkIfTokenExpired():Promise<boolean>{
    return this.storage.get('currentToken').then((token:AuthResponse) => {
      
      if (token) {
        return this.storage.get('tokenExpirationDate').then((expirationDate:Date) =>{
          
          if(expirationDate.getTime() < (new Date()).getTime()) return false;
          else return true;

        });
      }
      else return false
    });
  }
}