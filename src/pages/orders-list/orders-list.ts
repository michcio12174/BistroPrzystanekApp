import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings'
import { SingleOrderPage } from '../../pages/single-order/single-order';
import { Bill } from '../../classes/bill';
import { DataProvider } from '../../providers/data/data'
import { LoginProvider } from '../../providers/login/login'

@IonicPage()
@Component({
  selector: 'page-orders-list',
  templateUrl: 'orders-list.html',
})
export class OrdersListPage {

  private settingsPage = SettingsPage;
  private singleOrderPage = SingleOrderPage;
  private bills:Bill[];
  private username:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public dataProvider: DataProvider,
    public loginProvider: LoginProvider,
  ) {
  }

  ionViewWillEnter(){
    this.getOrders();
    this.username = this.loginProvider.currentlyLoggedUser;
  }

  getOrders():void{
    this.dataProvider.getBills().then(obtainedBills =>{
      this.bills = obtainedBills;

    }).catch(error =>{
      console.log(error);
    })
  }

  cancelBill():void{

  }
}
