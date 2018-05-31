import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings'
import { SingleOrderPage } from '../../pages/single-order/single-order';

@IonicPage()
@Component({
  selector: 'page-orders-list',
  templateUrl: 'orders-list.html',
})
export class OrdersListPage {

  private settingsPage = SettingsPage;
  private singleOrderPage = SingleOrderPage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersListPage');
  }
}
