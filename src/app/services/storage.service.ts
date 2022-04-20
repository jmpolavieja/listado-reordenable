import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  // Transformación para recibir la imagen que le paso por argumento
  public getImage(img: string) {
    return this.storage.ref(img).getDownloadURL();
  }
  public createImage(path: string, file: any, metadata?: any) {
    return this.storage.upload(path, file, {customMetadata: metadata});
  }
  public updateImage(path: string, newFile: any, metadata?: any) {
    return this.deleteImage(path)
    .toPromise()
    .then(() => this.createImage(path, newFile, metadata))
    .catch(() => `No se ha podido eliminar el fichero ${path}`);
  }

  public deleteImage(path: string) {
    console.log('El path es ', path);
    return this.storage.ref(path).delete();
  }
}
