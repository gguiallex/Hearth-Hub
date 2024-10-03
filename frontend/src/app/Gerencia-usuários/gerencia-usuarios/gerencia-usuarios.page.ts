import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-gerencia-usuarios',
  templateUrl: './gerencia-usuarios.page.html',
  styleUrls: ['./gerencia-usuarios.page.scss'],
})
export class GerenciaUsuariosPage implements OnInit {
  searchQuery: string = '';
  selectedOptions: string[] = ['pacientes', 'medicos', 'enfermeiros'];

  selectedMedico = '';
  selectedCRM = '';
  selectedEsp = '';
 
  selectedCOREN = '';
  selectedEnfermeiro = '';

  selectedPaciente = '';
  selectedCPF = '';

  selectedSituacao = '';
  selectedEmail = '';
  selectedSenha = '';

  pacientes: any[] = [];
  enfermeiros: any[] = [];
  medicos: any[] = [];
  filteredPacientes: any[] = [];
  filteredMedicos: any[] = [];
  filteredEnfermeiros: any[] = [];

  @ViewChild('detailModal') detailModal!: IonModal;

  constructor(private authService: AuthService,
              private router: Router,
              private apiService: ApiService,
  ) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'A' && situação !== 'Validado') {
    this.router.navigate(['/login']);
    }

    this.carregarPacientes();
    this.carregarMedicos();
    this.carregarEnfermeiros();
  }

  carregarPacientes(){
      this.apiService.getPacientes().subscribe(
        pacientes => {
          this.pacientes = pacientes;
          this.filteredPacientes = pacientes;
        },
        error => {
          console.error('Erro ao carregar pacientes:', error);
        }
      );
  }

  carregarMedicos(){
    this.apiService.getMedicos().subscribe(
      medicos => {
        this.medicos = medicos;
        this.filteredMedicos = medicos;
      },
      error => {
        console.error('Erro ao carregar medicos:', error);
      }
    );

  }

  carregarEnfermeiros(){
    this.apiService.getEnfermeiros().subscribe(
      enfermeiros => {
        this.enfermeiros = enfermeiros;
        this.filteredEnfermeiros = enfermeiros;
      },
      error => {
        console.error('Erro ao carregar enfermeiros:', error);
      }
    );

  }

  showEnfermeiroDetails(enfermeiro: any) {
    this.resetarFiltros();

    this.selectedEnfermeiro = enfermeiro.Nome;
    this.selectedCOREN = enfermeiro.COREN;
    this.selectedEmail = enfermeiro.Email;
    this.selectedSenha = enfermeiro.Senha;
    this.selectedSituacao = enfermeiro.Situação;
  
    this.detailModal.present();
  }

  showMedicoDetails(medico: any) {
    this.resetarFiltros();

    this.selectedMedico = medico.Nome;
    this.selectedCRM = medico.CRM;
    this.selectedEsp = medico.Especialidade;
    this.selectedEmail = medico.Email;
    this.selectedSenha = medico.Senha;
    this.selectedSituacao = medico.Situação;
  
    this.detailModal.present();
  }

  showPacienteDetails(paciente: any) {
    this.resetarFiltros();

    this.selectedPaciente = paciente.Nome;
    this.selectedCPF = paciente.CPF;
    this.selectedEmail = paciente.Email;
    this.selectedSenha = paciente.Senha;
    this.selectedSituacao = paciente.Situação;
  
    this.detailModal.present();
  }

  resetarFiltros(){
    this.selectedMedico = '';
    this.selectedCRM = '';
    this.selectedEsp = '';
    this.selectedEnfermeiro = '';
    this.selectedPaciente = '';
    this.selectedCOREN = '';
    this.selectedCPF = '';
    this.selectedSenha = '';
    this.selectedEmail = '';
    this.selectedSituacao = '';
  }

  updateSelection() {
    this.filteredPacientes = this.selectedOptions.includes('pacientes') ? this.pacientes : [];
    this.filteredMedicos = this.selectedOptions.includes('medicos') ? this.medicos : [];
    this.filteredEnfermeiros = this.selectedOptions.includes('enfermeiros') ? this.enfermeiros : [];

    this.filterResults();
  }

  filterResults() {
    const query = this.searchQuery.toLowerCase();

    this.filteredPacientes = this.pacientes.filter(paciente => 
      paciente.Nome.toLowerCase().includes(query) &&
      this.selectedOptions.includes('pacientes')
    );

    this.filteredMedicos = this.medicos.filter(medico => 
      medico.Nome.toLowerCase().includes(query) &&
      this.selectedOptions.includes('medicos')
    );

    this.filteredEnfermeiros = this.enfermeiros.filter(enfermeiro => 
      enfermeiro.Nome.toLowerCase().includes(query) &&
      this.selectedOptions.includes('enfermeiros')
    );
  }

  toggleSituacao(event: any) {
    const isChecked = event.detail.checked;
    this.selectedSituacao = isChecked ? 'Validado' : 'Bloqueado';

    if (this.selectedEnfermeiro) {
      this.apiService.atualizarEnfermeiro(this.selectedCOREN, this.selectedEnfermeiro, this.selectedEmail, this.selectedSenha, this.selectedSituacao).subscribe(
        response => {
          console.log('Enfermeiro atualizado com sucesso', response);
          this.carregarEnfermeiros();
        },
        error => {
          console.error('Erro ao atualizar enfermeiro:', error);
        }
      );
    } else if (this.selectedMedico) {
      this.apiService.atualizarMedico(this.selectedCRM, this.selectedMedico, this.selectedEsp, this.selectedEmail, this.selectedSenha, this.selectedSituacao).subscribe(
        response => {
          console.log('Medico atualizado com sucesso', response);
          this.carregarMedicos();
        },
        error => {
          console.error('Erro ao atualizar medico:', error);
        }
      );
    } else if (this.selectedPaciente) {
      this.apiService.atualizarPaciente(this.selectedCPF, this.selectedPaciente, this.selectedEmail, this.selectedSenha, this.selectedSituacao).subscribe(
        response => {
          console.log('Paciente atualizado com sucesso', response);
          this.carregarPacientes();
        },
        error => {
          console.error('Erro ao atualizar paciente:', error);
        }
      );
    }
  }

}
