import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../classes/user'

@Injectable()
export class LoginProvider {

  private url = 'https://jsonplaceholder.typicode.com';

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }

  //sprawdza czy użytkownik istnieje w bazie i czy hasło jest poprawne
  //jeśli tak, to zmienna klasy subject zostaje ustawiona na dane subjecta i zapisuje zalogowanego w pamięci
  logIn(mail: string, password: string): Promise<boolean> {
    let specificUrl: string = this.url + "/" + mail

    return new Promise(resolve => {
      this.http.get(this.url+'/users').subscribe(data => {
        resolve(true);
      }, err => {
         console.log(err);
      });
     });
  }

}