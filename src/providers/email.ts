import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Email provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Email {
  static get parameters() {
       return [[Http]];
   }
   public to:any;
   public type:any;
  constructor(public http: Http) {
    console.log('Hello Email Provider');


        // Send a text message using default options



    }
  }
