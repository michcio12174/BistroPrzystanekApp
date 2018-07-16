import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
    public alertCtrl: AlertController
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

  //-----------------------------functions displaying popups-----------------------------
  cancelAlert(billToCancel:Bill):void{
    let alert = this.alertCtrl.create({
      title: 'Czy ma pewno chcesz anulować?',
      message: 'Ta akcja jest nieodwracalna.',
      buttons: [
        {
          text: 'Wróć',
          role: 'cancel'

        },
        {
          text: 'Anuluj rachunek',
          handler: () => {
            this.dataProvider.cancelBill(billToCancel).then(() => {this.getOrders()});
          }
        }
      ]
    });
    alert.present();
  }

  closeAlert(billToClose:Bill):void{
    let alert = this.alertCtrl.create({
      title: 'Czy na pewno chcesz zakmnąć?',
      message: 'Ta akcja jest nieodwracalna.',
      buttons: [
        {
          text: 'Wróć',
          role: 'cancel'
        },
        {
          text: 'Zamknij rachunek',
          handler: () => {
            this.dataProvider.closeBill(billToClose).then(() => {this.getOrders()});
          }
        }
      ]
    });
    alert.present();
  }

  editBill():void{

  }
}
