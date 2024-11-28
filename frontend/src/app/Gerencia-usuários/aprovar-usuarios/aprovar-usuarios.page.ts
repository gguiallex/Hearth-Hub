import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonModal, IonAlert, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-aprovar-usuarios',
  templateUrl: './aprovar-usuarios.page.html',
  styleUrls: ['./aprovar-usuarios.page.scss'],
})
export class AprovarUsuariosPage implements OnInit {
  medicos: any[] = []; // Lista de médicos
  enfermeiros: any[] = []; // Lista de enfermeiros
  administradores: any[] = []; // Lista de administradores

  // Variáveis para armazenar detalhes do usuário selecionado
  selectedAdmin = "";
  selectedEnfermeiro = "";
  selectedMedico = "";
  selectedCOREN = "";
  selectedCRM = "";
  selectedCPF = "";
  selectedSituacao = "";
  selectedEsp = "";
  selectedEmail = "";
  selectedSenha = "";
  selectedUsuario = "";
  tipoUsuario = "";

  // Referências para os modais e alertas
  @ViewChild('detailModal') detailModal!: IonModal;
  @ViewChild('apagarAlert') apagarAlert!: IonAlert;
  @ViewChild('aprovarAlert') aprovarAlert!: IonAlert;

  constructor(private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    // Verifica se o usuário tem o perfil e status adequados, caso contrário, redireciona para a página de login
    if (perfil !== 'A' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }

    // Carrega as listas de médicos, enfermeiros e administradores
    this.carregarMedicos();
    this.carregarEnfermeiros();
    this.carregarAdministradores();
  }

