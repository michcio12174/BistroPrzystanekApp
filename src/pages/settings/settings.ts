import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { HomePage } from '../home/home'

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private homePage = HomePage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loginProvider: LoginProvider) {
  }

  logOut():void{
    this.loginProvider.logOut();
    this.navCtrl.setRoot(this.homePage);
  }
}
