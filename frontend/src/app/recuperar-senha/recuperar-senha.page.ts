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

  // Inicialização das variáveis de controle
  email = ''; // Armazena o e-mail fornecido pelo usuário
  selectedOption: string = ''; // Armazena o tipo de conta selecionado pelo usuário

  constructor(private apiService: ApiService, private toastController: ToastController, private alertService: AlertService) { }

  ngOnInit() {
  }

  // Função chamada ao selecionar o tipo de conta
  selectOption(event: any) {
    this.selectedOption = event.detail.value; // Captura o valor selecionado pelo usuário
  }

  // Função para solicitar a recuperação de senha
  async solicitarRecuperacao() {
    // Verifica se o e-mail e a opção de conta foram preenchidos
    if (!this.email || !this.selectedOption) {
      this.alertService.showAlert('Escolha o tipo de conta que deseja redefinir a senha e preencha o campo de email para enviarmos o link de redefinição de senha');
      return;
    }

    try {
      // Chamada para o serviço de recuperação de senha
      await this.apiService.solicitarRecuperacaoSenha(this.email, this.selectedOption).subscribe(
        async () => {
          // Exibe mensagem de sucesso
          this.alertService.showAlert('Solicitação de senha enviada com sucesso, verifique sua caixa de entrada!');
        },
        async (error) => {
          // Exibe mensagem de erro
          console.error('Erro ao solicitar recuperação de senha:', error);
          this.alertService.showAlert('Erro ao enviar solicitação de recuperação de senha, tente novamente');
        }
      );
    } catch (error) {
      // Tratamento de erros genéricos
      console.error('Erro ao solicitar recuperação de senha:', error);
      this.alertService.showAlert('Erro ao enviar solicitação de recuperação de senha, tente novamente');
    }
  }

}
