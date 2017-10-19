import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [UserService]
})
export class AboutPage {
  email: any;
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public loadingCtrl: LoadingController
  ) { }
  forgetPass() {
    this.userService.forgotUser(this.email).then(authData => {
      alert("Password telah dikirim ke email anda");
    }, error => {
      alert("Email anda tidak terdaftar");
    });
  };
}
