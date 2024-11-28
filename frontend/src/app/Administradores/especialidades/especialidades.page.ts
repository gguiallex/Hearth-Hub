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

  // Variáveis de classe para armazenar os dados da especialidade
  Especialidade = "";
  CodEsp = "";
  desc = "";
  especialidades: { Especialidade: string, CodEsp: string, desc: string }[] = [];
  filteredEspecialidades: { Especialidade: string, CodEsp: string, desc: string }[] = [];
  selectedEsp = "";
  selectedCodEsp = "";
  selectedDesc = "";
  Descrição = "";
  editMode: boolean = false; // Referência ao modal de detalhes

  @ViewChild('modal') modal!: IonModal; // Referência ao modal de criação
  @ViewChild('detailModal') detailModal!: IonModal; // Referência ao modal de detalhes

  constructor(private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private apiService: ApiService) { }

  ngOnInit() {
    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    // Verifica o perfil e situação do usuário para redirecionamento
    if (perfil !== 'A' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }

    this.carregarEspecialidades(); // Carrega a lista de especialidades ao iniciar a página
  }

  // Função para filtrar especialidades com base na entrada do usuário
  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredEspecialidades = this.especialidades.filter((especialidade) =>
      especialidade.Especialidade.toLowerCase().includes(query)
    );
  }

  // Carrega especialidades da API e ordena por nome
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

  // Cria uma nova especialidade
  async criarEsp() {

    this.Descrição = this.desc;

    // Verifica se todos os campos obrigatórios estão preenchidos
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
    // Tenta criar a especialidade via API
    try {
      const response = await this.apiService.criarEspecialidade(this.CodEsp, this.Especialidade, this.Descrição).toPromise();
      await this.alertService.showAlert('Especialidade criada com sucesso!');
      this.carregarEspecialidades();
      this.modal.dismiss(); // Fecha o modal após a criação
      this.limparCampo();
    } catch (error) {
      console.error('erro ao registrar especialidade: ', error);
      await this.alertService.showAlert('Não foi possível criar uma nova especialidade, verifique se os campos estão corretos e tente novamente em alguns instantes.');
    }
  }

  // Mostra os detalhes de uma especialidade em um modal
  showEspecialidadeDetails(especialidade: any) {
    // Atribuir os valores da especialidade clicada às variáveis para exibir no modal de detalhes
    this.selectedCodEsp = especialidade.CodEsp;
    this.selectedEsp = especialidade.Especialidade;
    this.selectedDesc = especialidade.Descrição;

    this.detailModal.present(); // Abrir o modal de detalhes
  }

  // Atualiza uma especialidade existente
  async updateEspecialidade() {
    try {
      const response = await this.apiService.atualizarEspecialidade(this.selectedCodEsp, this.selectedEsp, this.selectedDesc).toPromise();
      console.log('Especialidade atualizada com sucesso!', response);
      await this.alertService.showAlert('Especialidade atualizada com sucesso!');
      this.carregarEspecialidades();
      this.editMode = false; // Sai do modo de edição
    } catch (error) {
      console.error('Erro ao atualizar especialidade:', error);
      await this.alertService.showAlert('Não foi possível atualizar a especialidade, verifique os campos e tente novamente.');
    }
  }

  // Ativa o modo de edição para uma especialidade
  editEspecialidade() {
    this.editMode = true;
  }

  // Cancela a edição de uma especialidade
  cancelEspecialidade() {
    this.editMode = false;
  }

  // Exclui uma especialidade
  async deleteEspecialidade() {
    try {
      const response = await this.apiService.excluirEspecialidade(this.selectedCodEsp).toPromise();
      console.log('Especialidade excluída com sucesso!', response);
      await this.alertService.showAlert('Especialidade excluída com sucesso!');
      this.carregarEspecialidades();
      this.detailModal.dismiss(); // Fecha o modal após a exclusão
    } catch (error) {
      console.error('Erro ao excluir especialidade:', error);
      await this.alertService.showAlert('Não foi possível excluir a especialidade, tente novamente.');
    }
  }

  // Limpa os campos da criação das especialidades
  limparCampo() {
    this.Especialidade = '';
    this.CodEsp = '';
    this.desc = '';
  }

}
