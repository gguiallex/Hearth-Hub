import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-consultas-marcadas',
  templateUrl: './consultas-marcadas.page.html',
  styleUrls: ['./consultas-marcadas.page.scss'],
})
export class ConsultasMarcadasPage implements OnInit {

  constructor(private apiService: ApiService, private alertController: AlertController, private navCtrl: NavController, private authService: AuthService) { }
  consultas: { IdConsulta: string, CPF: string, CRM: string, data:string, Horario:string }[] = [];
  dia: { IdConsulta: string, CPF: string, CRM: string, data:string, Horario:string }[] = [];
  passado: { IdConsulta: string, CPF: string, CRM: string, data:string, Horario:string }[] = [];
  futuro: { IdConsulta: string, CPF: string, CRM: string, data:string, Horario:string }[] = [];
  pacientes: { CPF:string, Nome:string, Email:string, Senha:string, Situação:string }[] = [];
  consultasFiltradas: { IdConsulta: string, CPF: string, CRM: string, data:string, Horario:string }[] = [];
  crmMedicoLogado = '';

  mostrarConsultasDoDia = true;
  mostrarConsultasJaFeitas = true;
  mostrarConsultasFuturas = true;

  ngOnInit() {
    this.crmMedicoLogado = this.authService.getCRM() ?? '00000';
    this.carregarDados();
    console.log(this.crmMedicoLogado);
  }

  carregarDados(){
    console.log(this.crmMedicoLogado);
    this.apiService.getConsultasDoMedico(this.crmMedicoLogado).subscribe(
      consultas => {
        console.log(this.consultas);
        this.consultas = consultas;
        console.log(this.consultas);
        this.categorizarConsultas();
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );

    this.apiService.getPacientes().subscribe(
      pacientes => {
        this.pacientes = pacientes;
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );

  }

  categorizarConsultas() {
    const hoje = new Date().toISOString().split('T')[0]; // Data de hoje no formato YYYY-MM-DD

    this.dia = [];
    this.passado = [];
    this.futuro = [];

    this.consultas.forEach(consulta => {
      const dataConsulta = consulta.data.split('T')[0];
      if (dataConsulta === hoje) {
        this.dia.push(consulta);
      } else if (dataConsulta < hoje) {
        this.passado.push(consulta);
      } else {
        this.futuro.push(consulta);
      }
    });
    // Ordenar cada categoria por data e hora
    this.dia.sort((a, b) => {
      const dataHoraA = new Date(a.data + 'T' + a.Horario).getTime();
      const dataHoraB = new Date(b.data + 'T' + b.Horario).getTime();
      return dataHoraB - dataHoraA; // Inverte a ordenação para mais recente primeiro
    });

    this.passado.sort((a, b) => {
      const dataHoraA = new Date(a.data + 'T' + a.Horario).getTime();
      const dataHoraB = new Date(b.data + 'T' + b.Horario).getTime();
      return dataHoraB - dataHoraA; // Inverte a ordenação para mais recente primeiro
    });

    this.futuro.sort((a, b) => {
      const dataHoraA = new Date(a.data + 'T' + a.Horario).getTime();
      const dataHoraB = new Date(b.data + 'T' + b.Horario).getTime();
      return dataHoraB - dataHoraA; // Inverte a ordenação para mais recente primeiro
    });
  }



  formatarData(data: string): string {
    return data.split('T')[0];
  }

  mostrarNome(CPF: string): string {
    const paciente = this.pacientes.find(p => p.CPF === CPF);
    return paciente ? paciente.Nome : 'Desconhecido';
  }

    // Função para filtrar consultas por nome
    filtrarConsultasPorNome(event: any) {
      const searchTerm = event.target.value.toLowerCase();
      if (searchTerm.trim() === '') {
        this.consultasFiltradas = [];
        this.categorizarConsultas();
      } else {
        this.consultasFiltradas = this.consultas.filter(consulta =>
          this.mostrarNome(consulta.CPF).toLowerCase().includes(searchTerm)
        );
        this.categorizarConsultasFiltradas();
      }
    }

    categorizarConsultasFiltradas() {
      const hoje = new Date().toISOString().split('T')[0];
    
      this.dia = [];
      this.passado = [];
      this.futuro = [];
    
      this.consultasFiltradas.forEach(consulta => {
        const dataConsulta = consulta.data.split('T')[0];
        if (dataConsulta === hoje) {
          this.dia.push(consulta);
        } else if (dataConsulta < hoje) {
          this.passado.push(consulta);
        } else {
          this.futuro.push(consulta);
        }
      });
    
      this.dia.sort((a, b) => new Date(a.data + 'T' + a.Horario).getTime() - new Date(b.data + 'T' + b.Horario).getTime());
      this.passado.sort((a, b) => new Date(a.data + 'T' + a.Horario).getTime() - new Date(b.data + 'T' + b.Horario).getTime());
      this.futuro.sort((a, b) => new Date(a.data + 'T' + a.Horario).getTime() - new Date(b.data + 'T' + b.Horario).getTime());
    }

    async confirmarCriacaoExame(consulta: {CPF: string, IdConsulta: string, CRM: string}) {
      const alert = await this.alertController.create({
        header: 'Criar Exame',
        message: `Deseja criar um exame para a consulta do paciente ${this.mostrarNome(consulta.CPF)}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Confirmar',
            handler: () => {
              this.navCtrl.navigateForward(`/marcar-exames`, {
                queryParams: {
                  CPF: consulta.CPF,
                  IdConsulta: consulta.IdConsulta,
                  CRM: consulta.CRM
                }
              });
            }
          }
        ]
      });

      await alert.present();
    }

  toggleConsultasDoDia() {
    this.mostrarConsultasDoDia = !this.mostrarConsultasDoDia;
  }

  toggleConsultasJaFeitas() {
    this.mostrarConsultasJaFeitas = !this.mostrarConsultasJaFeitas;
  }

  toggleConsultasFuturas() {
    this.mostrarConsultasFuturas = !this.mostrarConsultasFuturas;
  }
}
