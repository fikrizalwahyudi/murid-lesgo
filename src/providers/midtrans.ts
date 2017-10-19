import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as Veritrans from 'veritrans';

/*
  Generated class for the Midtrans provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Midtrans {
  private fireAuth:any;
  public bookingRef:any;
  public tutorProfileRef:any;
  public uploadRef:any;
  public productRef:any;

  constructor(public http: Http) {
    this.fireAuth = firebase.auth();
    this.uploadRef =  firebase.storage().ref();
    this.tutorProfileRef  = firebase.database().ref('tutorProfile');
    this.bookingRef  = firebase.database().ref('order');
    this.productRef  = firebase.database().ref('product');

}
  updateSchedule(uid,data){
    var a = this.tutorProfileRef.child(uid+'/schedule').set(data);
    return a;
  }
  updateTutorProfile(uid,data){
    var a = this.tutorProfileRef.child(uid).update(data);
    return a;
  }

  createProduct(uid,data){
    var b = this.productRef.push(data);
    return b;
  }

  updateProduct(uid,product,data){
    var b = this.productRef.child(product).update(data);
    return b;
  }

  getBooking(uid){
    var c = this.bookingRef.orderByChild('tutorUid').equalTo(uid);
    return c;
  }

  getTotalOrder(uid){
    var d;
    this.getBooking(uid).once('value',function(snapshot){
      d = snapshot.numChildren();
    })
    return d;
  }
}
