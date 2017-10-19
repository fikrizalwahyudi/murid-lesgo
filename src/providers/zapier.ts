import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the Zapier provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Zapier {

  private accessToken: any;
  private orderUrl: any = [];
  public type: any;
  private from: any = { "dante": "ganteng" };
  private hari: string;
  private jamMulai: string;
  private jamSelesai: string;
  private kategori: string;
  private kelasKat: string;
  private lokasi: string;
  private muridName: string;
  private order: number;
  private sesi: number;
  private tanggalMulai: any;
  private tanggalSelesai: string;
  private to: string;
  private transactionId: number;
  private tutorName: string;
  private tutorTo: string;
  private zapierSmsUrl = 'https://hooks.zapier.com/hooks/catch/2149543/1rrhss/';
  private zapierEmailUrl = 'https://hooks.zapier.com/hooks/catch/2149543/1rrhss/';
  private zapierDirectEmailUrl = 'https://hooks.zapier.com/hooks/catch/2149543/179zml/';
  private fcmUrl = 'https://fcm.googleapis.com/fcm/send';
  constructor(public http: Http) {

  }
  getUnavailability(startDate, uid) {
    var that = this;
    let body = { "uid": uid, "startDate": startDate };
    let bodyString = "tutorUid=" + uid + "&startDate=" + startDate;
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers });
    return this.http.post("https://us-central1-web-uat-1a4d8.cloudfunctions.net/blockingDate?" + bodyString, body, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
  getAvailability(startDate, endDate, uid) {
    var that = this;
    let body = { "uid": uid, "endDate": endDate, "startDate": startDate };
    let bodyString = JSON.stringify(body);
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers });
    return this.http.post("http:firebase", bodyString, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
  sendNotification(obj): Observable<Response[]> {
    var that = this;
    let body = { "data": { "title": obj.title, "message": obj.message }, "to": obj.to }
    console.log(body);
    let bodyString = JSON.stringify(body);
    console.log(bodyString);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'key=AIzaSyAvERBuauDhiYZ7PDxDZWGVxQcIF9rASKg' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option
    return that.http.post(that.fcmUrl, bodyString, options) // ...using post request
      .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }
  sendNotificationOrder(obj): Observable<Response[]> {
    var that = this;
    let body = { data: { title: obj.title, message: obj.message, startDate: obj.startDate, endDate: obj.endDate, status: obj.status }, to: obj.to };
    let bodyString = JSON.stringify(body);
    var fcmUrl = 'https://fcm.googleapis.com/fcm/send';
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'key=AIzaSyAvERBuauDhiYZ7PDxDZWGVxQcIF9rASKg' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option
    console.log(body);
    return that.http.post(that.fcmUrl, bodyString, options) // ...using post request
      .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }
  sendSms(obj): Observable<Response[]> {

    var body = { phoneNumber: obj.phoneNumber, email: obj.email, verificationCode: obj.verificationCode, textMessage: obj.textMessage };
    console.log(body);
    var body2 = 'phoneNumber=' + obj.phoneNumber + '&verificationCode=' + obj.verificationCode;
    console.log(body2);
    var bodyString = JSON.stringify(body);
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.post('https://us-central1-web-uat-1a4d8.cloudfunctions.net/sendSms?' + body2, body2, options) // ...using post request
      .map((res: Response) => res) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error || 'Server error')); //...errors if any
  }
  sendVerificationCode(obj): Observable<Response[]> {


    var body2 = 'uid=' + obj.uid + '&verificationCode=' + obj.verificationCode;
    console.log(body2);
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.post('https://us-central1-web-uat-1a4d8.cloudfunctions.net/sendSms' + body2, body2, options) // ...using post request
      .map((res: Response) => res) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error || 'Server error')); //...errors if any

  }
  sendDirectEmail(obj): Observable<Response[]> {
    var that = this;
    var body = { userName: obj.userName, title: obj.title, to: obj.to, welcome: obj.welcome, message: obj.message, thanks: obj.thanks, thanksMessage: obj.thanksMessage };
    console.log(body);
    var body2 = 'userName=' + obj.userName + '&title=' + obj.title + '&to=' + obj.to + '&welcome=' + obj.welcome + '&message=' + obj.message + '&thanks=' + obj.thanks + '&thanksMessage=' + obj.thanksMessage + '&testMessage=Test';
    console.log(body2);
    var bodyString = JSON.stringify(body);
    var headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return that.http.post(that.zapierDirectEmailUrl, bodyString, options) // ...using post request
      .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); //...errors if any
  }
  sendEmail(obj): Observable<Response[]> {
    var that = this;
    var body = { from: obj.from, title: obj.title, to: obj.to, message: obj.message, sendTime: obj.sendTime };
    var body2 = 'from=' + obj.from + '&title=' + obj.title + '&to=' + obj.to + '&message=' + obj.sendTime + '&sendTime=' + obj.message + '&testMessage=Test';
    // var bodyString = JSON.stringify(body);
    var headers = new Headers({ 'Content-Type': 'application/json', 'X-From-Service': 'Zapier' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return that.http.post(that.zapierEmailUrl, body2, options) // ...using post request
      .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }


}
