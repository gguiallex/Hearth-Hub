import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiUrl = 'https://hearth-hub.vercel.app';
 private examesPendentes = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient, private apiService: ApiService) { }

  validarConta(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-conta`, { token });
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/autenticar`, { email, senha }).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('nome', response.nome);
          localStorage.setItem('perfil', response.perfil);
          localStorage.setItem('situação', response.situação);

          if (response.perfil === 'M' && response.crm) {
            localStorage.setItem('crm', response.crm);
          }

          if (response.perfil === 'E' && response.coren) {
            localStorage.setItem('coren', response.coren);
          }
          
          if(response.perfil == 'P'){
            // Após o login bem-sucedido, obtenha o CPF do paciente
            this.apiService.getPacientePorEmail(email).subscribe(
              paciente => {
                if (paciente && paciente.CPF) {
                  localStorage.setItem('cpf', paciente.CPF);
                  localStorage.setItem('nome', paciente.Nome);
                } else {
                  console.error('CPF do paciente não encontrado na resposta da API.');
                }
              },
              error => {
                console.error('Erro ao obter CPF do paciente:', error);
              }
            );
          }
          if(response.perfil == 'A'){
            this.apiService.getAdmPorEmail(email).subscribe(
              adm => {
                if(adm && adm.Nome){
                  localStorage.setItem('nome', adm.Nome);
                } else {
                  console.error('Nome do administrador não encontrado na resposta da API.');
                }
              },
              error => {
                console.error('Erro ao obter nome do adm:', error);
              }
            );
          }
        }
        return response;
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getProfile(): string | null {
    return localStorage.getItem('perfil');
  }

  getStatus(): string | null {
    return localStorage.getItem('situação');
  }

  getCpf(): string | null {
    return localStorage.getItem('cpf');
  }

  getCRM(): string | null {
    return localStorage.getItem('crm');
  }

  getCOREN(): string | null {
    return localStorage.getItem('coren');
  }

  getNome(): string | null {
    return localStorage.getItem('nome');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('perfil');
    localStorage.removeItem('cpf');
    localStorage.removeItem('crm');
    localStorage.removeItem('coren');
  }

  setExamesPendentes(valor: number) {
    this.examesPendentes.next(valor);
  }

  getExamesPendentes() {
    return this.examesPendentes.asObservable();
  }
}
