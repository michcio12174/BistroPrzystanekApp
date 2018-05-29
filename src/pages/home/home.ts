import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { LoginProvider } from '../../providers/login/login';
import { OrdersListPage } from "../orders-list/orders-list"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private username: string = "";
  private password: string = "";
  private pageAfterLogin = OrdersListPage;

  constructor(
    public navCtrl: NavController,
    private toastController: ToastController,
    private connectivityProvider: ConnectivityProvider,
    private loginProvider: LoginProvider
  ) {

  }

  login():void{
    //check if the device is online
    if (this.connectivityProvider.isOnline()) {
      //check if password and mail are not empty
      if (this.username != "" && this.password != "") {
        //attempting to log in with given credentials
        if (this.loginProvider.logIn(this.username, this.password)) this.loginSuccessfull();

        else this.loginUnsuccessfull();
      }
      //if passford or mail are empty
      else {
        let toast = this.toastController.create({
          message: "Wprowadź login i hasło",
          duration: 4000
        })
        toast.present();
      }
    }
    //if device is offline
    else {
      let toast = this.toastController.create({
        message: "Jesteś offline - włącz transmisję danych lub połącz się z siecią wifi.",
        duration: 4000
      })
      toast.present();
    }
  }

  //informuje, że logowanie się udało i zmienia stronę domową
  private loginSuccessfull(): void {
    let toast = this.toastController.create({
      message: "Logowanie przebiegło pomyślnie",
      duration: 4000
    });
    toast.present();
    this.navCtrl.setRoot(this.pageAfterLogin);
  }

  //informuje, że logowanie się nie udało
  private loginUnsuccessfull(): void {
    let toast = this.toastController.create({
      message: "Błąd. Niepoprawny login lub hasło?",
      duration: 4000
    })
    toast.present();
  }
}
