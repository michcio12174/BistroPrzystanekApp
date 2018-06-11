import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthResponse } from '../../classes/authResponse';

//TODO przechowywanie tokena

@Injectable()
export class LoginProvider {

  private url:string = 'https://vast-harbor-51468.herokuapp.com/v1';
  private tokenPath:string = '/oauth/token';
  public currentlyLoggedUser: string;
  public authResponse: AuthResponse;

  constructor(private http: HttpClient,
    private storage: Storage) {
  }

  //Auth:
  //type: object
  //properties:
  //  grant_type:
  //    type: string
  //    description: "Always type 'password'"
  //  username:
  //    type: string
  //  password:
  //    type: string

  //sprawdza czy użytkownik istnieje w bazie i czy hasło jest poprawne
  //jeśli tak, to zmienna klasy subject zostaje ustawiona na dane subjecta i zapisuje zalogowanego w pamięci
  logIn(enteredUsername: string, enteredPassword: string): Promise<boolean> {
    let specificUrl: string = this.url + this.tokenPath;

    let myHeaders = new HttpHeaders({
      "Authorization": "Basic " + btoa('gop-client:bfjddf7$%534hdf##474sd&*nMdfWE3'),
      "Content-Type": "application/x-www-form-urlencoded"
    })

    let body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', enteredUsername)
      .set('password', enteredPassword);

    return this.http.post<AuthResponse>(specificUrl, body.toString(), {headers:myHeaders}).toPromise()
    .then(response => {
        console.log(response);
        
        this.storage.set('loggedUser', enteredUsername); //zapisuję sobie dane urzytkownika
        this.storage.set('currentToken', response); //zapisuję otrzymany token

        return true;
        
     }).catch(error => {
        console.log(error);
        return false;
     });
  }

  //check if a logged user data is stored in the memory
  isLoggedIn(): Promise<boolean>{
    return this.storage.get("loggedUser").then(response => {
      if (response) {
        console.log("here comes username red fro storage:");
        console.log(response);
        this.currentlyLoggedUser = response;
        return true;
      }
      else return false;
    });
  }

  logOut(): void{
    this.currentlyLoggedUser = null;
    this.storage.remove("loggedUser");
  }

}