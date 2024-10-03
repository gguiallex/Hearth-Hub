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

  token = '';
  novaSenha = '';

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private toastController: ToastController,
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        // Redirecionar ou exibir mensagem de erro, caso o token não seja fornecido
      }
    });
  }

  async redefinirSenha() {
    try {
      if (!this.token) {
        console.error('Token de redefinição de senha não fornecido.');
        // Redirecionar ou exibir mensagem de erro, caso o token não seja fornecido
        return;
      }
  
      if (!this.novaSenha) {
        console.error('Nova senha não fornecida.');
        await this.alertService.showAlert('Sua senha não pode ser vazia')
        return;
      }
  
      await this.apiService.redefinirSenhaComToken(this.token, this.novaSenha).subscribe(
        async () => {
          await this.alertService.showAlert('Sua senha senha foi redefinida com sucesso! Você será redirecionado para a tela de login')
          this.router.navigate(['/login']);

        },
        async (error) => {
          console.error('Erro ao redefinir senha:', error);
          this.alertService.showAlert('Erro ao redefinir a senha, tente novamente');
        }
      );
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      this.alertService.showAlert('Erro ao enviar solicitação de recuperação de senha, tente novamente');
    }
  }

}
