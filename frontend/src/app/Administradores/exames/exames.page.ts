import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { IonModal } from '@ionic/angular/common';

@Component({
  selector: 'app-exames',
  templateUrl: './exames.page.html',
  styleUrls: ['./exames.page.scss'],
})
export class ExamesPage implements OnInit {
  Nome = '';
  exame: { CodExames: string, Nome: string, Desc: string }[] = [];
  filteredExames: { CodExames: string, Nome: string, Desc: string }[] = [];
  selectedNome = '';
  selectedCodigo = '';
  selectedDesc = ''; 
  Desc = '';
  Descrição = '';
  CodExames = '';
  editMode: boolean = false;
  block:boolean = false;

  @ViewChild('modal') modal!: IonModal;
  @ViewChild('detailModal') detailModal!: IonModal;
  constructor(private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'A' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }

    this.carregarExames();
  }

  carregarExames() {
    this.apiService.getExames().subscribe(
      exames => {
        exames.sort((a, b) => a.Nome.localeCompare(b.Nome));
        this.exame = exames;
        this.filteredExames = exames;
      },
      error => {
        console.error('Erro ao carregar especialidades:', error);
      }
    );
  }

  showExamesDetails(exame: any) {
    // Atribuir os valores do exame clicado às variáveis para exibir no modal de detalhes
    this.selectedCodigo = exame.CodExames;
    this.selectedNome = exame.Nome;
    this.selectedDesc = exame.Descrição;

    // Abrir o modal de detalhes
    this.detailModal.present();
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredExames = this.exame.filter((exame) =>
      exame.Nome.toLowerCase().includes(query)
    );
  }

  editExame() {
    // Ativa o modo de edição
    this.editMode = true;
  }

  cancelExame() {
    // desativa o modo de edição
    this.editMode = false;
  }

  async updateExame() {
    try {
      const response = await this.apiService.atualizarExame(this.selectedCodigo, this.selectedNome, this.selectedDesc).toPromise();
      console.log('Exame atualizada com sucesso!', response);
      await this.alertService.showAlert('Exame atualizada com sucesso!');
      this.carregarExames();
      this.editMode = false;
    } catch (error) {
      console.error('Erro ao atualizar exame:', error);
      await this.alertService.showAlert('Não foi possível atualizar o exame, verifique os campos e tente novamente.');
    }
  }

  async deleteExame() {
    try {
      const response = await this.apiService.excluirExame(this.selectedCodigo).toPromise();
      console.log('Exame excluído com sucesso!', response);
      await this.alertService.showAlert('Exame excluído com sucesso!');
      this.carregarExames();
      this.detailModal.dismiss();
    } catch (error) {
      console.error('Erro ao excluir exame:', error);
      await this.alertService.showAlert('Não foi possível excluir o exame, tente novamente.');
    }
  }

  async criarExame(){

    this.Descrição = this.Desc;

    if (!this.Nome || !this.Descrição) {
      await this.alertService.showAlert('Preencha todos os campos para poder criar um novo exame')
      return;
    }

    const exameExistente = this.exame.find(exame => exame.Nome.toLowerCase() === this.Nome.toLowerCase());
    if (exameExistente) {
      await this.alertService.showAlert('Já existe um exame com esse nome. Por favor, escolha outro nome.');
      return;
    }

    console.log(this.Nome);
    console.log(this.Descrição);

    try {
      const response = await this.apiService.criarExame(this.Nome, this.Descrição).toPromise();
      console.log('Exame criado com sucesso!', response);
      await this.alertService.showAlert('Exame criado com sucesso!');

      this.carregarExames();

      this.modal.dismiss();

      this.limparCampo();
    } catch (error) {
      console.error('erro ao criar exame: ', error);
      await this.alertService.showAlert('Não foi possível criar um novo exame, verifique se os campos estão corretos e tente novamente em alguns instantes.');
    }
  }

  limparCampo(){
    this.Nome = '';
    this.Desc = '';
    this.Descrição = '';
  }

}
