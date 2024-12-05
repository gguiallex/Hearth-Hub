import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SuspensoService {
  // Inicializa um BehaviorSubject para armazenar a contagem de usuários suspensos
  private suspensoCount = new BehaviorSubject<number>(0);
  // Expondo a contagem como um Observable para que outros componentes possam se inscrever e receber atualizações em tempo real
  suspensoCount$ = this.suspensoCount.asObservable();

  constructor(private apiService: ApiService) {
    // Inicializa a contagem de usuários suspensos ao criar a instância do serviço
    this.updateSuspensoCount();
  }

  // Filtra usuários com a situação "Suspenso" em uma lista de usuários
  private filterSuspendedUsers(users: any[]): any[] {
    return users.filter(user => user.Situação === 'Suspenso');
  }

  // Atualiza a contagem de usuários suspensos ao consultar as APIs de médicos, enfermeiros e administradores
  updateSuspensoCount() {
    let totalSuspensos = 0;

    // Consulta a API para obter médicos e atualiza a contagem de suspensos
    this.apiService.getMedicos().subscribe(medicos => {
      totalSuspensos += this.filterSuspendedUsers(medicos).length;
      this.suspensoCount.next(totalSuspensos); // Emite o novo valor da contagem
    });

    // Consulta a API para obter enfermeiros e atualiza a contagem de suspensos
    this.apiService.getEnfermeiros().subscribe(enfermeiros => {
      totalSuspensos += this.filterSuspendedUsers(enfermeiros).length;
      this.suspensoCount.next(totalSuspensos);
    });

    // Consulta a API para obter administradores e atualiza a contagem de suspensos
    this.apiService.getAdministradores().subscribe(administradores => {
      totalSuspensos += this.filterSuspendedUsers(administradores).length;
      this.suspensoCount.next(totalSuspensos);
    });
  }
}
