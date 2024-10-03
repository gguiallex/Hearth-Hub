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
  totalSuspensos: number = 0;
  userName = '';
  totalExames: number = 0;
  totalEspecialidades: number = 0;
  atividadesRecentes: string[] = ['Usuário X suspenso', 'Especialidade Y adicionada'];

  constructor(private menuController: MenuController, 
    private router: Router,
    private authService: AuthService,
    private suspensoService: SuspensoService,
    private apiService: ApiService
) { }

toggleMenu() {
this.menuController.toggle();
}

navigateToInspecionar() {
this.router.navigate(['/admin']);
}

navigateToGerenciar() {
  this.router.navigate(['/tabs/gerencia-usuarios']);
}

navigateToEspecialidades() {
  this.router.navigate(['/especialidades']);
}

navigateToExames() {
  this.router.navigate(['/exames']);
}

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
if (perfil !== 'A' && situação !=='Validado') {
this.router.navigate(['/login']);
}

this.suspensoService.updateSuspensoCount();

this.suspensoService.suspensoCount$.subscribe(count => {
  this.totalSuspensos = count;
});

 this.userName = this.authService.getNome() ?? 'administrador(a)';

 this.apiService.countExames().subscribe(count => {
  this.totalExames = count;
});

this.apiService.CountEspecialidades().subscribe(count => {
  this.totalEspecialidades = count;
});
}

}
