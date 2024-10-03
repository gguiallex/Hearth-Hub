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
  @Input() consulta: any; // Recebe os detalhes da consulta como entrada
  @Output() consultaMarcada = new EventEmitter();

  constructor(private modalController: ModalController, 
              private apiService: ApiService, 
              private alertService: AlertService,
              private router: Router
              ) { }

  ngOnInit() {
    if (this.consulta) {
      console.log('Detalhes da consulta recebidos:', this.consulta);
    } else {
      console.error('Nenhuma consulta fornecida ao modal.');
    }
  }

  fecharModal() {
    this.modalController.dismiss();
  }

  confirmarConsulta() {
    // Verifica se todos os parâmetros necessários estão definidos
    if (!this.consulta || !this.consulta.paciente || !this.consulta.medico || !this.consulta.dia || !this.consulta.horario) {
      console.error('Dados da consulta incompletos:', this.consulta);
      // Exibe uma mensagem de erro para o usuário, se desejar
      return;
    }
 
    const consultaa = {
      CPF: this.consulta.paciente,
      CRM: this.consulta.medico,
      data: this.consulta.dia,
      Horario: this.consulta.horario
    }
  
    this.apiService.marcarConsulta(consultaa).subscribe(
      async (response) => {
        // Se a consulta foi marcada com sucesso, exibe uma mensagem de sucesso e fecha o modal
         await this.alertService.showAlert('Consulta marcada com sucesso!')
        console.log('Consulta marcada com sucesso:', response);

        this.consultaMarcada.emit(true);

        this.fecharModal();

        this.router.navigate(['/paciente']).then(() => {
          location.reload();  // Recarregar a página após o agendamento e redirecionamento
        });
      },
      async (error) => {
        // Se ocorreu algum erro ao marcar a consulta, exibe uma mensagem de erro
        await this.alertService.showAlert('Erro ao marcar consulta')
        console.error('Erro ao marcar consulta:', error);
        // Aqui você pode exibir uma mensagem de erro para o usuário, se desejar
      }
    );
  }
}