  // Botões para o alerta de exclusão
  public deleteButtons = [
    {
      text: 'Cancelar',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Apagar',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.confirmarApagarUsuario();
      }
    },
  ];

  // Botões para o alerta de aprovação
  public aprovarButtons = [
    {
      text: 'Cancelar',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Aprovar',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.confirmarAprovarUsuario();
      }
    },
  ];

  // Função para exibir um toast com uma mensagem específica
  async exibirToast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1000, // duração em milissegundos
      position: 'bottom' // posição do toast
    });
    toast.present();
  }

  // Filtra usuários suspensos
  filterSuspendedUsers(users: any[]): any[] {
    return users.filter(user => user.Situação === 'Suspenso');
  }

  // Carrega a lista de médicos suspensos
  carregarMedicos() {
    this.apiService.getMedicos().subscribe(
      medicos => {
        this.medicos = this.filterSuspendedUsers(medicos);
        //this.updateTotalSuspensos();
      },
      error => {
        console.error('Erro ao carregar medicos:', error);
      }
    );
  }

  // Carrega a lista de enfermeiros suspensos
  carregarEnfermeiros() {
    this.apiService.getEnfermeiros().subscribe(
      enfermeiros => {
        this.enfermeiros = this.filterSuspendedUsers(enfermeiros);
        //this.updateTotalSuspensos();
      },
      error => {
        console.error('Erro ao carregar enfermeiros:', error);
      }
    );
  }

  // Carrega a lista de administradores suspensos
  carregarAdministradores() {
    this.apiService.getAdministradores().subscribe(
      administradores => {
        this.administradores = this.filterSuspendedUsers(administradores);
        //this.updateTotalSuspensos();
      },
      error => {
        console.error('Erro ao carregar administradores:', error);
      }
    );
  }

  // Atualiza as informações do enfermeiro selecionado
  atualizarInformaçõesEnfermeiro(enfermeiro: any) {
    this.selectedAdmin = '';
    this.selectedCPF = '';
    this.selectedMedico = '';
    this.selectedCRM = '';
    this.selectedEsp = '';

    this.selectedEnfermeiro = enfermeiro.Nome;
    this.selectedCOREN = enfermeiro.COREN;
    this.selectedEmail = enfermeiro.Email;
    this.selectedSenha = enfermeiro.Senha;
    this.selectedSituacao = enfermeiro.Situação;
  }

  // Exibe os detalhes do enfermeiro selecionado em um modal
  showEnfermeiroDetails(enfermeiro: any) {

    this.atualizarInformaçõesEnfermeiro(enfermeiro);

    this.detailModal.present();
  }

  // Atualiza as informações do médico selecionado
  atualizarInformaçõesMedico(medico: any) {
    this.selectedAdmin = '';
    this.selectedCPF = '';
    this.selectedEnfermeiro = '';
    this.selectedCOREN = '';

    this.selectedMedico = medico.Nome;
    this.selectedCRM = medico.CRM;
    this.selectedEsp = medico.Especialidade;
    this.selectedEmail = medico.Email;
    this.selectedSenha = medico.Senha;
    this.selectedSituacao = medico.Situação;
  }

  // Exibe os detalhes do médico selecionado em um modal
  showMedicoDetails(medico: any) {
    this.atualizarInformaçõesMedico(medico);

    this.detailModal.present();
  }

  // Atualiza as informações do administrador selecionado
  atualizarInformaçõesADM(administrador: any) {

    this.selectedMedico = '';
    this.selectedCRM = '';
    this.selectedEsp = '';
    this.selectedEnfermeiro = '';
    this.selectedCOREN = '';

    this.selectedAdmin = administrador.Nome;
    this.selectedCPF = administrador.CPF;
    this.selectedEmail = administrador.Email;
    this.selectedSenha = administrador.Senha;
    this.selectedSituacao = administrador.Situação;
  }

  // Exibe os detalhes do administrador selecionado em um modal
  showADMDetails(administrador: any) {
    this.atualizarInformaçõesADM(administrador);

    this.detailModal.present();
  }

  // Prepara a aprovação de um usuário
  aprovarUsuario(usuario: any, tipo: string) {
    this.selectedUsuario = usuario;
    this.tipoUsuario = tipo;
    console.log(this.tipoUsuario, this.selectedUsuario);
    this.aprovarAlert.present();
  }

  // Prepara a exclusão de um usuário
  apagarUsuario(usuario: any, tipo: string) {
    this.selectedUsuario = usuario;
    this.tipoUsuario = tipo;
    console.log(this.tipoUsuario, this.selectedUsuario);
    this.apagarAlert.present();
  }

  // Confirma a aprovação de um usuário
  confirmarAprovarUsuario() {
    const usuario = this.selectedUsuario;

    if (this.tipoUsuario === 'enfermeiro') {
      this.atualizarInformaçõesEnfermeiro(usuario);
      this.selectedSituacao = 'Validado';
      this.apiService.atualizarEnfermeiro(this.selectedCOREN, this.selectedEnfermeiro, this.selectedEmail, this.selectedSenha, this.selectedSituacao).subscribe(
        response => {
          this.apiService.enviarEmailAprovação(this.selectedEmail, this.selectedEnfermeiro).subscribe(
            response => {
              console.log('Email de aprovação enviado com sucesso', response);
              this.exibirToast('Enfermeiro aprovado com sucesso');
              this.carregarEnfermeiros();
            },
            error => {
              console.error('Erro ao enviar email de aprovação:', error);
            }
          );
        },
        error => {
          console.error('Erro ao atualizar enfermeiro:', error);
        }
      );
    } else if (this.tipoUsuario === 'medico') {
      this.atualizarInformaçõesMedico(usuario);
      this.selectedSituacao = 'Validado';
      this.apiService.atualizarMedico(this.selectedCRM, this.selectedMedico, this.selectedEsp, this.selectedEmail, this.selectedSenha, this.selectedSituacao).subscribe(
        response => {
          this.apiService.enviarEmailAprovação(this.selectedEmail, this.selectedMedico).subscribe(
            response => {
              console.log('Email de aprovação enviado com sucesso', response);
              this.exibirToast('Medico aprovado com sucesso');
              this.carregarMedicos();
            },
            error => {
              console.error('Erro ao enviar email de aprovação:', error);
            }
          );
        },
        error => {
          console.error('Erro ao atualizar medico:', error);
        }
      );
    } else if (this.tipoUsuario === 'admin') {
      this.atualizarInformaçõesADM(usuario);
      this.selectedSituacao = 'Validado';
      this.apiService.atualizarADM(this.selectedCPF, this.selectedAdmin, this.selectedEmail, this.selectedSenha, this.selectedSituacao).subscribe(
        response => {
          this.apiService.enviarEmailAprovação(this.selectedEmail, this.selectedAdmin).subscribe(
            response => {
              console.log('Email de aprovação enviado com sucesso', response);
              this.exibirToast('Administrador aprovado com sucesso');
              this.carregarAdministradores();
            },
            error => {
              console.error('Erro ao enviar email de aprovação:', error);
            }
          );
        },
        error => {
          console.error('Erro ao atualizar administradores:', error);
        }
      );
    }
  }

  // Confirma a exclusão de um usuário
  confirmarApagarUsuario() {
    const usuario = this.selectedUsuario;

    if (this.tipoUsuario === 'enfermeiro') {
      this.atualizarInformaçõesEnfermeiro(usuario);
      this.apiService.excluirEnfermeiro(this.selectedCOREN).subscribe(
        response => {
          console.log('Enfermeiro deletado com sucesso', response);
          this.exibirToast('Enfermeiro deletado com sucesso');
          this.carregarEnfermeiros();
        },
        error => {
          console.error('Erro ao deletar enfermeiro:', error);
        }
      );
    } else if (this.tipoUsuario === 'medico') {
      this.atualizarInformaçõesMedico(usuario);
      this.apiService.excluirMedico(this.selectedCRM).subscribe(
        response => {
          console.log('Medico deletado com sucesso', response);
          this.exibirToast('Medico deletado com sucesso');
          this.carregarMedicos();
        },
        error => {
          console.error('Erro ao deletar medico:', error);
        }
      );
    } else if (this.tipoUsuario === 'admin') {
      this.atualizarInformaçõesADM(usuario);
      this.apiService.excluirADM(this.selectedEmail).subscribe(
        response => {
          console.log('Administrador deletado com sucesso', response);
          this.exibirToast('Administrador deletado com sucesso');
          this.carregarAdministradores();
        },
        error => {
          console.error('Erro ao deletar administrador:', error);
        }
      );
    }
  }
}
