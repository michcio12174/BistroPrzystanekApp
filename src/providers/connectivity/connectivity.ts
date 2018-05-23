import { Injectable } from '@angular/core';
//from cordova-plugin-network-information - check netwotk status on device
import { Network } from "@ionic-native/network"
import { Platform } from 'ionic-angular';


@Injectable()
export class ConnectivityProvider {

  private onDevice: boolean;
 
  constructor(
    private platform: Platform,
    private network: Network
  ){
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    if(this.onDevice){
      //Network.type zwraca string none jeśli nie ma połączenia lub inne stringi w zależności od tego jakie jest
      if(this.network.type == "none") return false;
      else return true;
    } 
    else {
      return navigator.onLine; 
    }
  }

}
