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
  userName = '';
  examesPendentes: number | null = null;

  constructor(private menuController: MenuController,
              private authService: AuthService,
              private apiService: ApiService,
              private router: Router
              ) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'E' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    } else {
      this.userName = this.authService.getNome() ?? 'Enfermeiro(a)';

      this.authService.getExamesPendentes().subscribe(quantidade => {
        this.examesPendentes = quantidade;
      });

      // Inicialmente buscar a quantidade de exames pendentes
      this.apiService.getTotalExamesPendentes().subscribe(quantidade => {
        this.authService.setExamesPendentes(quantidade); // Definir o valor no serviço
      });
    }

    
  }

  toggleMenu() {
    this.menuController.toggle();
  }

  navigateToExamesPendentes() {
    this.router.navigate(['/exames-pendentes']);
  } 

  logout() {
    this.menuController.close().then(() => {
      this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        location.reload();  // Recarregar a página após o logout e redirecionamento
      });
    });
  }

}
