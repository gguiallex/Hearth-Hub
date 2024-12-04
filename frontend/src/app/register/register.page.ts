import { AlertService } from './../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  // Variáveis para manipulação de registros e exibição
  showOptions: boolean = false;
  selectedOption: string = '';
  medicos: {CRM: string, Email: string}[] = [];
  enfermeiros: {COREN:string, Email: string}[]=[];
  pacientes: {CPF:string, Email: string}[]=[];
  administradores: {CPF:string, Email: string}[]=[];

  // Variáveis de input para o formulário
  crm: string = '';
  nome: string ='';
  email: string = '';
  senha: string = '';
  especialidades: { Especialidade: string }[] = [];
  selectedEsp: string = "";
  confSenha: string = '';
  coren: string = '';
  cpf: string = '';

  constructor(private apiService: ApiService, 
              private alertService: AlertService, 
              private router:Router,
              private loadingController: LoadingController) {}
  
  ngOnInit() {
    // Carrega as especialidades ao inicializar a página
    this.carregarEspecialidades();
  }

  // Carrega especialidades disponíveis
  carregarEspecialidades() {
    this.apiService.getEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades;
      },
      error => {
        console.error('Erro ao carregar especialidades:', error);
      }
    );
  }

  // Alterna a exibição das opções
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  // Define a opção selecionada
  selectOption(event: any) {
    this.selectedOption = event.detail.value;
    this.showOptions = false;
    console.log('Opção selecionada:', this.selectedOption);
  }

  // Registra o usuário
  async register() {

    const loading = await this.loadingController.create({
      message: 'Registrando...',
    });
    await loading.present();

    try {

      this.formatarCPF();

      if (!this.selectOption) {
        await this.alertService.showAlert('Escolha um tipo de usuário');
        return;
      }

      if (this.senha != this.confSenha) {
        await this.alertService.showAlert('Suas senhas devem ser iguais');
        console.log('Suas senhas devem ser iguais');
        return;
      }

    // Verifica se o e-mail e o identificador já está registrado na tabela correspondente
    let emailExiste = false;
    let chaveExiste = false;

    switch (this.selectedOption) {
      case 'Médico':
        const medicos = await this.apiService.getMedicos().toPromise();
        if (medicos) {
          emailExiste = medicos.some((medico: any) => medico.Email === this.email);
          chaveExiste = medicos.some((medico: any) => medico.CRM === this.crm);
        }
        break;
      case 'Enfermeiro(a)':
        const enfermeiros = await this.apiService.getEnfermeiros().toPromise();
        if (enfermeiros) {
          emailExiste = enfermeiros.some((enfermeiro: any) => enfermeiro.Email === this.email);
          chaveExiste = enfermeiros.some((enfermeiro: any) => enfermeiro.COREN === this.coren);
        }
        break;
      case 'Paciente':
        const pacientes = await this.apiService.getPacientes().toPromise();
        if (pacientes) {
          emailExiste = pacientes.some((paciente: any) => paciente.Email === this.email);
          chaveExiste = pacientes.some((paciente: any) => paciente.CPF === this.cpf);

        }
        break;
      case 'Administrador':
        const administradores = await this.apiService.getAdministradores().toPromise();
        if (administradores) {
          emailExiste = administradores.some((administrador: any) => administrador.Email === this.email);
          chaveExiste = administradores.some((administrador: any) => administrador.CPF === this.cpf);
        }
        break;
      default:
        await this.alertService.showAlert('Escolha um tipo de usuário');
        await loading.dismiss();
        return;
    }

    // Alerta se o e-mail já está em uso
    if (emailExiste) {
      await this.alertService.showAlert('Este e-mail já está registrado.');
      await loading.dismiss();
      return;
    }

    // Alerta se o identificador já está em uso
      if (chaveExiste) {
        switch (this.selectedOption) {
          case 'Médico':
            await this.alertService.showAlert('Este CRM já está registrado.');
            break;
          case 'Enfermeiro(a)':
            await this.alertService.showAlert('Este COREN já está registrado.');
            break;
          case 'Paciente':
          case 'Administrador':
            await this.alertService.showAlert('Este CPF já está registrado.');
            break;
        }
        await loading.dismiss();
        return;
      }

      // Chamada para criar o usuário correspondente
      let response;
      switch (this.selectedOption) {
        case 'Médico':
          response = await this.apiService.criarMedico(this.crm, this.nome, this.selectedEsp, this.email, this.senha).toPromise();
          break;
        case 'Enfermeiro(a)':
          response = await this.apiService.criarEnfermeiro(this.coren, this.nome, this.email, this.senha).toPromise();
          break;
        case 'Paciente':
          response = await this.apiService.criarPaciente(this.cpf, this.nome, this.email, this.senha).toPromise();
          await this.apiService.solicitarConfirmaçãoDeConta(this.email).toPromise();
          break;
        case 'Administrador':
          response = await this.apiService.criarAdministrador(this.cpf, this.nome, this.email, this.senha).toPromise();
          break;
        default:
          await this.alertService.showAlert('Escolha um tipo de usuário');
          await loading.dismiss();
          return;
      }

    console.log(`${this.selectedOption} registrado com sucesso!`, response);
    await this.alertService.showAlert(`${this.selectedOption} registrado com sucesso. Você será redirecionado à tela de login.`);
    this.router.navigate(['/login']);
  } catch (error) {
    console.error(`Erro ao registrar ${this.selectedOption}:`, error);
    await this.alertService.showAlert('Não foi possível criar seu perfil, verifique se suas credenciais estão corretas e tente novamente em alguns instantes.');
  } finally {
    await loading.dismiss();
  }
  }

  // Formata o CPF com máscara
  formatarCPF() {
    this.cpf = this.cpf.replace(/\D/g, '');
    this.cpf = this.cpf.replace(/(\d{3})(\d)/, '$1.$2');
    this.cpf = this.cpf.replace(/(\d{3})(\d)/, '$1.$2');
    this.cpf = this.cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
}

