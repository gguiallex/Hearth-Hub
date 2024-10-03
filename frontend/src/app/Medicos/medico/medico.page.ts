import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.page.html',
  styleUrls: ['./medico.page.scss'],
})
export class MedicoPage implements OnInit {

  consultasHoje: { CPF: string, CRM: string, data: string, Horario: string }[] = [];
  consultaMaisRecente: { CPF: string, CRM: string, data: string, Horario: string } | null = null;
  pacientes: { CPF:string, Nome:string, Email:string, Senha:string, Situação:string }[] = [];

  userName = '';
  crmMedicoLogado = '';

  constructor(private authService: AuthService,
              private router: Router,
              private menuController: MenuController,
              private apiService: ApiService
  ) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'M' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    } else {
      this.userName = this.authService.getNome() ?? 'Médico(a)';
      this.crmMedicoLogado = this.authService.getCRM() ?? '00000';
      this.carregarConsultas();
      this.carregarPacientes();
    }
  }

  

  toggleMenu() {
    this.menuController.toggle();
  }

  navigateToConsultasMarcadas() {
    this.router.navigate(['/consultas-marcadas']);
  }

  navigateToMarcarExames() {
    this.router.navigate(['/marcar-exames']);
  }

  logout() {
    this.menuController.close().then(() => {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      location.reload();  // Recarregar a página após o logout e redirecionamento
    });
    });
  }

  carregarConsultas() {
    this.apiService.getConsultas().subscribe(
      consultas => {
        const hoje = new Date().toISOString().split('T')[0];

        this.consultasHoje = consultas.filter(consulta => 
          consulta.data.split('T')[0] === hoje && consulta.CRM == this.crmMedicoLogado);
        if (this.consultasHoje.length > 0) {
          this.consultaMaisRecente = this.consultasHoje.reduce((prev, current) =>
            new Date(prev.data + 'T' + prev.Horario).getTime() > new Date(current.data + 'T' + current.Horario).getTime() ? prev : current
          );
        }
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );
  }

  carregarPacientes() {
    this.apiService.getPacientes().subscribe(
      pacientes => {
        this.pacientes = pacientes;
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );
  }

  mostrarNome(CPF: string): string {
    const paciente = this.pacientes.find(p => p.CPF === CPF);
    return paciente ? paciente.Nome : 'Desconhecido';
  }

}
