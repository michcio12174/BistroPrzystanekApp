import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../classes/user'
import { Storage } from '@ionic/storage'

@Injectable()
export class LoginProvider {

  private url = 'https://jsonplaceholder.typicode.com';

  constructor(public http: HttpClient,
    private storage: Storage) {
    console.log('Hello LoginProvider Provider');
  }

  //sprawdza czy użytkownik istnieje w bazie i czy hasło jest poprawne
  //jeśli tak, to zmienna klasy subject zostaje ustawiona na dane subjecta i zapisuje zalogowanego w pamięci
  logIn(mail: string, password: string): Promise<boolean> {
    let specificUrl: string = this.url + "/" + mail

    return this.http.get(this.url+'/users').toPromise().then(response => {
      return true;
     });
  }

  //check if a logged user data is stored in the memory
  isLoggedIn(): Promise<boolean>{
    return this.storage.get("loggedSubject").then(response => {
      //let subject: Subject = response as Subject;
      //if (subject) {
      //  this.currentlyLoggedSubject = subject;
        return true;
      //}
      //else return false;
    });
  }

  logOut(): void{
    //this.currentlyLoggedSubject = null;
    this.storage.remove("loggedSubject");
  }

}