import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
})
export class RecuperarSenhaPage implements OnInit {

  constructor(private apiService: ApiService, private toastController: ToastController, private alertService: AlertService) { }

  email = '';
  selectedOption: string = '';

  ngOnInit() {
  }

  selectOption(event: any) {
    this.selectedOption = event.detail.value;
    console.log('Opção selecionada:', this.selectedOption);
  }

  async solicitarRecuperacao() {

    if (!this.email || !this.selectedOption) {
      this.alertService.showAlert('Escolha o tipo de conta que deseja redefinir a senha e preencha o campo de email para enviarmos o link de redefinição de senha');
      return;
    }

    try {
      await this.apiService.solicitarRecuperacaoSenha(this.email, this.selectedOption).subscribe(
         async () => {
          this.alertService.showAlert('Solicitação de senha enviada com sucesso, verifique sua caixa de entrada!');
        },
         async (error) => {
          console.error('Erro ao solicitar recuperação de senha:', error);
          this.alertService.showAlert('Erro ao enviar solicitação de recuperação de senha, tente novamente');
        }
      );
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      this.alertService.showAlert('Erro ao enviar solicitação de recuperação de senha, tente novamente');
    } 
  }

}
