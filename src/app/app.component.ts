import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Item } from './models/item.model';
import { FirestoreService } from './services/firestore.service';
import { FloattingNotificationsService } from './services/floatting-notifications.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'listado-reordenable';

  itemList: Item[] = [];
  path: string = '';
  file!: File;
  msg: string = '';

  constructor(
    private firestore: FirestoreService,
    private storage: StorageService,
    private messaging: FloattingNotificationsService
  ) {}

  ngOnInit(): void {
    this.firestore
      .getTareas()
      .subscribe((tareas: Item[]) => (this.itemList = tareas));
    //this.storage.deleteImage(this.path);
    //this.storage.updateImage('images/hombre1.jpg','');
    this.messaging.getMessages().subscribe((message) => {
      const { notification } = message;
      console.log(notification);
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.itemList, event.previousIndex, event.currentIndex);
  }

  completeItem(event: boolean, id: number) {
    this.firestore.updateTarea(id, event);
  }

  completeItems() {
    this.firestore.updateTareas(true);
  }

  deleteItems() {
    this.firestore.deleteTareas();
  }

  createItem() {
    let newID = this.itemList.length;

    this.storage
      .createImage(`images/${this.file.name}`, this.file)
      .then((data) => {
        return data.ref
          .getDownloadURL()
          .then((url) => {
            this.firestore.addTarea({
              id: newID,
              text: this.msg,
              completed: false,
              img: url,
            });
          })
          .catch((error) => {
            console.log('¡Error al publicar la imagen! ', error);
          });
      });
  }

  public fileBrowseHandler(event: any) {
    const files = event.target.files;
    this.file = files[0];
  }

  requestPermissions() {
    this.messaging
      .getPermissions()
      .then((token) => {
        console.log('🔥 ¡Permisos concedidos! 🔥');
        console.log('Este es tu token: ', token);
      })
      .catch((error) => {
        console.error('❌ Error al solicitar los permisos... ');
        console.log(error);
      });
  }
}
