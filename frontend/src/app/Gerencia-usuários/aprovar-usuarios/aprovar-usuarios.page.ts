import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SuspensoService } from 'src/app/services/suspenso.service';
import { IonModal, IonAlert, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-aprovar-usuarios',
  templateUrl: './aprovar-usuarios.page.html',
  styleUrls: ['./aprovar-usuarios.page.scss'],
})
export class AprovarUsuariosPage implements OnInit {
  medicos: any[] = [];
  enfermeiros: any[] = [];
  administradores: any[] = [];
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

  @ViewChild('detailModal') detailModal!: IonModal;
  @ViewChild('apagarAlert') apagarAlert!: IonAlert;
  @ViewChild('aprovarAlert') aprovarAlert!: IonAlert;

  constructor(private apiService: ApiService,
    private authService: AuthService,
    private suspensoService: SuspensoService,
    private router: Router,
    private toastController: ToastController) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'A' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }

    this.carregarMedicos();
    this.carregarEnfermeiros();
    this.carregarAdministradores();
  }

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

  async exibirToast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1000, // duração em milissegundos
      position: 'bottom' // posição do toast
    });
    toast.present();
  }

  filterSuspendedUsers(users: any[]): any[] {
    return users.filter(user => user.Situação === 'Suspenso');
  }

  /*updateTotalSuspensos() {
    const totalSuspensos = this.medicos.length + this.enfermeiros.length + this.administradores.length;
    this.suspensoService.updateSuspensoCount(totalSuspensos);
  }*/

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

  showEnfermeiroDetails(enfermeiro: any) {

    this.atualizarInformaçõesEnfermeiro(enfermeiro);

    this.detailModal.present();
  }

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

  showMedicoDetails(medico: any) {
    this.atualizarInformaçõesMedico(medico);

    this.detailModal.present();
  }

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

  showADMDetails(administrador: any) {
    this.atualizarInformaçõesADM(administrador);

    this.detailModal.present();
  }

  aprovarUsuario(usuario: any, tipo: string) {
    this.selectedUsuario = usuario;
    this.tipoUsuario = tipo;
    console.log(this.tipoUsuario, this.selectedUsuario);
    this.aprovarAlert.present();
  }

  apagarUsuario(usuario: any, tipo: string) {
    this.selectedUsuario = usuario;
    this.tipoUsuario = tipo;
    console.log(this.tipoUsuario, this.selectedUsuario);
    this.apagarAlert.present();
  }

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
