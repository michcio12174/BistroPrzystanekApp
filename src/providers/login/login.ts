import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../classes/user'

@Injectable()
export class LoginProvider {

  private url = 'url';

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider');
  }

  //kontroluje proces logowania
  logIn(mail: string, password: string): Promise<boolean> {
    return this.checkCredentials(mail, password).then(response => {
      return response;
    });
  }

  //sprawdza czy użytkownik istnieje w bazie i czy hasło jest poprawne
  //jeśli tak, to zmienna klasy subject zostaje ustawiona na dane subjecta i zapisuje zalogowanego w pamięci
  private checkCredentials(mail: string, password: string): Promise<boolean> {
    let specificUrl: string = this.url + "/" + mail
    return this.http.get(specificUrl).
      toPromise().
      then(response => {
        return true;
      })
  }
}

