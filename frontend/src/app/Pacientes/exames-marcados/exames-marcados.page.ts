import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin, Observable } from 'rxjs';

// Interface para definir a estrutura de um Exame
interface Exame {
  IdConsulta: string;
  CodExames: string;
  CRM: string;
  COREN?: string | null;
  DataPrescricao: string;
  DataRealizacao?: string | null;
  Status: string;
  NomeExame?: string; // Nome do exame
  NomeMedico?: string; // Nome do médico que prescreveu
  NomeEnfermeiro?: string | null; // Nome do enfermeiro que realizou (se houver)
}

@Component({
  selector: 'app-exames-marcados',
  templateUrl: './exames-marcados.page.html',
  styleUrls: ['./exames-marcados.page.scss'],
})
export class ExamesMarcadosPage implements OnInit {
  cpf = ''; // CPF do usuário autenticado
  exames: Exame[] = []; // Lista de exames
  pendentes: Exame[] = []; // Exames pendentes
  realizados: Exame[] = []; // Exames realizados

  mostrarExamesRealizados = true; // Estado de visibilidade para exames realizados
  mostrarExamesPendentes = true; // Estado de visibilidade para exames pendentes

  constructor(private authService: AuthService, private router:Router, private apiService: ApiService) { }

  ngOnInit() {
    // Verifica se o usuário tem perfil válido para acessar a página
    const situação = this.authService.getStatus();
    const perfil = this.authService.getProfile();
    if (perfil !== 'E' && situação !== 'Validado') {
      this.router.navigate(['/login']); // Redireciona para login se não for enfermeiro ou conta não validada
    }
    this.cpf = this.authService.getCpf() ?? ''; // Obtém o CPF do usuário autenticado
    this.carregarExames(); // Carrega exames
  }

  carregarExames() {
    this.apiService.getExamesDoPaciente(this.cpf).subscribe(
      (exames: Exame[]) => {
        // Cria múltiplas requisições para obter detalhes adicionais de exames, médicos e enfermeiros
        const requests = exames.map(exame => forkJoin({
          exameInfo: this.apiService.getExameByCod(exame.CodExames), // Detalhes do exame
          medicoInfo: this.apiService.getMedicoByCRM(exame.CRM), // Detalhes do médico
          enfermeiroInfo: exame.COREN ? this.apiService.getEnfermeiroByCOREN(exame.COREN) : new Observable<{ COREN: string, Nome: string }[]>(subscriber => subscriber.next([])) // Detalhes do enfermeiro (se aplicável)

        }));

        forkJoin(requests).subscribe(
          results => {
            // Mapeia os exames, adicionando os nomes extras (exame, médico, enfermeiro)
            this.exames = exames.map((exame, index) => ({
              ...exame,
              NomeExame: results[index].exameInfo[0]?.Nome,
              NomeMedico: results[index].medicoInfo[0]?.Nome,
              NomeEnfermeiro: results[index].enfermeiroInfo.length ? results[index].enfermeiroInfo[0]?.Nome : null
            }));

            this.categorizarExames(); // Classifica os exames em pendentes e realizados
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

  // Classifica exames em pendentes e realizados com base no status
  categorizarExames(){
    this.pendentes = this.exames.filter(exame => exame.Status === 'Pendente');
    this.realizados = this.exames.filter(exame => exame.Status === 'Realizado');
  }
  
  // Alterna a visibilidade dos exames pendentes
  toggleExamesPendentes(){
    this.mostrarExamesPendentes = !this.mostrarExamesPendentes;
  }

  // Alterna a visibilidade dos exames realizados
  toggleExamesRealizados(){
    this.mostrarExamesRealizados = !this.mostrarExamesRealizados;
  }
}