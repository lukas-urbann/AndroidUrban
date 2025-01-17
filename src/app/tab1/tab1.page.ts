import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  dataToSave: string = '';

  constructor(private storage: Storage) {}

  async ionViewWillEnter() {
    await this.storage.create(); //tuhle se inicializuje storage
  }

  async saveData() {
    if (this.dataToSave) {
      await this.storage.set('myData', this.dataToSave);
      alert('Data byla uložena!');
      this.dataToSave = '';
    } else {
      alert('Prosím, zadejte nějaká data.');
    }
  }
}
