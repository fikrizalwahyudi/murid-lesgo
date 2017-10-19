import { Component, EventEmitter } from '@angular/core';
import { Platform, LoadingController, AlertController, NavController, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { CartPage } from '../pages/cart/cart';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { Network } from '@ionic-native/network';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Helper } from '../providers/helper';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [Helper]
})
export class MyApp {
  rootPage: any;
  pushObject: PushObject;

  constructor(
    public platform: Platform,
    public LoadingController: LoadingController,
    public network: Network,
    public push: Push,
    public helper: Helper,
  ) {
    Splashscreen.show();
    var config = {
      apiKey: "AIzaSyBFKhA17tr8f2ki0agybmDZ2Pk_iYu2YLg",
      authDomain: "web-uat-1a4d8.firebaseapp.com",
      databaseURL: "https://web-uat-1a4d8.firebaseio.com",
      projectId: "web-uat-1a4d8",
      storageBucket: "web-uat-1a4d8.appspot.com",
      messagingSenderId: "732818088048"
    };
    let payload = {
      additionalData: {
        title: 'Order',
        message: 'Order selesai',
        type: 'finish',
        typeNotif: 'order'
      },
      type: 'notification'
    }
    platform.ready().then(() => {
      this.rootPage = LoginPage;
      firebase.initializeApp(config);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var loader = LoadingController.create({ content: ' <img src="./assets/loading.gif"/>', spinner: 'hide' });
          loader.present();
          this.pushSetup(user.uid);
          this.rootPage = HomePage;
          loader.dismiss();
        } else {
          this.pushObject = undefined;
          this.rootPage = LoginPage;
        }
        Splashscreen.hide();
      }, (e) => {
        this.rootPage = LoginPage;
        Splashscreen.hide();
      });
      StatusBar.styleDefault();
    });
  }

  pushSetup(uid) {
    const options: PushOptions = {
      "android": {
        "senderID": "732818088048",
        "sound": "true"
      },
      "ios": {
        "alert": "true",
        "badge": "true",
        "sound": "false"
      },
      "windows": {}
    }
    this.pushObject = this.push.init(options);
    this.listenPushObject(uid);
  }



  listenPushObject(uid) {
    this.pushObject.on('notification').subscribe((notification: any) => {
      let first = !notification.additionalData.foreground && notification.additionalData.coldstart;
      let background = !notification.additionalData.foreground && !notification.additionalData.coldstart;
      if (background) {
        let data = {
          additionalData: notification.additionalData,
          type: 'notification'
        }
        console.log('notification data run on background : ' + JSON.stringify(notification))
        // return this.helper.setDataNotif(data);
        return
      }
      if (first) {
        let data = {
          additionalData: notification.additionalData,
          type: 'notification'
        }
        console.log('notification data run on first : ' + JSON.stringify(notification))
        return this.helper.setDataNotif(data);
      }
      console.log('notification data run on forground : ' + JSON.stringify(notification))
      return this.helper.setDataNotifFourground(notification)
    });

    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('registration push', registration)
      firebase.database().ref('users/' + uid).update({ deviceId: registration.registrationId })
    });
    this.pushObject.on('error').subscribe(error => console.log('plugin e rror', error));
  }
}


