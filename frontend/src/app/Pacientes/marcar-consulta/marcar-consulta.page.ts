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

  // Variáveis para armazenar especialidades, médicos e informações da consulta
  especialidades: { Especialidade: string }[] = [];
  selectedEspecialidade: string = '';
  medicos: { CRM: string, Nome: string }[] = [];
  consultas: any[] = []; // Array para armazenar as consultas do médico selecionado
  selectedMedicoId: string = '';
  selectedMedicoNome: string = '';
  selectedDate: string = '';
  selectedTime: string = '';

  minDate: string = ''; // Data mínima para seleção no calendário
  maxDate: string = ''; // Data máxima para seleção no calendário

  timeSlots: { time: string, available: boolean }[] = []; // Lista de horários disponíveis

  constructor(private apiService: ApiService,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    // Validação de acesso: verifica se o perfil é 'Paciente' e se está validado
    const situação = this.authService.getStatus();
    const perfil = this.authService.getProfile();
    if (perfil !== 'P' && situação !== 'Validado') {
      this.router.navigate(['/login']); // Redireciona para login se inválido
    }

    this.carregarEspecialidades();
    this.setMinMaxDates(); // Define as datas mínimas e máximas para agendamento
    this.selectedDate = new Date().toISOString().split('T')[0]; // Define a data inicial como hoje
  }

  // Define a data mínima (hoje) e a máxima (3 meses no futuro)
  setMinMaxDates() {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = threeMonthsFromNow.toISOString().split('T')[0];
  }

  // Verifica se uma data é um dia útil e se há horário disponível
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    // Bloqueia sábados e domingos
    if (utcDay === 0 || utcDay === 6) {
      return false;
    }

    // Verifica se a data está presente nas consultas do médico
    const selectedISODate = date.toISOString().split('T')[0];
    const selectedTime = date.toTimeString().split(' ')[0].substring(0, 5); // HH:mm format
    return !this.consultas.some(consulta => consulta.data === selectedISODate && consulta.hora === selectedTime);
  };

  // Manipula a mudança de médico selecionado
  onMedicoChange(event: any) {
    const selectedMedico = this.medicos.find(medico => medico.CRM === event.detail.value);
    if (selectedMedico) {
      this.selectedMedicoNome = selectedMedico.Nome;
    }
    this.selectedMedicoId = event.detail.value;
    this.buscarConsultasDoMedico(this.selectedMedicoId); // Busca consultas marcadas para o médico
  }

  // Manipula a mudança de data selecionada
  onDateChange(event: any) {
    this.selectedDate = new Date(event.detail.value).toISOString().split('T')[0];
    this.generateTimeSlots(); // Gera os horários disponíveis
    this.updateAvailableTimeSlots(); // Atualiza a disponibilidade dos horários
  }

  // Atualiza a disponibilidade de horários com base nas consultas existentes
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

  // Gera horários de atendimento em intervalos de 30 minutos
  generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 8; hour < 18; hour++) {
      this.timeSlots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: true });
      this.timeSlots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: true });
    }

    this.updateAvailableTimeSlots();
  }

  // Carrega as especialidades disponíveis
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

  // Busca médicos de acordo com a especialidade selecionada
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

  // Exibe um alerta com mensagem personalizada
  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Limpa as seleções de especialidade, médico, data e horários
  limparSelecoes() {
    this.selectedEspecialidade = '';
    this.medicos = [];
    this.selectedDate = '';
    this.selectedTime = '';
    this.timeSlots = [];
  }

  // Confirma a marcação da consulta e abre um modal de confirmação
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

    // Cria um objeto com os detalhes da consulta
    const consulta = {
      paciente: cpf,
      nomePaciente: nome,
      especialidade: this.selectedEspecialidade,
      nomeMedico: this.selectedMedicoNome,
      medico: this.selectedMedicoId,
      dia: this.selectedDate,
      horario: this.selectedTime
    };

    // Cria o modal com os detalhes da consulta
    const modal = await this.modalController.create({
      component: ConsultaModalPage,
      componentProps: {
        consulta: consulta // Passa os detalhes da consulta como parâmetro
      }
    });

    await modal.present();
  }

  // Busca consultas já marcadas para o médico selecionado
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

  // Filtra consultas pela data selecionada
  filtrarConsultasPorData(data: string) {
    const consultasFiltradas = this.consultas.filter(consulta => {
      const consultaDate = new Date(consulta.data).toISOString().split('T')[0];
      return consultaDate === data;
    });
    return consultasFiltradas;
  }

}

