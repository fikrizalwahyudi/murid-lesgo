import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, NavParams } from 'ionic-angular';
import { ListCat } from '../../providers/list-cat';
import * as _ from 'lodash';
/*
  Generated class for the Pelajaran page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pelajaran',
  templateUrl: 'pelajaran.html',
  providers: [ListCat]
})
export class PelajaranPage {
  public SD: any = false;
  public SMP: any = false;
  public SMA: any = false;
  public TK: any = false;
  public Uni: any = false;
  public Umum: any = false;
  public SDrows: any;
  public SMProws: any;
  public SMArows: any;
  public TKrows: any;
  public Unirows: any;
  public Umumrows: any;
  public SDData: any = [];
  public SMPData: any = [];
  public SMAData: any = [];
  public TKData: any = [];
  public UniData: any = [];
  public UmumData: any = [];
  public loader: any;
  // data: Array<{name: string, details: string, icon: string, showDetails: boolean}> = [];
  public data: any = [];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public listCat: ListCat,
    public loadingCtrl: LoadingController,
    public params: NavParams,
  ) {
    this.displayLesson();
    console.log(this.SDData);

    console.log(this.params)
    this.loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loader.present();
    setTimeout(() => {
      this.loader.dismiss();
    }, 5000)
  }

  ionViewDidLoad() {
    console.log('Hello PelajaranPage Page');
  }
  displayLesson() {
    var that = this;
    this.listCat.getCourses().on('value', function (snapshot) {
      var counterTK = 0, counterSD = 0, counterSMP = 0, counterSMA = 0, counterUni = 0, counterUmum = 0, i = 0, dataRaw = [];
      snapshot.forEach(function (childSnapshot) {
        var raw = childSnapshot.val();
        raw['key'] = childSnapshot.key;
        if (raw.parentId == '-KAQbpktlMXGkDd3dEln') {
          raw['counter'] = counterTK;
          counterTK++;
          raw['class'] = "backorange";
          that.TKData.push(raw);

        }
        else if (raw.parentId == '-KAQc-AFw3fhDpx1rJMb') {
          raw['counter'] = counterSD;
          counterSD++;
          raw['class'] = "backmerah";
          that.SDData.push(raw);
        }
        else if (raw.parentId == '-KAQc0ykr4QBtv4jNoph') {
          raw['counter'] = counterSMP;
          counterSMP++;
          raw['class'] = "backbirutua";
          that.SMPData.push(raw);
        }
        else if (raw.parentId == '-KBJI0hSuH7HqEaQo6id') {
          raw['counter'] = counterSMA;
          counterSMA++
          raw['class'] = "backbiru";
          console.log(raw);
          that.SMAData.push(raw);
        }
        else if (raw.parentId == '-KJ-mwuzgKzdYcmto55-') {
          raw['counter'] = counterUni;
          counterUni++
          raw['class'] = "backhitam";
          that.UniData.push(raw);
        }
        else {
          raw['counter'] = counterUmum;
          counterUmum++;
          raw['class'] = "backcoklat";
          that.UmumData.push(raw);
        }
      });
    });
    this.TKrows = Array.from(Array(Math.ceil(this.TKData.length / 3)).keys());
    this.SDrows = Array.from(Array(Math.ceil(this.SDData.length / 3)).keys());
    this.SMProws = Array.from(Array(Math.ceil(this.SMPData.length / 3)).keys());
    this.SMArows = Array.from(Array(Math.ceil(this.SMAData.length / 3)).keys());
    this.Unirows = Array.from(Array(Math.ceil(this.UniData.length / 3)).keys());
    this.Umumrows = Array.from(Array(Math.ceil(this.UmumData.length / 3)).keys());
  }
  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-add-circle-outline';
    } else {
      data.showDetails = true;
      data.icon = 'ios-remove-circle-outline';
    }
  }

  showHideSD() {
    if (this.SD != true) {
      this.SD = true;
      this.TK = false;
      this.SMP = false;
      this.SMA = false;
      this.Uni = false;
      this.Umum = false;
    }
    else {
      this.SD = false;
    }
  }


  showHideSMP() {
    if (this.SMP != true) {
      this.SMP = true;
      this.SD = false;
      this.TK = false;
      this.SMA = false;
      this.Uni = false;
      this.Umum = false;
    }
    else {
      this.SMP = false;
    }
  }

  showHideSMA() {
    if (this.SMA != true) { //false
      this.SMA = true;
      this.SD = false;
      this.TK = false;
      this.SMP = false;
      this.Uni = false;
      this.Umum = false;
    }
    else {
      this.SMA = false; //not false
    }
  }

  showHideUni() {
    if (this.Uni != true) {
      this.SD = false;
      this.TK = false;
      this.SMP = false;
      this.SMA = false;
      this.Uni = true;
      this.Umum = false;
    }
    else {
      this.Uni = false;
    }
  }

  showHideUmum() {
    if (this.Umum != true) {
      this.SD = false;
      this.TK = false;
      this.SMP = false;
      this.SMA = false;
      this.Uni = false;
      this.Umum = true;
    }
    else {
      this.Umum = false;
    }
  }
  showHideTK() {
    if (this.TK != true) {
      this.SD = false;
      this.TK = true;
      this.SMP = false;
      this.SMA = false;
      this.Uni = false;
      this.Umum = false;
    }
    else {
      this.TK = false;
    }
  }

  sendValueTK(keyData, parent, counter, name) {
    var key = _.findIndex(this.TKData, ['key', keyData]);
    var a = { id: keyData };
    if (this.data == undefined || this.data.length == 0) {
      this.data.push(a);
      this.TKData[key]['class'] = "active";
    }
    else if (_.findIndex(this.data, ['id', keyData]) == -1) {
      this.data.push(a);
      this.TKData[key]['class'] = "active";

    } else if (_.findIndex(this.data, ['id', keyData]) != -1) {
      var uselesss = _.remove(this.data, ['id', keyData]);
      this.TKData[key]['class'] = "inactive";
    }
  }
  sendValueSD(keyData, parent, counter, name) {
    var key = _.findIndex(this.SDData, ['key', keyData]);
    var a = { id: keyData };
    if (this.data == undefined || this.data.length == 0) {
      this.data.push(a);
      this.SDData[key]['class'] = "active";
    }
    else if (_.findIndex(this.data, ['id', keyData]) == -1) {
      this.data.push(a);
      this.SDData[key]['class'] = "active";

    } else if (_.findIndex(this.data, ['id', keyData]) != -1) {
      var uselesss = _.remove(this.data, ['id', keyData]);
      this.SDData[key]['class'] = "inactive";
    }
  }
  sendValueSMP(keyData, parent, counter, name) {
    var key = _.findIndex(this.SMPData, ['key', keyData]);
    var a = { id: keyData };
    if (this.data == undefined || this.data.length == 0) {
      this.data.push(a);
      this.SMPData[key]['class'] = "active";
    }
    else if (_.findIndex(this.data, ['id', keyData]) == -1) {
      this.data.push(a);
      this.SMPData[key]['class'] = "active";

    } else if (_.findIndex(this.data, ['id', keyData]) != -1) {
      var uselesss = _.remove(this.data, ['id', keyData]);
      this.SMPData[key]['class'] = "inactive";
    }
  }
  sendValueSMA(keyData, parent, counter, name) {
    var key = _.findIndex(this.SMAData, ['key', keyData]);
    var a = { id: keyData };
    if (this.data == undefined || this.data.length == 0) {
      this.data.push(a);
      this.SMAData[key]['class'] = "active";
      console.log(this.data);
    }
    else if (_.findIndex(this.data, ['id', keyData]) == -1) {
      this.data.push(a);
      this.SMAData[key]['class'] = "active";
      console.log(this.data);

    } else if (_.findIndex(this.data, ['id', keyData]) != -1) {
      var uselesss = _.remove(this.data, ['id', keyData]);
      this.SMAData[key]['class'] = "inactive";
      console.log(uselesss);
    }
  }
  sendValueUni(keyData, parent, counter, name) {
    var key = _.findIndex(this.UniData, ['key', keyData]);
    var a = { id: keyData };
    if (this.data == undefined || this.data.length == 0) {
      this.data.push(a);
      this.UniData[key]['class'] = "active";
      console.log(this.data);
    }
    else if (_.findIndex(this.data, ['id', keyData]) == -1) {
      this.data.push(a);
      this.UniData[key]['class'] = "active";
      console.log(this.data);

    } else if (_.findIndex(this.data, ['id', keyData]) != -1) {
      var uselesss = _.remove(this.data, ['id', keyData]);
      this.UniData[key]['class'] = "inactive";
      console.log(uselesss);
    }
  }
  sendValueUmum(keyData, parent, counter, name) {
    var key = _.findIndex(this.UmumData, ['key', keyData]);
    var a = { id: keyData };
    if (this.data == undefined || this.data.length == 0) {
      this.data.push(a);
      this.UmumData[key]['class'] = "active";
      console.log(this.data);
    }
    else if (_.findIndex(this.data, ['id', keyData]) == -1) {
      this.data.push(a);
      this.UmumData[key]['class'] = "active";
      console.log(this.data);

    } else if (_.findIndex(this.data, ['id', keyData]) != -1) {
      var uselesss = _.remove(this.data, ['id', keyData]);
      this.UmumData[key]['class'] = "inactive";
      console.log(uselesss);
    }
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  send() {
    console.log(this.data);
    this.viewCtrl.dismiss(this.data);
  }
}
