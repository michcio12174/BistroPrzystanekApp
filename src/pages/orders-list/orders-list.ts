import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Bill } from '../../classes/bill';
import { Product } from '../../classes/product';
import { DataProvider } from '../../providers/data/data'
import { LoginProvider } from '../../providers/login/login'

@IonicPage()
@Component({
  selector: 'page-orders-list',
  templateUrl: 'orders-list.html',
})
export class OrdersListPage {

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

  goToOptions():void{
    this.navCtrl.push('SettingsPage')
  }
  
  makeNewBill():void{
    this.navCtrl.push('SingleOrderPage');
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

  viewAlert(billToEdit:Bill):void{
    let orderSummary:string = '';
    for(let currentProcuct of billToEdit.products){
      orderSummary += '&#x2022 ' + currentProcuct.name + ' x ' + currentProcuct.amount + '<br>';
    }

    let alert = this.alertCtrl.create({
      title: 'Zamówienie ' + billToEdit.id ,
      message: orderSummary,
      buttons: [
        {
          text: 'Wróć',
          role: 'cancel'
        },
        {
          text: 'Edytuj',
          handler: () => {
            this.navCtrl.push('SingleOrderPage', {bill: billToEdit});
          }
        }
      ]
    });
    alert.present();
  }
}
