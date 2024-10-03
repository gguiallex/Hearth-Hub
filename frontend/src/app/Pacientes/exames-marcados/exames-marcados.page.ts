import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Exame {
  IdConsulta: string;
  CodExames: string;
  CRM: string;
  COREN?: string | null;
  DataPrescricao: string;
  DataRealizacao?: string | null;
  Status: string;
  NomeExame?: string;
  NomeMedico?: string;
  NomeEnfermeiro?: string | null;
}

@Component({
  selector: 'app-exames-marcados',
  templateUrl: './exames-marcados.page.html',
  styleUrls: ['./exames-marcados.page.scss'],
})
export class ExamesMarcadosPage implements OnInit {
  cpf = '';
  exames: Exame[] = [];
  pendentes: Exame[] = [];
  realizados: Exame[] = [];

  mostrarExamesRealizados = true;
  mostrarExamesPendentes = true;

  constructor(private authService: AuthService, private router:Router, private apiService: ApiService) { }

  ngOnInit() {
    const situação = this.authService.getStatus();
    const perfil = this.authService.getProfile();
    if (perfil !== 'E' && situação !== 'Validado') {
      this.router.navigate(['/login']);
    }
    this.cpf = this.authService.getCpf() ?? '';
    this.carregarExames();
  }

  carregarExames() {
    this.apiService.getExamesDoPaciente(this.cpf).subscribe(
      (exames: Exame[]) => {
        const requests = exames.map(exame => forkJoin({
          exameInfo: this.apiService.getExameByCod(exame.CodExames),
          medicoInfo: this.apiService.getMedicoByCRM(exame.CRM),
          enfermeiroInfo: exame.COREN ? this.apiService.getEnfermeiroByCOREN(exame.COREN) : new Observable<{ COREN: string, Nome: string }[]>(subscriber => subscriber.next([]))
        }));

        forkJoin(requests).subscribe(
          results => {
            this.exames = exames.map((exame, index) => ({
              ...exame,
              NomeExame: results[index].exameInfo[0]?.Nome,
              NomeMedico: results[index].medicoInfo[0]?.Nome,
              NomeEnfermeiro: results[index].enfermeiroInfo.length ? results[index].enfermeiroInfo[0]?.Nome : null
            }));

            this.categorizarExames();
          },
          error => {
            console.error('Erro ao carregar informações adicionais:', error);
          }
        );
      },
      error => {
        console.error('Erro ao carregar exames do paciente:', error);
      }
    );
  }

  categorizarExames(){
    this.pendentes = this.exames.filter(exame => exame.Status === 'Pendente');
    this.realizados = this.exames.filter(exame => exame.Status === 'Realizado');
  }
  
  toggleExamesPendentes(){
    this.mostrarExamesPendentes = !this.mostrarExamesPendentes;
  }

  toggleExamesRealizados(){
    this.mostrarExamesRealizados = !this.mostrarExamesRealizados;
  }
}