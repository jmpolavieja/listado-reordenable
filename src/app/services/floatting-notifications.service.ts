import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloattingNotificationsService {
  messagingFirebase: firebase.messaging.Messaging = firebase.messaging();
  messagingObservable: Observable<any> = new Observable((observer) => {
    this.messagingFirebase.onMessage((message) => observer.next(message));
  });

  constructor() { }

  getPermissions() {
    return new Promise(async (resolve, reject) => {
      const permission = await Notification.requestPermission();

      if (permission == 'granted') {
        const firebaseToken = await this.messagingFirebase.getToken();
        resolve(firebaseToken);
      } else {
        reject(new Error('No se han aceptado los permisos.'));
      }
    });
  }

  getMessages() {
    return this.messagingObservable;
  }

}
