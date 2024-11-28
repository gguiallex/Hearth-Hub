import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-enfermeiros',
  templateUrl: './home-enfermeiros.page.html',
  styleUrls: ['./home-enfermeiros.page.scss'],
})
export class HomeEnfermeirosPage implements OnInit {
  userName = ''; // Armazena o nome do usuário logado
  examesPendentes: number | null = null; // Armazena a quantidade de exames pendentes

  constructor(private menuController: MenuController,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    // Verifica o status e perfil do usuário, redirecionando para login se necessário
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'E' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    } else {
      this.userName = this.authService.getNome() ?? 'Enfermeiro(a)'; // Define o nome do usuário logado

      // Obtém a quantidade de exames pendentes do serviço de autenticação e atualiza a propriedade local
      this.authService.getExamesPendentes().subscribe(quantidade => {
        this.examesPendentes = quantidade;
      });

      // Inicialmente busca a quantidade de exames pendentes diretamente da API e atualiza no serviço de autenticação
      this.apiService.getTotalExamesPendentes().subscribe(quantidade => {
        this.authService.setExamesPendentes(quantidade); // Definir o valor no serviço
      });
    }
  }

  // Função para alternar a visibilidade do menu lateral
  toggleMenu() {
    this.menuController.toggle();
  }

  // Função para navegar até a página de exames pendentes
  navigateToExamesPendentes() {
    this.router.navigate(['/exames-pendentes']);
  }

  // Função para realizar o logout do usuário
  logout() {
    this.menuController.close().then(() => {
      // Chama o serviço de logout e navega para a página de login
      this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        location.reload();  // Recarregar a página após o logout e redirecionamento
      });
    });
  }

}
