import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private AlertController: AlertController) { }

    /**
   * Exibe um alerta com uma mensagem personalizada.
   * @param message - A mensagem que será exibida no alerta.
   */
  async showAlert(message: string) {
     // Cria uma instância de alerta com título, mensagem e um botão 'OK'.
    const alert = await this.AlertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });

    // Apresenta o alerta na interface.
    await alert.present();
  }
}
