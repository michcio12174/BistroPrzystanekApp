import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from "@ionic-native/network"
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule  } from '@ionic/storage';

//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OrdersListPage } from '../pages/orders-list/orders-list';
import { SettingsPage } from '../pages/settings/settings';
import { SingleOrderPage } from '../pages/single-order/single-order';

//providers
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { LoginProvider } from '../providers/login/login';
import { DataProvider } from '../providers/data/data';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OrdersListPage,
    SettingsPage,
    SingleOrderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectivityProvider,
    Network,
    LoginProvider,
    DataProvider
  ]
})
export class AppModule {}
