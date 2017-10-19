import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { ListCat } from '../../providers/list-cat';
import { SearchPage } from '../search/search';
import * as firebase from 'firebase';
/*
  Generated class for the Lesson page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',
  providers: [ListCat]
})
export class LessonPage {
  dataKey: any;
  lessons = new Array(new Array(), new Array(), new Array(), new Array(), new Array())

  constructor(
    public navCtrl: NavController,
    public listCat: ListCat,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public modal: ModalController,
    public viewCtrl: ViewController
  ) {
    var i = 0, counter = 0;
    this.listCat.getUmum().subscribe(snapshot => {
      snapshot.forEach(childSnapshot => {
        var data = childSnapshot;
        console.log(data);
        data['key'] = childSnapshot.$key;
        i = Math.floor(counter / 2);
        console.log(data);
        this.lessons[i].push(data);
        counter = counter + 1;
        console.log(this.lessons);
      });
      return this.lessons;
    });
  }
  getKey(key: string) {
    this.viewCtrl.dismiss(key);
    // let listModal = this.modal.create(LessonDetailsPage,{data:key});
    // listModal.present();
    // listModal.onDidDismiss(data => {
    //   if(data !== undefined){
    //     this.dataKey=data;
    //   }
    // })
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  send() {
  }

}
