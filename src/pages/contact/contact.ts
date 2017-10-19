import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, ViewController, LoadingController, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import { VerificationPage } from '../verification/verification';
import { LoginPage } from '../login/login';
import { BlankPage } from '../blank/blank';
import { HomePage } from '../home/home';
import { UserService } from '../../providers/user-service';
import { MapsPage } from '../maps/maps';
import { Zapier } from '../../providers/zapier';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, CameraPosition, GoogleMapsMarkerOptions, GoogleMapsMarker } from 'ionic-native';
import { TextMaskModule } from 'angular2-text-mask';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [UserService, Zapier],
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
export class ContactPage {
  mask: any = ['+', '6', '2', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  fireAuth: any;
  email: any;
  password: any;
  rePassword: any;
  firstName: any;
  lastName: any;
  tanggal: any = new Date();
  telepon: any = '+62';
  provinsi: any = 'DKI Jakarta';
  kabupaten: any = 'Jakarta Pusat';
  alamat: any = 'Klik untuk memilih lokasi belajar mengajar';
  kodepos: any = 'test';
  reffCode: any;
  reffType: any;
  gender: any = 'Male';
  role: any = "murid";
  passState: any = 'password';
  passIcon: any = 'ios-eye-outline';
  passReState: any = 'password';
  passReIcon: any = 'ios-eye-outline';
  lat: any;
  dob: any;
  lng: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public userService: UserService,
    public zapier: Zapier,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) { }

  signMeUp() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    console.log(JSON.stringify({
      dob: this.dob,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      telepon: this.telepon,
      provinsi: this.provinsi,
      kabupaten: this.kabupaten,
      alamat: this.alamat,
      kodepos: this.kodepos,
      role: this.role,
      gender: this.gender,
      reffCode: this.reffCode,
      reffTyp: this.reffType
    }))
    if (!this.firstName) return alert('anda belum memasukan first name');
    if (!this.telepon || this.telepon.length < 4) return alert('anda belum memasukan telepon');
    if (!/\+62.*/.test(this.telepon)) this.telepon = '+62' + this.telepon;
    if (!this.email) return alert('anda belum memasukan email');
    if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(this.email)) return alert('format email salah');
    if (!this.password) return alert('anda belum memasukan password');
    if (this.password != this.rePassword) return alert('repassword tidak sama');
    if (!this.dob) return alert('anda belum memasukan Date of Birth');
    if (!this.gender) return alert('anda belum memasukan Gender');
    if (!this.lastName) this.lastName = '';
    loader.present();
    let telpon = this.telepon.toString().split('');
    telpon = telpon.map((v: any) => {
      return v.replace(' ', '').replace('(', '').replace(')', '').replace("_", '').replace('-', '')
    });
    this.telepon = telpon.join('');
    return this.userService.signUpMurid(
      this.dob, this.email, this.password,
      this.firstName, this.lastName, this.telepon,
      this.provinsi, this.kabupaten, this.alamat,
      this.kodepos, this.role, this.gender,
      this.reffCode, this.reffType
    ).then(authData => {
      return loader.dismiss();
    }, error => {
      alert("Error :" + error.message);
      return loader.dismissAll();
    })
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
  showRePass() {
    if (this.passReState != 'password') {
      this.passReState = 'password';
      this.passReIcon = 'ios-eye-outline'
    }
    else {
      this.passReState = 'text';
      this.passReIcon = 'ios-eye-off-outline';
    }
  }
  goTo(name) {
    if (name === 'tnc') {
      this.navCtrl.push(BlankPage, { data1: 'Terms & Condition' })
    }
    else {
      this.navCtrl.push(BlankPage, { data1: 'Privacy' })
    }
  }
}
