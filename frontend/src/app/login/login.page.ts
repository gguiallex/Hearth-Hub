import { AlertService } from '../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  senha: string = "";

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit() { 
      // Verifica se há parâmetros na URL (token de confirmação)
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (token) {
          this.validarConta(token);
        }
      });
   }

   validarConta(token: string) {
    console.log(token);
    this.authService.validarConta(token).subscribe(
      (response: any) => {
        this.alertService.showAlert('Conta ativada com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Erro ao validar conta:', error);
        this.alertService.showAlert('Erro ao validar conta: ' + error);
      }
    );
  }

  login() {
    this.authService.login(this.email, this.senha).subscribe(
      (response: any) => {

        if(!this.email || !this.senha){
          this.alertService.showAlert('Preencha todos os campos para efetuar o login')
          return;
        }
  
        
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('perfil', response.perfil); // Armazene o perfil do usuário localmente
          localStorage.setItem('situação', response.situação);
          console.log('Login bem sucedido! Token armazenado.');
          console.log(response.token, response.perfil, response.situação);
  
          // Redirecione o usuário com base no perfil
          switch (response.perfil) {
            case 'P':
              if(response.situação == 'Validado'){
              this.router.navigate(['/paciente']).then(() => {
                location.reload();
              });
            }else if(response.situação == 'Bloqueado') {
              this.alertService.showAlert('Erro ao fazer login: Sua conta esta bloqueada! Entre em contato com algum supervisor para saber mais');
            }else{
              this.alertService.showAlert('Erro ao fazer login: Sua conta esta pendente! Entre no seu Email e confirme que é você para poder acessar sua conta');
            }
              break;
            case 'M':
              if(response.situação == 'Validado'){
                this.router.navigate(['/medico']);
              }else if(response.situação == 'Bloqueado') {
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta bloqueada! Entre em contato com algum supervisor para saber mais');
              }else{
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta pendente! Entre no seu Email e confirme que é você para poder acessar sua conta');
              }
              break;
            case 'E':
              if(response.situação == 'Validado'){
                this.router.navigate(['/enfermeiro']);
              }else if(response.situação == 'Bloqueado') {
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta bloqueada! Entre em contato com algum supervisor para saber mais');
              }else{
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta pendente! Entre no seu Email e confirme que é você para poder acessar sua conta');
              }
              break;
            case 'A':
              if(response.situação == 'Validado'){
                this.router.navigate(['/home-adm']);
              }else if(response.situação == 'Bloqueado') {
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta bloqueada! Entre em contato com algum supervisor para saber mais');
              }else{
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta pendente! Entre no seu Email e confirme que é você para poder acessar sua conta');
              }
              break;
            default:
              console.error('Perfil do usuário não reconhecido:', response.perfil);
              // Redirecione para uma página padrão ou exiba uma mensagem de erro
              break;
          }
        } else {
          console.error('Token não encontrado na resposta do servidor.');
        }
      },
      
      async error => {
        console.error('Erro ao fazer login:', error);
        await this.alertService.showAlert('Erro ao fazer login: Email ou senha incorreto(s)');
      }
    );
  }
}
