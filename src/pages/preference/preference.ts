import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the Preference page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-preference',
  templateUrl: 'preference.html'
})
export class PreferencePage {
  univ: any;
  gender: any;
  tutorName: any;
  hideUni: any = false;
  hideGender: any = false;
  buttonClassF: any = 'notActive';
  buttonClassM: any = 'notActive';
  hideName: any = false;
  constructor(
    public viewCtrl: ViewController
  ) { }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  send() {
    if (this.gender == undefined || this.gender == '') {
      this.gender = 'dismiss';
    }
    if (this.univ == undefined || this.univ == '') {
      this.univ = 'dismiss';
    }
    if (this.tutorName == undefined || this.tutorName == '') {
      this.tutorName = 'dismiss';
    }
    let data = { gender: this.gender, univ: this.univ, tutorName: this.tutorName };
    this.viewCtrl.dismiss(data)
  }
  getGender(value) {
    console.log(value);
    console.log(this.buttonClassF);
    if (this.buttonClassF == "notActive" && value == "female") {
      this.buttonClassM = 'notActive';
      this.buttonClassF = "Active";
      this.gender = value;
    }
    else if (this.buttonClassF != "notActive" && value == "female") {
      this.buttonClassM = "notActive";
      this.buttonClassF = "notActive";
      this.gender = value;
    }
    else if (this.buttonClassM == "notActive" && value == "male") {
      this.buttonClassF = 'notActive'
      this.buttonClassM = "Active";
      this.gender = value;
    }
    else if (this.buttonClassM != "notActive" && value == "male") {
      this.buttonClassM = "notActive";
      this.buttonClassF = "notActive";
      this.gender = value;
    }

  }
  showHideGender() {
    if (this.hideGender != true) {
      this.hideGender = true;
      this.hideUni = false;
      this.hideName = false;
    }
    else {
      this.hideGender = false;
    }
  }
  showHideName() {
    if (this.hideName != true) {
      this.hideName = true;
      this.hideGender = false;
      this.hideUni = false;
    }
    else {
      this.hideName = false;
    }
  }
  showHideUni() {
    if (this.hideUni != true) {
      this.hideUni = true;
      this.hideName = false;
      this.hideGender = false;
    }
    else {
      this.hideUni = false;
    }
  }

}
