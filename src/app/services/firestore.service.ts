import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) {}

  public getTareas(): Observable<Item[]> {
    return this.firestore
      .collection('tareas')
      .valueChanges()
      .pipe(map(this.treatData));
  }

  private treatData(data: any[]): Item[] {
    return data.map((item: any) => ({
      id: item.id,
      text: item.text,
      completed: item.completed,
      img: item.img,
    }));
  }

  public updateTarea(id: number, completed: boolean): void {
    this.firestore.doc(`tareas/${id}`).update({ completed: completed });
  }

  public updateTareas(completed: boolean) {
    this.firestore
      .collection('tareas') // Referenciamos la lista de tareas
      .get() //Obtenemos la versión ACTUAL de sus documentos
      .toPromise() // Transformamos el observable a un objeto Promise
      .then((querySnapshot) => {
        // Recorremos la lista de documentos en esta versión actual
        // de la colección, alojada en el objeto querySnapshot
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            completed: completed,
          });
        });
      });
  }

  // Métodos para eliminar todas las tareas de la colección 'tareas'
  public deleteTareas() {
    this.firestore
      .collection('tareas') // Referenciamos la lista de tareas
      .get() //Obtenemos la versión ACTUAL de sus documentos
      .toPromise() // Transformamos el observable a un objeto Promise
      .then((querySnapshot) => {
        // Recorremos la lista de documentos en esta versión actual
        // de la colección, alojada en el objeto querySnapshot
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }

  public deleteTarea(id: number): void {
    this.firestore
      .collection('tareas')
      .doc(id + '')
      .delete();
  }

  public addTarea(task: Item) {
    this.firestore
      .collection('tareas')
      .doc(task.id + '') // Si no encuentra este documento, lo creará
      .set(task);
  }

  // Añado aquí los métodos para leer la imagen que se moverá líbremente por el espacio acotado para ello en el componente dragdrop
  public getImage(docId: string ) {
    return this.firestore.collection('imagen').doc(docId).snapshotChanges();
  }

  // Método para actualizar la referencia de la imagen que podemos cargar en el dragnaddrop
  public updateImage(urlImagen: string) {
    this.firestore.doc('imagen/1').update({ url: urlImagen });
  }
}
