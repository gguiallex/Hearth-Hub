import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ConsultaModalPage } from '../consulta-modal/consulta-modal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marcar-consulta',
  templateUrl: './marcar-consulta.page.html',
  styleUrls: ['./marcar-consulta.page.scss'],
})
export class MarcarConsultaPage implements OnInit {

  especialidades: { Especialidade: string }[] = [];
  selectedEspecialidade: string = '';
  medicos: { CRM: string, Nome: string }[] = [];
  consultas: any[] = []; // Array para armazenar as consultas do médico selecionado
  selectedMedicoId: string = '';
  selectedMedicoNome: string = '';
  selectedDate: string = '';
  selectedTime: string = '';

  minDate: string = '';
  maxDate: string = '';

  timeSlots: { time: string, available: boolean }[] = [];

  constructor(private apiService: ApiService,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {

    const situação = this.authService.getStatus();
    const perfil = this.authService.getProfile();
    if (perfil !== 'P' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }

    this.carregarEspecialidades();
    this.setMinMaxDates();
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  //Data minima e maxima do calendário
  setMinMaxDates() {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = threeMonthsFromNow.toISOString().split('T')[0];
  }

  // Finais de semana e horários de consulta inativos
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    // Verifica se é final de semana
    if (utcDay === 0 || utcDay === 6) {
      return false; // Bloqueia sábado e domingo
    }

    // Verifica se a data está presente nas consultas do médico
    const selectedISODate = date.toISOString().split('T')[0];
    const selectedTime = date.toTimeString().split(' ')[0].substring(0, 5); // HH:mm format
    return !this.consultas.some(consulta => consulta.data === selectedISODate && consulta.hora === selectedTime);
  };

  //seleciona Medico
  onMedicoChange(event: any) {
    const selectedMedico = this.medicos.find(medico => medico.CRM === event.detail.value);
    if (selectedMedico) {
      this.selectedMedicoNome = selectedMedico.Nome; // Armazena o nome do médico selecionado
    }
    this.selectedMedicoId = event.detail.value;
    console.log(this.selectedMedicoId);
    console.log(this.selectedMedicoNome);
    this.buscarConsultasDoMedico(this.selectedMedicoId);
  }

  //seleciona Data
  onDateChange(event: any) {
    this.selectedDate = new Date(event.detail.value).toISOString().split('T')[0];
    console.log(this.selectedDate);
    this.generateTimeSlots();
    this.updateAvailableTimeSlots();
  }

  updateAvailableTimeSlots() {
    const consultasFiltradas = this.filtrarConsultasPorData(this.selectedDate);
    console.log("Consultas filtradas para a data selecionada:", consultasFiltradas);

    // Atualiza a disponibilidade dos horários
    this.timeSlots.forEach(slot => {
      const horarioConsulta = consultasFiltradas.some(consulta => {
        const consultaTime = consulta.Horario.substring(0, 5); // HH:MM format
        return consultaTime === slot.time;
      });
      slot.available = !horarioConsulta; // Marque como indisponível se houver uma consulta no horário
    });
    console.log("Horários disponíveis após atualização:", this.timeSlots);
}

  //gera os horarios de atendimento
  generateTimeSlots() {
    this.timeSlots = [];

    // Criação dos horários de 30 em 30 minutos
    for (let hour = 8; hour < 18; hour++) {
      this.timeSlots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: true });
      this.timeSlots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: true });
    }
    
    this.updateAvailableTimeSlots(); // Atualizar a disponibilidade
}

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

  buscarMedicosPorEspecialidade() {
    if (this.selectedEspecialidade) {
      this.apiService.getMedicosPorEspecialidade(this.selectedEspecialidade).subscribe(
        medicos => {
          if (medicos.length > 0) {
            this.medicos = medicos;
          } else {
            this.mostrarAlerta('Nenhum médico encontrado', 'Infelizmente ainda não há médicos com essa especialidade.');
            this.medicos = [];
          }
        },
        error => {
          console.error('Erro ao buscar médicos por especialidade:', error);
        }
      );
    }
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  limparSelecoes() {
    this.selectedEspecialidade = '';
    this.medicos = [];
    this.selectedDate = '';
    this.selectedTime = '';
    this.timeSlots = [];
  }

  async marcarConsulta() {

    if (!this.selectedEspecialidade) {
      this.mostrarAlerta('Seleção inválida', 'Selecione a especialidade em que deseja consultar.');
      return;
    }

    if (!this.selectedMedicoId || this.medicos.length === 0) {
      this.mostrarAlerta('Seleção inválida', 'Selecione um médico para marcar a consulta.');
      return;
    }

    if (!this.selectedDate) {
      this.mostrarAlerta('Seleção inválida', 'Selecione a data em que deseja ser feita a consulta.');
      return;
    }

    if (!this.selectedTime) {
      this.mostrarAlerta('Seleção inválida', 'Selecione um horário para a consulta ser feita.');
      return;
    }

    const cpf = this.authService.getCpf();
    const nome = this.authService.getNome();

    if (!cpf) {
      this.mostrarAlerta('Erro', 'Não foi possível obter o CPF do usuário.');
      return;
    }

    if (!nome) {
      this.mostrarAlerta('Erro', 'Não foi possível obter o nome do usuário.');
      return;
    }

    // Crie um objeto com os detalhes da consulta
    const consulta = {
      paciente: cpf,
      nomePaciente: nome,
      especialidade: this.selectedEspecialidade,
      nomeMedico: this.selectedMedicoNome,
      medico: this.selectedMedicoId,// Encontre o nome do médico com base no ID selecionado
      dia: this.selectedDate, // Aqui você pode definir a data da consulta
      horario: this.selectedTime // Aqui você pode definir o horário da consulta
    };

    // Crie o modal com os detalhes da consulta
    const modal = await this.modalController.create({
      component: ConsultaModalPage,
      componentProps: {
        consulta: consulta // Passe os detalhes da consulta como parâmetro
      }
    });

    await modal.present();
  }

  // Função para buscar consultas do médico selecionado
  buscarConsultasDoMedico(medicoCRM: string) {
    if (!medicoCRM) return;

    this.apiService.getConsultasDoMedico(medicoCRM).subscribe(
      consultas => {
        this.consultas = consultas;
        console.log("Consultas carregadas para o médico selecionado:", consultas);
        this.updateAvailableTimeSlots(); // Atualizar imediatamente após carregar as consultas
      },
      error => {
        console.error('Erro ao buscar consultas do médico:', error);
      }
    );
}

  filtrarConsultasPorData(data: string) {
    const consultasFiltradas = this.consultas.filter(consulta => {
      const consultaDate = new Date(consulta.data).toISOString().split('T')[0];
      return consultaDate === data;
    });
    console.log(consultasFiltradas);
    return consultasFiltradas;
  }

}

