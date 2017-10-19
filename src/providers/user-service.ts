import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { Zapier } from './zapier';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {

  private data: any;
  private fireAuth: any;
  private userProfile: any;
  public userData: any;
  private muridProfile: any;
  private tutorProfile: any;
  private userTeacher: any;
  public listCategory: any;
  public usercart: any;
  public userCounter: number;
  public orderCounter: any;
  public userId: any;
  public serviceChats: any;
  public chats: any;
  public cartId: any;
  public cartData: any;
  public cart: any;
  public cartHistoryData: any;
  public chatId: any;
  public refferalId: any;
  public uploadRef: any;
  public bookingRef: any;
  public reviewRef: any;
  public tutorProfileRef: any;
  public productRef: any;


  constructor(public http: Http, public Zapier: Zapier, public af: AngularFire) {
    this.fireAuth = firebase.auth();
    this.tutorProfileRef = firebase.database().ref('tutorProfile');
    this.bookingRef = firebase.database().ref('order');
    this.productRef = firebase.database().ref('products');
    this.uploadRef = firebase.storage().ref();
    this.userProfile = firebase.database().ref('users');
    this.muridProfile = firebase.database().ref('muridProfile');
    this.tutorProfile = firebase.database().ref('tutorProfile');
    this.cart = firebase.database().ref('order');
    this.reviewRef = firebase.database().ref('review');

    //CHANGE TO PROFILE TEACHER WHEN GOING LIVE
    this.userTeacher = firebase.database().ref('tutorProfile');
    this.serviceChats = firebase.database().ref('chat');
    this.getUserCounter();

    // this.userCartHis = firebase.database().ref('order').orderByChild('userId').equalTo(this.userId);
  }
  offSetVal() {
    return firebase.database().ref("/.info/serverTimeOffset")
  }
  checkRole(uid) {
    return this.userProfile.child(uid + '/role').once('value').then(snapshot => {
      return snapshot.val();
    });
  }

  signUpMurid(dob, email: string, password: string, firstName: string, lastName: string, telepon: string, provinsi: string, kabupaten: string, alamat: string, kodepos: string, role: string, gender: string, reffCode, reffType) {

    if (reffCode == undefined || reffType == undefined) {
      reffCode = '';
      reffType = '';
    }
    var that = this;
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUserCreated) => {
      this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
        var count = this.userCounter,
          reff = firstName.substring(0, 1) + lastName.substring(0, 1) + '10' + count;
        count = count + 1001;
        console.log(authenticatedUser.uid);
        this.af.database.object('users/' + authenticatedUser.uid).set({
          dob: dob,
          avatar: 'https://firebasestorage.googleapis.com/v0/b/lesgo-dev-test.appspot.com/o/Male.png?alt=media&token=2c4bb71c-d7a4-43d1-ba6d-6e7aad775a8d', createDate: firebase.database.ServerValue.TIMESTAMP, email: email, emailVerificationStatus: false, gender: gender, firstName: firstName, lastName: lastName, phoneNumber: telepon, refParent: '', refType: '', refCode: '', role: 'murid', smsVerificationCode: count, smsVerificationStatus: false, stateVerification: 100, status: true, updateDate: firebase.database.ServerValue.TIMESTAMP
          , updateBy: authenticatedUser.uid
        });
        // this.muridProfile.child(authenticatedUser.uid).set({
        //   email:email,password:password,role:role
        // });

      })
    })
  }
  // signUpGuru(email:string,password:string,firstName:string,lastName:string,telepon:string,provinsi:string,kabupaten:string,alamat:string,kodepos:string,role:string,gender:string,reffCode,reffType){
  //   if(reffCode == undefined || reffType == undefined){
  //     reffCode='';
  //     reffType='';
  //   }
  //
  //   //address ganti jadi latlang ya cuy!
  //   //process signup
  //   return this.fireAuth.createUserWithEmailAndPassword(email,password).then((newUserCreated) =>  {
  //     this.fireAuth.signInWithEmailAndPassword(email,password).then((authenticatedUser) => {
  //       var that = this,
  //       count=this.userCounter,
  //       reff = firstName.substring(0,1)+lastName.substring(0,1)+'10'+count;
  //       count = count+1001
  //       firebase.database().ref('users/'+authenticatedUser.uid).set({
  //         avatar:'assets/'+gender+'.png',createDate:firebase.database.ServerValue.TIMESTAMP,email:email,emailVerificationStatus:false, gender:gender, firstName:firstName,lastName:lastName,phoneNumber:telepon,refParent:'',refType:'',refCode:'',role:'guru',smsVerificationCode:count,smsVerificationStatus:false,stateVerification:0,status:true,updateDate:firebase.database.ServerValue.TIMESTAMP
  //         ,updateBy:authenticatedUser.uid
  //       });
  //       firebase.database().ref('tutorProfile/'+authenticatedUser.uid).set({
  //         avatar:'assets/'+gender+'.png',createDate:firebase.database.ServerValue.TIMESTAMP,email:email, gender:gender, firstName:firstName,fullName:firstName+' '+lastName, lastName:lastName,phone:telepon,refParent:'',refType:'',refCode:'',role:'guru',status:true
  //         ,updateBy:authenticatedUser.uid, about:'', address:'',cityId:'',cityName:'',updateDate:firebase.database.ServerValue.TIMESTAMP,latitude:'',longitude:'',pekerjaan:'',phoneNumber:telepon,postalCode:'',provinceId:'',provinceName:'',published:false,tingkatPendidikanTerakhir:'',uid:authenticatedUser.uid,universitas:''
  //       });
  //       firebase.database().ref('chat/'+authenticatedUser.uid).push({
  //       message:'Selamat datang di applikasi chat kami, apakah ada yang bisa kami bantu ?',sentAt:firebase.database.ServerValue.TIMESTAMP,senderName:'LESGO!',sender:'cs',userId:'cs',receiverName:firstName,receiver:authenticatedUser.uid}
  //       );
  //       let objects = { phoneNumber: telepon, email :email, verificationCode:count,textMessage:"Ini adalah verification code dari LESGO!"};
  //       console.log(objects);
  //       that.Zapier.sendSms(objects);
  //     })
  //
  //   })
  // }
  resendSms(objects) {
    console.log(objects);
    return this.Zapier.sendSms(objects);
  }
  sendVerificationCode(object) {
    var phone = object.phoneNumber;
    var code = object.smsVerificationCode;
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    // headers.append('Access-Control-Allow-Origin', '*');
    var options = new RequestOptions({ headers: headers });
    return this.http.get('http://les-go.com/api/twilio/' + phone + '/' + code, options)
      .map(response => response.json())
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  loginUser(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }
  logoutUser() {
    return this.fireAuth.signOut();
  }
  forgotUser(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
  viewUser(userId: any) {
    var userRef = this.userProfile.child(userId);
    return userRef;
  }
  viewTeacher(userId: any) {
    var viewTeach = this.userTeacher.child(userId);
    return viewTeach;
  }
  userCartHistory() {
    return firebase.database().ref('order');
    //  ,function(snapshot){
    //  var data = snapshot.val();
    //  return data
    // });
  }
  userCart() {
    return firebase.database().ref('cart');
    // var data = snapshot.val();
    // return data

  }
  getOrderCounter() {
    return firebase.database().ref('order').on('value', (snapshot) => {
      this.orderCounter = snapshot.numChildren();
    });
    //   .then(function(snapshot){
    //     var data = snapshot.numChildren();
    // }, function(error){
    //   console.log(error);
    // })
  }
  getUserCounter() {
    firebase.database().ref('users').once('value', (snapshot) => {
      this.userCounter = snapshot.numChildren();
    });
    //  .then(function(snapshot){
    //   var data = snapshot.numChildren();
    //   return data;
    //   }, function(error){
    //     console.log(error);
    //   })
  }

  addToCart(rating, phoneNumber, categoryName, tutorAvatar, tutorUid, tutorName, orderSchedule, sessions, lokasi, totalHarga, price, frekuensi, jumlahMurid, jenisPaket, namaMurid, muridId, alamatMurid, avatarMurid, matpel, userName?) {
    let data: any = {
      tutorRating: rating, createDate: firebase.database.ServerValue.TIMESTAMP, phoneNumber: phoneNumber, categoryName: categoryName, avatarMurid: avatarMurid, alamatMurid: alamatMurid, tutorAvatar: tutorAvatar, tutorUid: tutorUid, orderSchedule: orderSchedule, sessions: sessions, tutorName: tutorName, uid: this.fireAuth.currentUser.uid, namaMurid: namaMurid, muridId: muridId, jenisPaket: jenisPaket,
      jumlahMurid: jumlahMurid, frekuensi: frekuensi, totalHarga: totalHarga, price: price, latitude: lokasi.latitude, longitude: lokasi.longitude, matpel: matpel, status: 'cart', transactionId: '',
    }
    if (userName) {
      data.userName = userName;
    }
    return firebase.database().ref('order').push(data);
  }
  removeFromCart(id) {
    return firebase.database().ref('order').child(id).remove();
  }
  userID() {
    return this.userId;
  }
  askChats(id) {
    var service = firebase.database().ref('chat/' + id);
    return service.orderByChild('userId').equalTo('cs');
  }
  tutorChats() {
    return this.serviceChats;
  }
  myChatsGuru(myUid: any) {
    var readChats = firebase.database().ref('chat/' + myUid);
    return readChats;
  };
  sendChatsCS(message: any, senderUid: any, senderName: any) {
    return firebase.database().ref('chat/' + senderUid).push({ message: message, type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: 'cs', receiverName: 'LESGO!', sender: senderUid, senderName: senderName, userId: 'cs', position: 'right' });
  };
  sendImage(url: any, senderUid: any, senderName: any) {
    return firebase.database().ref('chat/' + senderUid).push({ message: url, type: 'img', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: 'cs', receiverName: 'LESGO!', sender: senderUid, senderName: senderName, userId: 'cs', position: 'right' });
  };
  sendChatsTutor(message: any, receiverUid, senderName, senderUid, receiverName) {
    return firebase.database().ref('chat/' + senderUid).push({ message: message, type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: receiverUid, receiverName: receiverName, sender: senderUid, senderName: senderName, userId: receiverUid, position: 'right' }).then(() => {
      firebase.database().ref('chat/' + receiverUid).push({ message: message, type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: senderUid, receiverName: senderName, sender: receiverUid, senderName: receiverName, userId: senderUid, position: 'left' })
    });

  };
  sendImageTutor(url: any, senderUid: any, senderName: any, receiverUid, receiverName) {
    return firebase.database().ref('chat/' + senderUid).push({ message: url, type: 'img', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: receiverUid, receiverName: receiverName, sender: senderUid, senderName: senderName, userId: receiverUid, position: 'right' }).then(() => {
      firebase.database().ref('chat/' + receiverUid).push({ message: url, type: 'img', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: receiverUid, receiverName: receiverName, sender: senderUid, senderName: senderName, userId: senderUid, position: 'left' })
    });
  }
  myChatsCS(userId: any) {
    var readChats = firebase.database().ref('chat/' + userId).orderByChild('userId').equalTo('cs');
    return readChats;
  }
  userPays(buyerUid: any, tutorUid: any, sessions: any, transId: any) {
    var buyerCarts = firebase.database().ref('transaction/' + transId + '/customer/'),
      tutorCarts = firebase.database().ref('transaction/' + transId + '/tutor/'),
      tutor = this.viewUser(tutorUid),
      buyer = this.viewUser(buyerUid);
    buyerCarts.set(tutor);
    tutorCarts.set(buyer);
    return 'Anda telah melakukan pembayaran untuk tutor, harap periksa riwayat di dalam cart anda untuk melihat secara detail, atau buka email anda';
  };
  openTransaction(transId: any) {
    var theTransaction = firebase.database().ref('order/' + transId);
    return theTransaction.once('value');
  }
  listenTransaction(orderId: any) {
    return this.af.database.object('order/' + orderId);
  }
  //
  // getChats(uid){
  //    firebase.database().ref('/chat').orderByChild('userId').equalTo(uid).on('value', (snapshot) =>{
  //      var data = Object.keys(snapshot.val());
  //      console.log(data);
  //      console.log(snapshot.val());
  //      firebase.database().ref('profileMurid/'+uid).update({chat:data[0]})
  //      });
  // };
  // getChatsGuru(uid){
  //    firebase.database().ref('/chat').orderByChild('userId').equalTo(uid).on('value', function (snapshot){
  //      var data = Object.keys(snapshot.val());
  //      console.log(data);
  //      console.log(snapshot.val());
  //      firebase.database().ref('profileGuru').child(uid).update({chat:data[0]})
  //      });
  // };
  catchCartData() {
    return this.cart;
  };
  getCart(uid) {
    return this.cart.orderByChild('uid').equalTo(uid);
  }
  catchCartHistoryData() {
    return this.cartHistoryData;
  };
  saveMurid(data) {
    data.forEach(function (child) {
      if (child.status == 'new') {
        firebase.database().ref('muridProfile/')
          .push({
            avatar: child.avatar, firstName: child.firstName, lastName: child.lastName, gender: child.gender, alamat: child.address, province: child.province, city: child.city, posCode: child.posCode, latitude: child.latitude, longitude: child.longitude, dob: child.dob, userId: child.userId,
            createdAt: firebase.database.ServerValue.TIMESTAMP, updatedAt: firebase.database.ServerValue.TIMESTAMP, displayAddress: child.displayAddress
          })
      }
      else if (child.status == 'update') {
        firebase.database().ref('muridProfile/' + child.key).update({
          avatar: child.avatar, firstName: child.firstName, lastName: child.lastName, gender: child.gender, alamat: child.address, province: child.province, city: child.city, posCode: child.posCode, latitude: child.latitude, longitude: child.longitude, dob: child.dob, userId: child.userId,
          updatedAt: firebase.database.ServerValue.TIMESTAMP, displayAddress: child.displayAddress
        })
      }
    })
  }
  loadMurid(userId) {
    return this.muridProfile.orderByChild('userId').equalTo(userId);
  }
  viewMurid(userId) {
    return this.muridProfile.child('userId');
  }
  updateProfilePicture(picture: any = null): any {
    var userId = this.fireAuth.currentUser.uid;
    return this.uploadRef.child(userId)
      .putString(picture, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.userProfile.child(userId).update({

          avatar: savedPicture.downloadURL
        });
      })
  }
  uploadReview(orderId, review, types) {
    if (types == 'murid') {
      firebase.database().ref('order/' + orderId).update({ review: review })
    }
    else {
      firebase.database().ref('order/' + orderId + '/sessions').update({ absensi: review })
    }
  }
  addProfileUser(photoUrl: any) {
    this.userProfile.update({ avatar: photoUrl });
  }
  addProfileMurid(photoUrl: any) {
    this.muridProfile.update({ avatar: photoUrl });
  }
  addProfileTutor(photoUrl: any) {
    this.tutorProfile.update({ avatar: photoUrl });
  }

  updateSchedule(uid, data) {
    var a = this.tutorProfileRef.child(uid + '/schedule').set(data);
    return a;
  }
  updateTutorProfile(uid, data) {
    var a = this.tutorProfileRef.child(uid).update(data);
    return a;
  }
  viewTutorProfile(uid) {
    var a = this.tutorProfileRef.child(uid);
    return a;
  }

  createProduct(uid, data) {
    var b = this.productRef.push(data);
    return b;
  }

  updateProduct(uid, product, data) {
    var b = this.productRef.child(product).update(data);
    return b;
  }
  myProduct(uid) {
    var b = this.productRef.orderByChild('userId').equalTo(uid);
    return b;
  }
  getUser(uid): Promise<any> {
    return new Promise(resolve => {
      this.userProfile.child(uid).once('value').then(data => {
        resolve(data);
      })
    });
  }
  getBooking(uid) {
    var c = this.bookingRef.orderByChild('tutorUid').equalTo(uid);
    return c;
  }
  getReview(uid) {
    var c = this.reviewRef.orderByChild('receiverId').equalTo(uid);
    return c;
  }
  submitReview(uid, data) {
    this.reviewRef.push({ senderId: data.senderId, senderName: data.senderName, review: data.review, createDate: firebase.database.ServerValue.TIMESTAMP, rating: data.rate, receiverId: data.receiverId, receiverName: data.receiverName })
  }


  getTotalOrder(uid) {
    var d;
    this.getBooking(uid).once('value', function (snapshot) {
      d = snapshot.numChildren();
    })
    return d;
  }
  updateSession(uid, data) {
    var e;
    e = this.bookingRef.child(uid).update(data);
    return e;
  }
  newChatCs(userId) {
    return this.af.database.list('/chat/' + userId + '/messages');
  }

  getAllChat(userId) {
    return this.af.database.list('/chat/' + userId);
  }
  sendFirstChat(userId, name) {
    this.af.database.object('/chat/' + userId).set({ uid1: userId, uid2: 'cs', messages: '', uid2Name: 'LESGO!', uid1Name: name });
    return this.af.database.list('/chat/' + userId + '/messages').push({ message: 'Welcome to LESGO!', type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, status: false, position: 'left' })
  }
  sendChatCsNew(message, userId, type) {
    return this.af.database.list('/chat/' + userId + '/messages/').push({ message: message, type: type, sentAt: firebase.database.ServerValue.TIMESTAMP, status: false, position: 'right' });
  }
  updateChatStatus(key, userId) {
    return this.af.database.object('/chat/' + userId + '/messages/' + key).update({ status: true });
  }
  updateChatStatusAll(data, userId) {
    firebase.database().ref('/chat/' + userId + '/messages').update(data);
  }
  muridCariTutor(muridId) {
    return this.af.database.list('/order/', {
      query: {
        orderByChild: 'uid',
        equalTo: muridId
      }
    })
  }
  newChatTutor(userId, tutorId) {
    return this.af.database.list('/konsultasi/' + userId + tutorId + '/messages');
  }
  sendChatTutorNew(message, userId, tutorId, type) {
    return this.af.database.list('/konsultasi/' + userId + tutorId + '/messages/').push({ message: message, type: type, sentAt: firebase.database.ServerValue.TIMESTAMP, status: false, position: 'right' });
  }
  updateChatStatusTutor(userId, tutorId, key) {
    return this.af.database.object('/konsultasi/' + userId + tutorId + '/messages/' + key).update({ status: true });
  }
  firstChatTutor(userId, tutorId) {
    return this.af.database.object('/konsultasi/' + userId + tutorId).update({ uid1: userId, uid2: tutorId })
  }
  getChatTutorStatus(muridId) {
    return this.af.database.list('/konsultasi/', {
      query: {
        orderByChild: 'uid1',
        equalTo: muridId
      }
    })
  }
  getChatCsStatus(muridId) {
    return this.af.database.list('/chat/' + muridId + '/messages');
  }
  getUserDataOnce(muridId) {
    return this.af.database.object('/users/' + muridId, { preserveSnapshot: true }).take(1);
  }
  getUserData(muridId) {
    return this.af.database.object('/users/' + muridId);
  }
  updateUserData(userId, data) {
    return this.af.database.object('/users/' + userId).update(data);
  }
  getMuridUser(userId) {
    return this.af.database.list('/muridProfile/', {
      query: {
        orderByChild: 'userId',
        equalTo: userId
      }
    })
  }
  updateMurid(muridId, data) {
    return this.af.database.object('/muridProfile/' + muridId).update(data);
  }
  tambahMurid(muridId, data) {
    return this.af.database.list('/muridProfile').push(data);
  }
  getTutorProducts() {
    return this.af.database.list('/products');
  }
  getTutorProfile(tutorId) {
    return this.af.database.object('/tutorProfile/' + tutorId);
  }
  getTutorReview(tutorId) {
    return this.af.database.list('/review/' + tutorId);
  }
  getSingleReview(tutorId, orderId) {
    return this.af.database.object('/review/' + tutorId + '/' + orderId);
  }
  reviewTutor(tutorId, orderId, data) {
    return this.af.database.object('/review/' + tutorId + '/' + orderId).set(data);
  }
  getTransaction(transId) {
    return this.af.database.object('/transaction/' + transId, { preserveSnapshot: true }).take(1);
  }
  updateCartStatus(orderKey, data) {
    return this.af.database.object('/order/' + orderKey).update(data);
  }
  removeCart(orderKey) {
    return this.af.database.list('/order').remove(orderKey);
  }
  getTutorSession(tutorId) {
    return this.af.database.list('/order/', {
      query: {
        orderByChild: 'tutorUid',
        equalTo: tutorId
      }
    })
  }

  updateTransaction(transId, data) {
    return this.af.database.object('/transaction/' + transId).update(data);
  }
}
