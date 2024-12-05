import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

// Interface para representar uma consulta com informações opcionais do médico
interface Consulta {
  CPF: string;
  CRM: string;
  data: string;
  Horario: string;
  medico?: { Nome: string; Especialidade: string }; // Informação do médico pode ser opcional
}

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.page.html',
  styleUrls: ['./paciente.page.scss'],
})


export class PacientePage implements OnInit, OnDestroy {
  private cpfCheckInterval: any; // Variável para armazenar o intervalo de verificação do CPF
  private subscriptions: Subscription = new Subscription(); // Gerenciador de assinaturas para evitar vazamentos

  // Variáveis para exibir informações na página
  userName = '';
  cpf: string | null = null;
  consultas: Consulta[] = [];
  consultasRecentes: Consulta[] = [];
  consultaMaisRecente: Consulta | null = null;

  constructor(private menuController: MenuController,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Verifica se o usuário é paciente e está validado
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();

    if (perfil !== 'P' && situação !== 'Validado') {
      this.router.navigate(['/login']); // Redireciona se não for paciente validado
    } else {
      this.userName = this.authService.getNome() ?? 'Paciente'; // Define o nome do usuário
      this.waitForCpf(); // Função para aguardar o CPF estar disponível
    }
  }

  // Aguarda até que o CPF seja carregado pelo serviço de autenticação
  waitForCpf() {
    this.cpfCheckInterval = setInterval(() => {
      this.cpf = this.authService.getCpf();
      if (this.cpf) {
        clearInterval(this.cpfCheckInterval); // Para o intervalo assim que o CPF for encontrado
        this.carregarConsultas(this.cpf); // Chama carregarConsultas com o CPF
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

  // Alterna a visibilidade do menu lateral
  toggleMenu() {
    this.menuController.toggle();
  }

  // Navega para a página de marcação de consulta
  navigateToMarcarConsulta() {
    this.router.navigate(['/marcar-consulta']);
  }

  // Navega para a página de exames marcados
  navigateToExamesMarcados() {
    this.router.navigate(['/exames-marcados']);
  }

  // Carrega as consultas do paciente usando o CPF
  carregarConsultas(cpf: string) {
    this.apiService.getConsultasDoPaciente(cpf).subscribe(
      consultas => {
        this.consultas = consultas.map(consulta => ({
          CPF: consulta.CPF,
          CRM: consulta.CRM,
          data: consulta.data,
          Horario: consulta.Horario,
          medico: undefined // Inicializa sem dados de médico
        }));

        const agora = new Date();

        // Filtra consultas futuras para encontrar a mais recente
        const consultasFuturas = this.consultas.filter(consulta => {
          const dataHoraConsulta = new Date(consulta.data.split('T')[0] + 'T' + consulta.Horario);
          return dataHoraConsulta.getTime() >= agora.getTime();
        });

        // Determina a consulta mais recente entre as futuras
        if (consultasFuturas.length > 0) {
          this.consultaMaisRecente = consultasFuturas.reduce((prev, current) =>
            new Date(prev.data.split('T')[0] + 'T' + prev.Horario).getTime() < new Date(current.data.split('T')[0] + 'T' + current.Horario).getTime() ? prev : current
          );
        } else {
          this.consultaMaisRecente = null;
        }

        // Associa dados de médicos às consultas
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

  // Realiza o logout e recarrega a página
  logout() {
    this.menuController.close().then(() => {
      this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        location.reload();  // Recarregar a página após o logout
      });
    });
  }

}