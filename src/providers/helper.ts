import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Helper {
    dataNotif: any;
    dataNotifFourground: any;
    currentuser: any;
    dataOrderDetail: any;
    dataReport: any;
    emitterNotif: EventEmitter<any>;
    emitterNotifFourground: EventEmitter<any>;
    emitterOrderDetail: EventEmitter<any>;
    emitterDataReport: EventEmitter<any>;
    emitterChatTutor: EventEmitter<any>;
    constructor() {
        if (!this.emitterNotif) {
            this.emitterNotif = new EventEmitter<any>();
        }
        if (!this.emitterNotifFourground) {
            this.emitterNotifFourground = new EventEmitter<any>();
        }
        if (!this.emitterOrderDetail) {
            this.emitterOrderDetail = new EventEmitter<any>();
        }
        if (!this.emitterChatTutor) {
            this.emitterChatTutor = new EventEmitter<any>();
        }
        if (!this.emitterDataReport) {
            this.emitterDataReport = new EventEmitter<any>();
        }
    }
    setDataNotif(data: any) {
        this.dataNotif = data;
        this.emitterNotif.emit(this.dataNotif);
    }

    setDataNotifFourground(data: any) {
        this.dataNotifFourground = data;
        this.emitterNotifFourground.emit(this.dataNotifFourground);
    }

    setDataOrderDetail(data: any) {
        this.dataOrderDetail = data;
        this.emitterOrderDetail.emit(data);
    }

    setDataReport(data: any) {
        this.dataReport = data;
        this.emitterDataReport.emit(data);
    }

    getDataNotif() {
        return this.dataNotif;
    }
    setCurrentUser(user: any) {
        this.currentuser = user;
    }
    getCurrentUser() {
        return this.currentuser;
    }
}