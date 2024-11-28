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
  // Query de busca e opções selecionadas para filtragem
  searchQuery: string = '';
  selectedOptions: string[] = ['pacientes', 'medicos', 'enfermeiros'];

  // Variáveis para armazenar informações do usuário selecionado
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

  // Arrays para armazenar os dados dos usuários e suas versões filtradas
  pacientes: any[] = [];
  enfermeiros: any[] = [];
  medicos: any[] = [];
  filteredPacientes: any[] = [];
  filteredMedicos: any[] = [];
  filteredEnfermeiros: any[] = [];

  // Referência para o modal de detalhes
  @ViewChild('detailModal') detailModal!: IonModal;

  constructor(private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    // Verifica o perfil e status do usuário, redirecionando para login se necessário
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'A' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }

    // Carrega os dados dos usuários
    this.carregarPacientes();
    this.carregarMedicos();
    this.carregarEnfermeiros();
  }

  // Carrega a lista de pacientes
  carregarPacientes() {
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

  // Carrega a lista de médicos
  carregarMedicos() {
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

  // Carrega a lista de enfermeiros
  carregarEnfermeiros() {
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

  // Exibe os detalhes do enfermeiro selecionado em um modal
  showEnfermeiroDetails(enfermeiro: any) {
    this.resetarFiltros();

    this.selectedEnfermeiro = enfermeiro.Nome;
    this.selectedCOREN = enfermeiro.COREN;
    this.selectedEmail = enfermeiro.Email;
    this.selectedSenha = enfermeiro.Senha;
    this.selectedSituacao = enfermeiro.Situação;

    this.detailModal.present();
  }

  // Exibe os detalhes do médico selecionado em um modal
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

  // Exibe os detalhes do paciente selecionado em um modal
  showPacienteDetails(paciente: any) {
    this.resetarFiltros();

    this.selectedPaciente = paciente.Nome;
    this.selectedCPF = paciente.CPF;
    this.selectedEmail = paciente.Email;
    this.selectedSenha = paciente.Senha;
    this.selectedSituacao = paciente.Situação;

    this.detailModal.present();
  }

  // Reseta as variáveis de detalhes do usuário selecionado
  resetarFiltros() {
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

  // Atualiza a seleção de usuários filtrados com base nas opções selecionadas
  updateSelection() {
    this.filteredPacientes = this.selectedOptions.includes('pacientes') ? this.pacientes : [];
    this.filteredMedicos = this.selectedOptions.includes('medicos') ? this.medicos : [];
    this.filteredEnfermeiros = this.selectedOptions.includes('enfermeiros') ? this.enfermeiros : [];

    this.filterResults();
  }

  // Filtra os resultados de acordo com a query de busca
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

  // Atualiza a situação (Validado/Bloqueado) do usuário selecionado
  toggleSituacao(event: any) {
    const isChecked = event.detail.checked;
    this.selectedSituacao = isChecked ? 'Validado' : 'Bloqueado';

    // Atualiza os dados do enfermeiro
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
      // Atualiza os dados do médico
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
      // Atualiza os dados do paciente
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
