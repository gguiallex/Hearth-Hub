import { AlertService } from '../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = ""; // Armazena o email do usuário
  senha: string = ""; // Armazena a senha do usuário

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit() { 
      // Verifica se há parâmetros na URL (como o token de confirmação de conta)
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (token) {
          this.validarConta(token);  // Chama a função de validação se um token for encontrado
        }
      });
   }

   // Função para validar a conta do usuário através do token
   validarConta(token: string) {
    console.log(token);
    this.authService.validarConta(token).subscribe(
      (response: any) => {
        this.alertService.showAlert('Conta ativada com sucesso! Faça login para continuar.');
        this.router.navigate(['/login']); // Redireciona para a página de login após a validação
      },
      error => {
        console.error('Erro ao validar conta:', error);
        this.alertService.showAlert('Erro ao validar conta: ' + error); // Exibe mensagem de erro
      }
    );
  }

  // Função para realizar o login
  login() {
    this.authService.login(this.email, this.senha).subscribe(
      (response: any) => {

        // Verifica se os campos de email e senha estão preenchidos
        if(!this.email || !this.senha){
          this.alertService.showAlert('Preencha todos os campos para efetuar o login')
          return;
        }
  
        
        if (response.token) {
          // Armazena o token e informações do perfil no localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('perfil', response.perfil);
          localStorage.setItem('situação', response.situação);
          console.log('Login bem sucedido! Token armazenado.');
          console.log(response.token, response.perfil, response.situação);
  
          // Redireciona o usuário com base no perfil e situação da conta
          switch (response.perfil) {
            case 'P': // Paciente
              if(response.situação == 'Validado'){
              this.router.navigate(['/paciente']);
            }else if(response.situação == 'Bloqueado') {
              this.alertService.showAlert('Erro ao fazer login: Sua conta esta bloqueada! Entre em contato com algum supervisor para saber mais');
            }else{
              this.alertService.showAlert('Erro ao fazer login: Sua conta esta pendente! Entre no seu Email e confirme que é você para poder acessar sua conta');
            }
              break;
            case 'M': // Médico
              if(response.situação == 'Validado'){
                this.router.navigate(['/medico']);
              }else if(response.situação == 'Bloqueado') {
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta bloqueada! Entre em contato com algum supervisor para saber mais');
              }else{
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta pendente! Entre no seu Email e confirme que é você para poder acessar sua conta');
              }
              break;
            case 'E': // Enfermeiro
              if(response.situação == 'Validado'){
                this.router.navigate(['/enfermeiro']);
              }else if(response.situação == 'Bloqueado') {
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta bloqueada! Entre em contato com algum supervisor para saber mais');
              }else{
                this.alertService.showAlert('Erro ao fazer login: Sua conta esta pendente! Entre no seu Email e confirme que é você para poder acessar sua conta');
              }
              break;
            case 'A': // Administrador
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
              this.alertService.showAlert('Perfil do usuário não reconhecido');
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
