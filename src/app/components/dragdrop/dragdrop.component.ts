import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.css']
})
export class DragdropComponent implements OnInit {

  actualFile!: File;
  newFile!: File;

  constructor(
    private firestore: FirestoreService,
    private storage: StorageService
    ) {}

  ngOnInit(): void {
    this.firestore.getImage('1').subscribe((data: any) => {
      this.actualFile = data.payload.data()['url'];
    });
  }

  // Actualizamos el archivo seleccionado
  public fileHandler(event: any){
    this.newFile = event.target.files[0];
    console.log(this.newFile);
  }
  uploadImg() {

    // 2. Subir el archivo al storage
    this.storage
    .createImage(`images/${this.newFile.name}`, this.newFile)
    .then((data) => {
      return data.ref
      .getDownloadURL()
      .then((url: string) => {
        this.firestore.updateImage(url);
      })
      .catch((error) => {
        console.log('Error al publicar la imagen! ', error);
      });
    });
  }
}
