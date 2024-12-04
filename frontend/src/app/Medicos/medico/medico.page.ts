import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.page.html',
  styleUrls: ['./medico.page.scss'],
})
export class MedicoPage implements OnInit {

  // Propriedades que armazenam as consultas e pacientes
  consultasHoje: { CPF: string, CRM: string, data: string, Horario: string }[] = [];
  consultaMaisRecente: { CPF: string, CRM: string, data: string, Horario: string } | null = null;
  pacientes: { CPF:string, Nome:string, Email:string, Senha:string, Situação:string }[] = [];

  // Propriedades de usuário logado
  userName = '';
  crmMedicoLogado = '';

  constructor(private authService: AuthService,
              private router: Router,
              private menuController: MenuController,
              private apiService: ApiService
  ) { }

  ngOnInit() {
    // Verifica se o perfil é "Médico" e se o status está validado
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'M' && situação !== 'Validado') {
      // Redireciona para a página de login caso não tenha permissão
      this.router.navigate(['/login']);
    } else {
      // Carrega o nome e o CRM do médico logado
      this.userName = this.authService.getNome() ?? 'Médico(a)';
      this.crmMedicoLogado = this.authService.getCRM() ?? '00000';
      this.carregarConsultas();
      this.carregarPacientes();
    }
  }

  // Alterna a visibilidade do menu lateral
  toggleMenu() {
    this.menuController.toggle();
  }

  // Navega para a página de consultas marcadas
  navigateToConsultasMarcadas() {
    this.router.navigate(['/consultas-marcadas']);
  }

  // Navega para a página de marcação de exames
  navigateToMarcarExames() {
    this.router.navigate(['/marcar-exames']);
  }

  // Realiza o logout do usuário e recarrega a página para limpar o estado
  logout() {
    this.menuController.close().then(() => {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      location.reload();  // Recarregar a página após o logout
    });
    });
  }

  // Carrega consultas do dia para o médico logado
  carregarConsultas() {
    this.apiService.getConsultas().subscribe(
      consultas => {
        const hoje = new Date().toISOString().split('T')[0]; // Obtém a data de hoje no formato 'YYYY-MM-DD'

        // Filtra as consultas do dia atual para o médico logado
        this.consultasHoje = consultas.filter(consulta => 
          consulta.data.split('T')[0] === hoje && consulta.CRM == this.crmMedicoLogado);

        // Determina a consulta mais recente
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

  // Carrega todos os pacientes cadastrados no sistema
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

  // Retorna o nome do paciente com base no CPF
  mostrarNome(CPF: string): string {
    const paciente = this.pacientes.find(p => p.CPF === CPF);
    return paciente ? paciente.Nome : 'Desconhecido';
  }
}
