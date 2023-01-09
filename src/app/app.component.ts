import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwPush, SwUpdate } from '@angular/service-worker';
import * as e from 'express';
import { IndexedDbService } from './services/indexed-db.service';
import { ServicesService } from './services/services.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pwa-form';
  private readonly publicKey =
    'BAWGDOj01IxH9pReOD7CgnuAsPzjlylEIWIi7dSptrAQvTmBIKoJ1jWj_Wr5wJVIgj8XiwRfU8OJlRWscVhQ0g4';
  contactForm: FormGroup = new FormGroup({});
  constructor(
    private formBuilder: FormBuilder,
    private update: SwUpdate,
    private push: SwPush,
    private service: ServicesService,
    private indexedDBService: IndexedDbService
  ) {}

  ngOnInit(): void {
    this.createContactForm();
    this.updateClient();

    this.push.notificationClicks.subscribe(({ action, notification }) => {
      console.log(notification);
      window.open(notification.data.url);
    });
  }

  createContactForm() {
    this.contactForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-z0-9_.]+@[a-zA-Z]+.[a-zA-Z]+'),
        ],
      ],
      message: [''],
    });
  }
  get email() {
    return this.contactForm.get('email');
  }
  get fullName() {
    return this.contactForm.get('fullName');
  }

  onSubmit() {
    console.log('Your form data : ', this.contactForm.value);
    this.postData(this.contactForm.value);
  }

  // for push notification
  pushSubscription() {
    if (!this.push.isEnabled) {
      console.log('Notification not enabled!');
      return;
    }
    this.push
      .requestSubscription({
        serverPublicKey: this.publicKey,
      })
      .then((sub: any) => {
        if (sub) {
          const pushSub = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
              p256dh: sub.toJSON().keys?.['p256dh'],
              auth: sub.toJSON().keys?.['auth'],
            },
          };
          console.log(pushSub);
        }
      })
      .catch((err) => console.log(err));
  }

  // to let user know there are updates
  updateClient() {
    if (!this.update.isEnabled) {
      console.log('service worker update not enabled');
      return;
    }
    this.update.versionUpdates.subscribe((e) => {
      console.log(e);
      if (confirm('Update Available. Will you like to reload?')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });
  }

  //indexed db and background sync
  postData(obj: any) {
    this.service.postData(obj).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        if (err.status === 504) {
          this.indexedDBService
            .addMessage(obj)
            .then(this.backgroundSync)
            .catch(console.log);
        } else {
          console.log(err);
        }
      },
    });
  }

  backgroundSync() {
    navigator.serviceWorker.ready.then((swRegister: any) => {
      swRegister.sync.register('post-data');
    });
  }
}
