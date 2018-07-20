import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { LoginProvider } from '../../providers/login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private username: string = "";
  private password: string = "";

  constructor(
    public navCtrl: NavController,
    private toastController: ToastController,
    private connectivityProvider: ConnectivityProvider,
    private loginProvider: LoginProvider
  ) {
  }

  ionViewWillEnter(){
    this.loginProvider.isLoggedIn().then(response => {
      if(response) this.navCtrl.setRoot('OrdersListPage');
    })
  }

  login():void{
    //check if the device is online
    if (this.connectivityProvider.isOnline()) {
      //check if password and mail are not empty
      if (this.username != "" && this.password != "") {
        //attempting to log in with given credentials
        this.loginProvider.logIn(this.username, this.password).then(response =>{
          if (response) this.loginSuccessfull();
          else this.loginUnsuccessfull();
        }) 
      }
      //if passford or mail are empty
      else {
        let toast = this.toastController.create({
          message: "Wprowadź login i hasło",
          duration: 3000
        })
        toast.present();
      }
    }
    //if device is offline
    else {
      let toast = this.toastController.create({
        message: "Jesteś offline - włącz transmisję danych lub połącz się z siecią wifi.",
        duration: 3000
      })
      toast.present();
    }
  }

  //informuje, że logowanie się udało i zmienia stronę domową
  private loginSuccessfull(): void {
    let toast = this.toastController.create({
      message: "Logowanie przebiegło pomyślnie",
      duration: 3000
    });
    toast.present();
    this.navCtrl.setRoot('OrdersListPage');
  }

  //informuje, że logowanie się nie udało
  private loginUnsuccessfull(): void {
    let toast = this.toastController.create({
      message: "Błąd. Niepoprawny login lub hasło?",
      duration: 3000
    })
    toast.present();
  }
}
