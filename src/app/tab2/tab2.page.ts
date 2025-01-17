import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  savedData: string | null = null;

  constructor(private storage: Storage) {}

  async ionViewWillEnter() {
    await this.storage.create(); // Tuhle opět uložiště
  }

  async loadData() {
    const data = await this.storage.get('myData');
    this.savedData = data;
    if (!data) {
      alert('Žádná data nejsou uložená.');
    }
  }
}
