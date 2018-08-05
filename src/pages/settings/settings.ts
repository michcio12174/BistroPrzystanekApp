import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private homePage = HomePage;

  constructor(
    public navCtrl: NavController, 
    public loginProvider: LoginProvider) {
  }

  logOut():void{
    this.loginProvider.logOut();
    this.navCtrl.setRoot(this.homePage);
  }
}
