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
  consultas: { IdConsulta:string, CPF: string, CRM: string, data:string, Horario:string }[] = [];
  pacientes: { CPF:string, Nome:string, Email:string, Senha:string, Situação:string }[] = [];
  medicos: { CRM: string, Nome: string, Especialidade: string, Email: string, Senha: string, Situação: string }[] = [];
  exames: { CodExames: string, Nome: string, Desc: string, selected?: boolean }[] = [];
  filteredExames: { CodExames: string, Nome: string, Desc: string , selected?: boolean}[] = [];
  selectedPacienteCPF = '';
  selectedConsultaId = '';
  selectedMedicoCRM = '';
  pacienteNome = '';

  userName = '';

  @ViewChild('limparAlert') limparAlert!: IonAlert;
  constructor(private apiService: ApiService, 
    private toastController: ToastController, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.userName = this.authService.getNome() ?? 'Médico(a)';

    this.route.queryParams.subscribe(params => {
      if(params['CPF'] && params['IdConsulta'] && params['CRM']) {
        this.selectedPacienteCPF = params['CPF'];
        this.selectedConsultaId = params['IdConsulta'];
        this.selectedMedicoCRM = params['CRM'];
      }
    });    
    this.carregarDados();
  }

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

  mostrarNome(CPF: string): string {
    const paciente = this.pacientes.find(p => p.CPF === CPF);
    return paciente ? paciente.Nome : 'Desconhecido';
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredExames = this.exames.filter((exame) =>
      exame.Nome.toLowerCase().includes(query)
    );
  }

  async showLimparAlert() {
    await this.limparAlert.present();
  }

  confirmarLimparOpcoes() {
    this.filteredExames.forEach(exame => exame.selected = false);
  }

  async confirmar() {
    if (!this.selectedPacienteCPF) {
      console.error('Nenhum paciente selecionado.');
      return;
    }

    try {
      /*const consultas = await this.apiService.getConsultasDoPaciente(this.selectedPacienteCPF).toPromise();
      
      if (!consultas || consultas.length === 0) {
        console.error('Nenhuma consulta encontrada para o paciente selecionado.');
        return;
      }

      consultas.sort((b, a) => new Date(b.data).getTime() - new Date(a.data).getTime());

      const consultaMaisRecente = consultas[0];*/  

    const selectedExames = this.filteredExames.filter(exame => exame.selected);

    /*const medico = this.medicos.find(m => m.Nome === this.userName);
      if (!medico) {
        console.error('Médico não encontrado.');
        return;
      }

      const CRM = medico.CRM;*/

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
    const toast = await this.toastController.create({
      message: 'Exames marcados com sucesso.',
      duration: 5000,
      position: 'top'
    });
    await toast.present();

    // Limpar seleção após confirmação
    this.filteredExames.forEach(exame => exame.selected = false);
    this.navCtrl.navigateBack('/consultas-marcadas');
  } catch (error) {
    console.error('Erro ao carregar consultas do paciente:', error);
  }
}

  cancelar() {
    this.navCtrl.navigateBack('/consultas-marcadas');
  }
}
