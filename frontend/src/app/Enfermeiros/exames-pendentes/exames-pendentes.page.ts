import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

// Interface para definir a estrutura de um Exame
interface Exame {
  IdConsulta: string;
  CodExames: string;
  CRM: string;
  COREN?: string;
  DataPrescricao: string;
  DataRealizacao?: string | null;
  Status: string;
  NomeExame?: string;
  DescExame: string;
  mostrarDetalhes: boolean;
  novoStatus?: string;
  NomeMedico?: string;
  NomeEnfermeiro?: string;
}

// Interface para definir a estrutura de uma Consulta
interface Consulta {
  IdConsulta: string;
  exames: Exame[];
}

// Interface para definir a estrutura de um Enfermeiro
interface Enfermeiro {
  COREN: string;
  Nome: string;
}

@Component({
  selector: 'app-exames-pendentes',
  templateUrl: './exames-pendentes.page.html',
  styleUrls: ['./exames-pendentes.page.scss'],
})
export class ExamesPendentesPage implements OnInit {
  enfermeiros: Enfermeiro[] = []; // Lista de enfermeiros
  medicos: { Nome: string, CRM: string, Especialidade: string }[] = []; // Lista de médicos
  pacientes: { CPF: string, Nome: string }[] = []; // Lista de pacientes
  consultasPendentes: Consulta[] = []; // Lista de consultas pendentes
  consultasRealizadas: Consulta[] = []; // Lista de consultas realizadas
  selectedPacienteCPF = ''; // CPF do paciente selecionado
  selectedPacienteNome = ''; // Nome do paciente selecionado
  userName = ''; // Nome do usuário logado

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    // Verifica o status e perfil do usuário, redirecionando para login se necessário
    const situação = this.authService.getStatus();
    const perfil = this.authService.getProfile();
    if (perfil !== 'E' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }
    // Define o nome do usuário logado
    this.userName = this.authService.getNome() ?? 'Enfermeiro(a)';
    this.carregarDados(); // Carrega os dados iniciais
  }

  // Função para carregar dados iniciais de pacientes, enfermeiros e médicos
  carregarDados() {
    this.apiService.getPacientes().subscribe(
      pacientes => {
        this.pacientes = pacientes;
      },
      error => {
        console.error('Erro ao carregar pacientes:', error);
      }
    );

    this.apiService.getEnfermeiros().subscribe(
      enfermeiro => {
        this.enfermeiros = enfermeiro;
      },
      error => {
        console.error('Erro ao carregar enfermeiros: ', error);
      }
    );

    this.apiService.getMedicos().subscribe(
      medico => {
        this.medicos = medico;
      },
      error => {
        console.error('Erro ao carregar médicos: ', error);
      }
    );
  }

  // Função chamada quando há alteração na seleção de exames
  onExamesChange(event: any) {
    const selectedPaciente = this.pacientes.find(paciente => paciente.CPF === event.detail.value);
    if (selectedPaciente) {
      this.selectedPacienteNome = selectedPaciente.Nome;
    }
    this.selectedPacienteCPF = event.detail.value;
    console.log(this.selectedPacienteCPF);
    console.log(this.selectedPacienteNome);
    this.buscarExamesDoPaciente();
  }

  // Função para buscar exames do paciente selecionado
  buscarExamesDoPaciente() {
    if (!this.selectedPacienteCPF) return;

    this.apiService.getExamesDoPaciente(this.selectedPacienteCPF).subscribe(
      exames => {
        const consultasMap = new Map<string, Exame[]>();

        exames.forEach(exame => {
          const exameFormatado = {
            ...exame,
            DataPrescricao: this.formatarData(exame.DataPrescricao),
            DataRealizacao: exame.DataRealizacao ? this.formatarData(exame.DataRealizacao) : null,
            NomeExame: 'Nome desconhecido',
            DescExame: 'Descrição desconhecida',
            mostrarDetalhes: false
          };

          if (!consultasMap.has(exame.IdConsulta)) {
            consultasMap.set(exame.IdConsulta, []);
          }
          consultasMap.get(exame.IdConsulta)!.push(exameFormatado);
        });

        this.consultasPendentes = [];
        this.consultasRealizadas = [];

        consultasMap.forEach((exames, IdConsulta) => {
          const consulta: Consulta = { IdConsulta, exames };
          const algumPendente = exames.some(exame => exame.Status !== 'Realizado');
          if (algumPendente) {
            this.consultasPendentes.push(consulta);
          } else {
            this.consultasRealizadas.push(consulta);
          }
        });

        // Chame a função atualizarDetalhesExames para pendentes e realizados
        this.atualizarDetalhesExames();
      },
      error => {
        console.error('Erro ao buscar exames do paciente:', error);
      }
    );
  }

  // Função para atualizar detalhes dos exames
  atualizarDetalhesExames() {
    const atualizarConsulta = (consulta: Consulta) => {
      return Promise.all(consulta.exames.map(async exame => {
        try {
          const detalhesExame = await this.apiService.getExameByCod(exame.CodExames).toPromise();
          const medicoArray = await this.apiService.getMedicoByCRM(exame.CRM).toPromise();
          const enfermeiroArray = exame.COREN ? await this.apiService.getEnfermeiroByCOREN(exame.COREN).toPromise() : null;

          const medico = medicoArray && medicoArray.length > 0 ? medicoArray[0] : null;
          const enfermeiro = enfermeiroArray && enfermeiroArray.length > 0 ? enfermeiroArray[0] : null;

          if (detalhesExame && detalhesExame.length > 0) {
            return {
              ...exame,
              NomeExame: detalhesExame[0].Nome,
              DescExame: detalhesExame[0].Descrição,
              NomeMedico: medico ? medico.Nome : 'Nome do médico desconhecido',
              NomeEnfermeiro: enfermeiro ? enfermeiro.Nome : 'Nome do enfermeiro desconhecido'
            };
          }
          return exame;
        } catch (error) {
          console.error(`Erro ao buscar detalhes do exame com código ${exame.CodExames}:`, error);
          return exame;
        }
      }));
    };

    const promessasPendentes = this.consultasPendentes.map(atualizarConsulta);
    const promessasRealizadas = this.consultasRealizadas.map(atualizarConsulta);

    Promise.all([...promessasPendentes, ...promessasRealizadas]).then(resultados => {
      this.consultasPendentes.forEach((consulta, index) => {
        consulta.exames = resultados[index];
      });

      this.consultasRealizadas.forEach((consulta, index) => {
        consulta.exames = resultados[this.consultasPendentes.length + index];
      });
    });
  }

  // Função para atualizar o status dos exames
  atualizarExames() {
    const atualizacoes: Promise<any>[] = [];

    const enfermeiro = this.enfermeiros.find(e => e.Nome === this.userName);
    if (!enfermeiro) {
      console.error('Enfermeiro não encontrado.');
      return;
    }

    const COREN = enfermeiro.COREN;

    this.consultasPendentes.forEach(consulta => {
      consulta.exames.forEach(exame => {
        if (exame.novoStatus && exame.novoStatus !== exame.Status) {
          atualizacoes.push(
            this.apiService.atualizarExamesPresc(
              exame.IdConsulta,
              exame.CodExames,
              COREN,
              exame.novoStatus
            ).toPromise()
          );

          // Atualizar apenas o exame específico
          exame.Status = exame.novoStatus;
          exame.DataRealizacao = exame.novoStatus === 'Realizado'
            ? this.formatarData(new Date().toISOString())
            : null;
        }
      });
    });

    Promise.all(atualizacoes)
      .then(() => {
        this.buscarExamesDoPaciente();

        this.apiService.getTotalExamesPendentes().subscribe(quantidade => {
          this.authService.setExamesPendentes(quantidade); // Atualizar o valor no serviço
        });
      })
      .catch(error => {
        console.error('Erro ao atualizar status dos exames: ', error);
        this.mostrarAlerta('Erro', 'Não foi possível atualizar o status dos exames.');
      });
  }

  // Função para marcar o status do exame como realizado ou pendente
  marcarExame(exame: Exame, realizado: boolean) {
    const novoStatus = realizado ? 'Realizado' : 'Pendente';
    exame.novoStatus = novoStatus;
  }

  // Função para alternar a visibilidade dos detalhes do exame
  toggleDetalhes(event: Event, exame: Exame) {
    event.stopPropagation();
    exame.mostrarDetalhes = !exame.mostrarDetalhes;
  }

  // Função para limpar o status dos exames pendentes
  limpar() {
    this.consultasPendentes.forEach(consulta => {
      consulta.exames.forEach(exame => {
        if (exame.Status !== 'Realizado') {
          exame.Status = 'Pendente';
        }
      });
    });
  }

  // Função para formatar a data no formato DD/MM/AAAA
  private formatarData(data: string): string {
    const dateObj = new Date(data);
    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const ano = dateObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // Função para exibir um alerta
  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}