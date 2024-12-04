import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IonAlert, ToastController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-marcar-exames',
  templateUrl: './marcar-exames.page.html',
  styleUrls: ['./marcar-exames.page.scss'],
})
export class MarcarExamesPage implements OnInit {
  
  // Propriedades para armazenar dados de consultas, pacientes, médicos e exames
  consultas: { IdConsulta:string, CPF: string, CRM: string, data:string, Horario:string }[] = [];
  pacientes: { CPF:string, Nome:string, Email:string, Senha:string, Situação:string }[] = [];
  medicos: { CRM: string, Nome: string, Especialidade: string, Email: string, Senha: string, Situação: string }[] = [];
  exames: { CodExames: string, Nome: string, Desc: string, selected?: boolean }[] = [];
  filteredExames: { CodExames: string, Nome: string, Desc: string , selected?: boolean}[] = [];

  // Variáveis para consulta e seleção de paciente/médico
  selectedPacienteCPF = '';
  selectedConsultaId = '';
  selectedMedicoCRM = '';
  pacienteNome = '';
  userName = '';

  // Referência ao alerta de confirmação de limpeza
  @ViewChild('limparAlert') limparAlert!: IonAlert;

  constructor(private apiService: ApiService, 
    private toastController: ToastController, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // Obtém o nome do usuário autenticado
    this.userName = this.authService.getNome() ?? 'Médico(a)';

    // Obtém parâmetros da rota para selecionar consulta, paciente e médico
    this.route.queryParams.subscribe(params => {
      if(params['CPF'] && params['IdConsulta'] && params['CRM']) {
        this.selectedPacienteCPF = params['CPF'];
        this.selectedConsultaId = params['IdConsulta'];
        this.selectedMedicoCRM = params['CRM'];
      }
    });    

    // Carrega dados iniciais
    this.carregarDados();
  }

  // Configuração dos botões do alerta de limpar
  public deleteButtons = [
    {
      text: 'Cancelar',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Limpar',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.confirmarLimparOpcoes();
      }
    },
  ];

  // Carrega consultas, pacientes, exames e médicos da API
  carregarDados(){
    this.apiService.getConsultas().subscribe(
      consultas => {
        this.consultas = consultas;
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );

    this.apiService.getPacientes().subscribe(
      pacientes => {
        this.pacientes = pacientes;
        if(this.selectedPacienteCPF){
          this.pacienteNome = this.mostrarNome(this.selectedPacienteCPF);
        }
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );

    this.apiService.getExames().subscribe(
      exames => {
        exames.sort((a, b) => a.Nome.localeCompare(b.Nome));
        this.exames = exames;
        this.filteredExames = exames;
      },
      error => {
        console.error('Erro ao carregar especialidades:', error);
      }
    );

    this.apiService.getMedicos().subscribe(
      medicos => {
        this.medicos = medicos;
      },
      error => {
        console.error('Erro ao carregar médicos:', error);
      }
    );
  }

  // Retorna o nome do paciente baseado no CPF
  mostrarNome(CPF: string): string {
    const paciente = this.pacientes.find(p => p.CPF === CPF);
    return paciente ? paciente.Nome : 'Desconhecido';
  }

  // Filtra exames pelo nome digitado
  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredExames = this.exames.filter((exame) =>
      exame.Nome.toLowerCase().includes(query)
    );
  }

  // Exibe alerta de confirmação de limpeza de seleção
  async showLimparAlert() {
    await this.limparAlert.present();
  }

  // Limpa a seleção de exames
  confirmarLimparOpcoes() {
    this.filteredExames.forEach(exame => exame.selected = false);
  }

  // Confirma a marcação dos exames selecionados
  async confirmar() {
    if (!this.selectedPacienteCPF) {
      console.error('Nenhum paciente selecionado.');
      return;
    }

    try { 
    const selectedExames = this.filteredExames.filter(exame => exame.selected);

    // Prescreve cada exame selecionado
    for (const exame of selectedExames) {
      this.apiService.criarExamePresc(this.selectedConsultaId, exame.CodExames, this.selectedPacienteCPF, this.selectedMedicoCRM).subscribe(
        response => {
          console.log('Exame prescrito com sucesso:', response);
        },
        error => {
          console.error('Erro ao prescrever exame:', error);
        }
      );
    }

    // Exibe mensagem de sucesso
    const toast = await this.toastController.create({
      message: 'Exames marcados com sucesso.',
      duration: 5000,
      position: 'top'
    });
    await toast.present();

    // Limpa a seleção e redireciona
    this.confirmarLimparOpcoes();
    this.filteredExames.forEach(exame => exame.selected = false);
    this.navCtrl.navigateBack('/consultas-marcadas');
  } catch (error) {
    console.error('Erro ao carregar consultas do paciente:', error);
  }
}

  // Cancela a operação e retorna à página anterior
  cancelar() {
    this.navCtrl.navigateBack('/consultas-marcadas');
  }
}
