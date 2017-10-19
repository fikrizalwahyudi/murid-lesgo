import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about';
import { UserService } from '../../providers/user-service';
import { HomePage } from '../home/home';
import { VerificationPage } from '../verification/verification';
import * as firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserService],
  animations: [

    //logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void=> *', [
        style({ transform: 'translate3d(0,2000px,0)' }),
        animate('2000ms ease-in-out')
      ])
    ]),

    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void  =>  *', [
        style({ transform: 'translate3d(0,2000px,0)' }),
        animate('1000ms ease-in-out')
      ])
    ]),

    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void =>  *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({ transform: 'translate3d(0,2000px,0)', offset: 0 }),
          style({ transform: 'translate3d(0,-20px,0)', offset: 0.9 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ]),

    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void  =>  *', [
        style({ opacity: 0 }),
        animate('500ms 1000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {

  email: any;
  password: any;
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  passState: any = 'password';
  passIcon: any = 'ios-eye-outline';

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) { }

  signUp() {
    this.navCtrl.push(ContactPage);
  }
  iforgot() {
    this.navCtrl.push(AboutPage);
  }


  login() {
    let loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide', duration: 2000
    });
    loading.present()
    this.userService.loginUser(this.email, this.password).then(authData => {
      firebase.database().ref('users/' + authData.uid).once('value', snapshot => {
        var data = snapshot.val().role;
        if (data != 'murid') {
          firebase.auth().signOut();
          let alert = this.alertCtrl.create({
            title: 'Wrong user role',
            subTitle: 'Anda bukan murid, silahkan login dengan applikasi lainnya',
            buttons: ['Dismiss'],
            enableBackdropDismiss: true
          });
          alert.present();
          return loading.dismissAll();
        }
      })
      //success
    }, error => {
      alert("Error :" + error.message);
      loading.dismiss();
    });

  }
  showPass() {
    if (this.passState != 'password') {
      this.passState = 'password';
      this.passIcon = 'ios-eye-outline'
    }
    else {
      this.passState = 'text';
      this.passIcon = 'ios-eye-off-outline';
    }

  }
}
