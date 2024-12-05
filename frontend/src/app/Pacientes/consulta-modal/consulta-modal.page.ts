import { ApiService } from '../../services/api.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consulta-modal',
  templateUrl: './consulta-modal.page.html',
  styleUrls: ['./consulta-modal.page.scss'],
})
export class ConsultaModalPage implements OnInit {

  // Decoradores que recebem e emitem dados no modal
  @Input() consulta: any; // Recebe os detalhes da consulta como entrada
  @Output() consultaMarcada = new EventEmitter(); // Emite evento quando a consulta for marcada

  constructor(private modalController: ModalController, 
              private apiService: ApiService, 
              private alertService: AlertService,
              private router: Router
              ) { }

  ngOnInit() {
    // Verifica se os detalhes da consulta foram recebidos ao inicializar o modal
    if (this.consulta) {
      console.log('Detalhes da consulta recebidos:', this.consulta);
    } else {
      console.error('Nenhuma consulta fornecida ao modal.');
    }
  }

  // Fecha o modal
  fecharModal() {
    this.modalController.dismiss();
  }

  // Confirma a marcação da consulta
  confirmarConsulta() {
    // Verifica se todos os parâmetros necessários estão definidos
    if (!this.consulta || !this.consulta.paciente || !this.consulta.medico || !this.consulta.dia || !this.consulta.horario) {
      console.error('Dados da consulta incompletos:', this.consulta);
      return;
    }
 
    // Estrutura a consulta com os dados necessários
    const consultaa = {
      CPF: this.consulta.paciente,
      CRM: this.consulta.medico,
      data: this.consulta.dia,
      Horario: this.consulta.horario
    }
  
    // Envia a consulta para a API
    this.apiService.marcarConsulta(consultaa).subscribe(
      async (response) => {
        // Exibe mensagem de sucesso ao usuário e fecha o modal
         await this.alertService.showAlert('Consulta marcada com sucesso!')
        console.log('Consulta marcada com sucesso:', response);

        this.consultaMarcada.emit(true); // Emite o evento de consulta marcada para o componente pai

        this.fecharModal(); // Fecha o modal

        // Redireciona para a página do paciente e recarrega a página
        this.router.navigate(['/paciente']).then(() => {
          location.reload();
        });
      },
      async (error) => {
        // Se ocorreu algum erro ao marcar a consulta, exibe uma mensagem de erro
        await this.alertService.showAlert('Erro ao marcar consulta')
        console.error('Erro ao marcar consulta:', error);
      }
    );
  }
}
