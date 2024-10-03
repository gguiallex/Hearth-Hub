import { AlertService } from '.././../services/alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.page.html',
  styleUrls: ['./especialidades.page.scss'],
})
export class EspecialidadesPage implements OnInit {

  Especialidade = "";
  CodEsp = "";
  desc = "";
  especialidades: { Especialidade: string, CodEsp: string, desc: string }[] = [];
  filteredEspecialidades: { Especialidade: string, CodEsp: string, desc: string }[] = [];
  selectedEsp = "";
  selectedCodEsp = "";
  selectedDesc= "";
  Descrição = "";
  editMode: boolean = false;

  @ViewChild('modal') modal!: IonModal;
  @ViewChild('detailModal') detailModal!: IonModal;

  constructor(private authService: AuthService,
              private router: Router,
              private alertService: AlertService,
              private apiService: ApiService) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'A' && situação !== 'Validado') {
    this.router.navigate(['/login']);
    }

    this.carregarEspecialidades(); 
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredEspecialidades = this.especialidades.filter((especialidade) => 
      especialidade.Especialidade.toLowerCase().includes(query)
    );
  }

  carregarEspecialidades() {
    this.apiService.getEspecialidades().subscribe(
      especialidades => {
        especialidades.sort((a, b) => a.Especialidade.localeCompare(b.Especialidade));
        this.especialidades = especialidades;
        this.filteredEspecialidades = especialidades;
      },
      error => {
        console.error('Erro ao carregar especialidades:', error);
      }
    );
  }

  async criarEsp(){

    this.Descrição = this.desc;

    if (!this.Especialidade || !this.CodEsp || !this.Descrição) {
      await this.alertService.showAlert('Preencha todos os campos para poder criar uma nova especialidade')
      return;
    }

// Verifica se já existe uma especialidade com o mesmo código
const codEspExistente = this.especialidades.find(especialidade => especialidade.CodEsp && especialidade.CodEsp.toLowerCase() === this.CodEsp.toLowerCase());
if (codEspExistente) {
  await this.alertService.showAlert('Já existe uma especialidade com esse código. Por favor, escolha outro código.');
  return;
}

// Verifica se já existe uma especialidade com o mesmo nome
const espExistente = this.especialidades.find(especialidade => especialidade.Especialidade && especialidade.Especialidade.toLowerCase() === this.Especialidade.toLowerCase());
if (espExistente) {
  await this.alertService.showAlert('Já existe uma especialidade com esse nome. Por favor, escolha outro nome.');
  return;
}

    try {
      const response = await this.apiService.criarEspecialidade(this.CodEsp, this.Especialidade, this.Descrição).toPromise();
      console.log('Especialidade criada com sucesso!', response);
      await this.alertService.showAlert('Especialidade criada com sucesso!');
      console.log('Chamando carregarEspecialidades...');
      this.carregarEspecialidades();
      console.log('carregarEspecialidades chamado com sucesso');
  
      console.log('Tentando fechar o modal...');
      this.modal.dismiss();
      console.log('Modal fechado com sucesso');
    } catch (error) {
      console.error('erro ao registrar especialidade: ', error);
      await this.alertService.showAlert('Não foi possível criar uma nova especialidade, verifique se os campos estão corretos e tente novamente em alguns instantes.');
    }
  }

showEspecialidadeDetails(especialidade: any) {
  // Atribuir os valores da especialidade clicada às variáveis para exibir no modal de detalhes
  this.selectedCodEsp = especialidade.CodEsp; // ou como quer que seja a propriedade que representa o código
  this.selectedEsp = especialidade.Especialidade;
  this.selectedDesc = especialidade.Descrição;

  // Abrir o modal de detalhes
  this.detailModal.present();
}

  async updateEspecialidade() {
    try {
      const response = await this.apiService.atualizarEspecialidade(this.selectedCodEsp, this.selectedEsp, this.selectedDesc).toPromise();
      console.log('Especialidade atualizada com sucesso!', response);
      await this.alertService.showAlert('Especialidade atualizada com sucesso!');
      this.carregarEspecialidades();
      this.editMode = false;
    } catch (error) {
      console.error('Erro ao atualizar especialidade:', error);
      await this.alertService.showAlert('Não foi possível atualizar a especialidade, verifique os campos e tente novamente.');
    }
  }

  editEspecialidade() {
    // Ativa o modo de edição
    this.editMode = true;
  }

  cancelEspecialidade() {
    // desativa o modo de edição
    this.editMode = false;
  }

  async deleteEspecialidade() {
    try {
      const response = await this.apiService.excluirEspecialidade(this.selectedCodEsp).toPromise();
      console.log('Especialidade excluída com sucesso!', response);
      await this.alertService.showAlert('Especialidade excluída com sucesso!');
      this.carregarEspecialidades();
      this.detailModal.dismiss();
    } catch (error) {
      console.error('Erro ao excluir especialidade:', error);
      await this.alertService.showAlert('Não foi possível excluir a especialidade, tente novamente.');
    }
  }

}
