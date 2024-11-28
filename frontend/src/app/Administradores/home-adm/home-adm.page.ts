import { SuspensoService } from '../../services/suspenso.service';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home-adm',
  templateUrl: './home-adm.page.html',
  styleUrls: ['./home-adm.page.scss'],
})
export class HomeAdmPage implements OnInit {
  totalSuspensos: number = 0; // Armazena o número total de usuários suspensos
  userName = ''; // Armazena o nome do usuário logado
  totalExames: number = 0; // Armazena o número total de exames
  totalEspecialidades: number = 0; // Armazena o número total de especialidades
  //atividadesRecentes: string[] = ['Usuário X suspenso', 'Especialidade Y adicionada']; // Exemplo de atividades recentes

  constructor(private menuController: MenuController,
    private router: Router,
    private authService: AuthService,
    private suspensoService: SuspensoService,
    private apiService: ApiService
  ) { }

  // Função para alternar o menu
  toggleMenu() {
    this.menuController.toggle();
  }

  // Navega para a página de inspeção
  navigateToInspecionar() {
    this.router.navigate(['/admin']);
  }

  // Navega para a página de gerenciamento de usuários
  navigateToGerenciar() {
    this.router.navigate(['/tabs/gerencia-usuarios']);
  }

  // Navega para a página de especialidades
  navigateToEspecialidades() {
    this.router.navigate(['/especialidades']);
  }

  // Navega para a página de exames
  navigateToExames() {
    this.router.navigate(['/exames']);
  }

  // Função de logout
  logout() {
    this.menuController.close().then(() => {
      this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        location.reload();  // Recarregar a página após o logout e redirecionamento
      });
    });
  }

  ngOnInit() {
    const situação = this.authService.getStatus();
    const perfil = this.authService.getProfile();
    // Verifica se o usuário tem permissão para acessar a página
    if (perfil !== 'A' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }

    // Atualiza o contador de usuários suspensos
    this.suspensoService.updateSuspensoCount();

    // Inscreve-se no contador de usuários suspensos para atualizar a interface
    this.suspensoService.suspensoCount$.subscribe(count => {
      this.totalSuspensos = count;
    });

    // Obtém o nome do usuário logado
    this.userName = this.authService.getNome() ?? 'administrador(a)';

    // Obtém o número total de exames
    this.apiService.countExames().subscribe(count => {
      this.totalExames = count;
    });

    // Obtém o número total de especialidades
    this.apiService.CountEspecialidades().subscribe(count => {
      this.totalEspecialidades = count;
    });
  }

}
