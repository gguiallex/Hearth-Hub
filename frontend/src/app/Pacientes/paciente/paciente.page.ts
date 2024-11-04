import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

interface Consulta {
  CPF: string;
  CRM: string;
  data: string;
  Horario: string;
  medico?: { Nome: string; Especialidade: string };
}

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.page.html',
  styleUrls: ['./paciente.page.scss'],
})


export class PacientePage implements OnInit, OnDestroy {
  private cpfCheckInterval: any;
  private subscriptions: Subscription = new Subscription();

  constructor(private menuController: MenuController,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  userName = '';
  cpf: string | null = null;
  consultas: Consulta[] = [];
  consultasRecentes: Consulta[] = [];
  consultaMaisRecente: Consulta | null = null;

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();

    if (perfil !== 'P' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    } else {
      this.userName = this.authService.getNome() ?? 'Paciente';
      this.waitForCpf(); // Função para aguardar o CPF estar disponível
    }
  }

  waitForCpf() {
    this.cpfCheckInterval = setInterval(() => {
      this.cpf = this.authService.getCpf();
      if (this.cpf) {
        clearInterval(this.cpfCheckInterval);  // Para o intervalo assim que o CPF for encontrado
        this.carregarConsultas(this.cpf);      // Chama carregarConsultas com o CPF
      } else {
        console.warn("Aguardando CPF...");
      }
    }, 200);  // Verifica a cada 200 ms
  }

  ngOnDestroy() {
    // Limpa o intervalo e as assinaturas quando o componente é destruído
    if (this.cpfCheckInterval) {
      clearInterval(this.cpfCheckInterval);
    }
    this.subscriptions.unsubscribe();
  }

  toggleMenu() {
    this.menuController.toggle();
  }

  navigateToMarcarConsulta() {
    this.router.navigate(['/marcar-consulta']);
  }

  navigateToExamesMarcados() {
    this.router.navigate(['/exames-marcados']);
  }

  carregarConsultas(cpf: string) {
    this.apiService.getConsultasDoPaciente(cpf).subscribe(
      consultas => {
        // Transformar dados para usar 'Horario' ao invés de 'Hora'
        this.consultas = consultas.map(consulta => ({
          CPF: consulta.CPF,
          CRM: consulta.CRM,
          data: consulta.data,
          Horario: consulta.Horario,
          medico: undefined
        }));

        console.log(consultas);

        const agora = new Date();

        const consultasFuturas = this.consultas.filter(consulta => {
          const dataHoraConsulta = new Date(consulta.data.split('T')[0] + 'T' + consulta.Horario);
          return dataHoraConsulta.getTime() >= agora.getTime();
        });

        console.log(consultasFuturas);

        if (consultasFuturas.length > 0) {
          this.consultaMaisRecente = consultasFuturas.reduce((prev, current) =>
            new Date(prev.data.split('T')[0] + 'T' + prev.Horario).getTime() < new Date(current.data.split('T')[0] + 'T' + current.Horario).getTime() ? prev : current
          );
        } else {
          this.consultaMaisRecente = null; // Nenhuma consulta futura encontrada
        }

        this.consultas.forEach(consulta => {
          this.apiService.getMedicoByCRM(consulta.CRM).subscribe(
            medicos => {
              if (medicos.length > 0) {
                consulta.medico = { Nome: medicos[0].Nome, Especialidade: medicos[0].Especialidade };
              }
            },
            error => {
              console.error('Erro ao carregar dados do médico:', error);
            }
          );
        });
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );
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