import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL base para as requisições de autenticação
 private apiUrl = 'https://hearth-hub.vercel.app';
 // Subject para armazenar e observar o número de exames pendentes
 private examesPendentes = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient, private apiService: ApiService) { }

    /**
   * Método para validar a conta com um token de confirmação.
   * @param token Token de confirmação de conta.
   * @returns Observable de resposta da API.
   */
  validarConta(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmar-conta`, { token });
  }

    /**
   * Método de login que autentica o usuário.
   * @param email Email do usuário.
   * @param senha Senha do usuário.
   * @returns Observable com a resposta da API.
   */
  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/autenticar`, { email, senha }).pipe(
      map(response => {
        // Se o login for bem-sucedido, armazena dados no localStorage
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('nome', response.nome);
          localStorage.setItem('perfil', response.perfil);
          localStorage.setItem('situação', response.situação);

          // Armazena CRM se o perfil for de médico
          if (response.perfil === 'M' && response.crm) {
            localStorage.setItem('crm', response.crm);
          }
          // Armazena COREN se o perfil for de enfermeiro
          if (response.perfil === 'E' && response.coren) {
            localStorage.setItem('coren', response.coren);
          }
          // Recupera CPF e nome do paciente se o perfil for de paciente
          if(response.perfil == 'P'){
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
          // Recupera nome do administrador se o perfil for de administrador
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
        return response; // Retorna a resposta da API
      }),
      catchError(error => {
        throw error; // Lança erro para ser tratado no componente
      })
    );
  }
  
  // Verifica se o usuário está logado com base na presença do token no localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Retorna o perfil do usuário armazenado no localStorage
  getProfile(): string | null {
    return localStorage.getItem('perfil');
  }

  // Retorna a situação do usuário armazenada no localStorage
  getStatus(): string | null {
    return localStorage.getItem('situação');
  }

  // Retorna o CPF do usuário armazenado no localStorage
  getCpf(): string | null {
    return localStorage.getItem('cpf');
  }

  // Retorna o CRM do usuário armazenado no localStorage
  getCRM(): string | null {
    return localStorage.getItem('crm');
  }

  // Retorna o COREN do usuário armazenado no localStorage
  getCOREN(): string | null {
    return localStorage.getItem('coren');
  }

  // Retorna o nome do usuário armazenado no localStorage
  getNome(): string | null {
    return localStorage.getItem('nome');
  }

  // Remove todos os dados do usuário do localStorage, efetivamente realizando o logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('perfil');
    localStorage.removeItem('cpf');
    localStorage.removeItem('crm');
    localStorage.removeItem('coren');
  }

  // Atualiza a contagem de exames pendentes
  setExamesPendentes(valor: number) {
    this.examesPendentes.next(valor);
  }

  // Retorna um Observable que fornece atualizações sobre a contagem de exames pendentes
  getExamesPendentes() {
    return this.examesPendentes.asObservable();
  }
}
