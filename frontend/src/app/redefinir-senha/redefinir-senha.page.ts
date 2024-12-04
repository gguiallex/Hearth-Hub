import { AlertService } from './../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.page.html',
  styleUrls: ['./redefinir-senha.page.scss'],
})
export class RedefinirSenhaPage implements OnInit {

  // Armazena o token recebido e a nova senha
  token = '';
  novaSenha = '';

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private toastController: ToastController,
    private router: Router,
    private alertService: AlertService) { }

  ngOnInit() {
    // Obtém o token da URL ao inicializar a página
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        // Exibe mensagem caso o token não esteja presente
        console.error('Token de redefinição de senha não fornecido.');
      }
    });
  }

  // Função para redefinir a senha
  async redefinirSenha() {
    try {

      // Valida se a nova senha foi fornecida
      if (!this.novaSenha) {
        console.error('Nova senha não fornecida.');
        await this.alertService.showAlert('Sua senha não pode ser vazia')
        return;
      }

      // Chamada ao serviço para redefinir a senha
      await this.apiService.redefinirSenhaComToken(this.token, this.novaSenha).subscribe(
        async () => {
          // Sucesso: exibe alerta e redireciona para a tela de login
          await this.alertService.showAlert('Sua senha senha foi redefinida com sucesso! Você será redirecionado para a tela de login')
          this.router.navigate(['/login']);

        },
        async (error) => {
          // Erro na API: exibe mensagem de erro
          console.error('Erro ao redefinir senha:', error);
          this.alertService.showAlert('Erro ao redefinir a senha, tente novamente');
        }
      );
    } catch (error) {
      // Captura erros inesperados
      console.error('Erro ao redefinir senha:', error);
      this.alertService.showAlert('Erro ao enviar solicitação de recuperação de senha, tente novamente');
    }
  }
}
