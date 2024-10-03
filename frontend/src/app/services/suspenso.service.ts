import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SuspensoService {
  private suspensoCount = new BehaviorSubject<number>(0);
  suspensoCount$ = this.suspensoCount.asObservable();

  constructor(private apiService: ApiService) {
    // Inicializar o contador com 0 ou o valor inicial desejado
    this.updateSuspensoCount();
  }

  private filterSuspendedUsers(users: any[]): any[] {
    return users.filter(user => user.Situação === 'Suspenso');
  }

  updateSuspensoCount() {
    let totalSuspensos = 0;

    this.apiService.getMedicos().subscribe(medicos => {
      totalSuspensos += this.filterSuspendedUsers(medicos).length;
      this.suspensoCount.next(totalSuspensos);
    });

    this.apiService.getEnfermeiros().subscribe(enfermeiros => {
      totalSuspensos += this.filterSuspendedUsers(enfermeiros).length;
      this.suspensoCount.next(totalSuspensos);
    });

    this.apiService.getAdministradores().subscribe(administradores => {
      totalSuspensos += this.filterSuspendedUsers(administradores).length;
      this.suspensoCount.next(totalSuspensos);
    });
  }
}
