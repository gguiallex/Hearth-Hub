import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://hearth-hub.vercel.app'; // URL base da API
  private consultaAtualizada = new BehaviorSubject<boolean>(false); // Observable para monitorar atualizações de consulta

  constructor(private http: HttpClient) { }

  // Emite um evento indicando que uma consulta foi atualizada.
  emitirAtualizacaoConsulta() {
    this.consultaAtualizada.next(true);
  }

  // Retorna um observable que notifica quando uma consulta foi atualizada.
  getAtualizacaoConsulta() {
    return this.consultaAtualizada.asObservable();
  }

  // Obtém a lista de especialidades.
  getEspecialidades(): Observable<{ CodEsp: string, Especialidade: string, desc: string }[]> {
    return this.http.get<{ CodEsp: string, Especialidade: string, desc: string }[]>(`${this.apiUrl}/especialidades`);
  }

  // Retorna o total de especialidades.
  CountEspecialidades(): Observable<number> {
    return this.http.get<{ CodEsp: string, Especialidade: string, desc: string }[]>(`${this.apiUrl}/especialidades`).pipe(
      map(especialidades => especialidades.length)
    );
  }

  // Obtém a lista de exames.
  getExames(): Observable<{ CodExames: string, Nome: string, Desc: string }[]> {
    return this.http.get<{ CodExames: string, Nome: string, Desc: string }[]>(`${this.apiUrl}/exames`);
  }

  // Obtém detalhes de um exame pelo código.
  getExameByCod(CodExames: string): Observable<{ CodExames: string, Nome: string, Descrição: string }[]> {
    return this.http.get<{ CodExames: string, Nome: string, Descrição: string }[]>(`${this.apiUrl}/exame/${CodExames}`)
  }

  // Conta o total de exames cadastrados.
  countExames(): Observable<number> {
    return this.http.get<{ CodExames: string, Nome: string, Desc: string }[]>(`${this.apiUrl}/exames`).pipe(
      map(exames => exames.length)
    );
  }

  // Obtém a lista de exames prescritos.
  getExamesPresc(): Observable<{ IdConsulta: string, CodExames: string, CPF: string, CRM: string, COREN: string, DataPrescricao: string, DataRealizacao: string, Status: string }[]> {
    return this.http.get<{ IdConsulta: string, CodExames: string, CPF: string, CRM: string, COREN: string, DataPrescricao: string, DataRealizacao: string, Status: string }[]>(`${this.apiUrl}/examesPrescritos`);
  }

  // Obtém exames prescritos por um enfermeiro específico.
  getExamesDoEnfermeiro(COREN: string): Observable<{ IdConsulta: string, CodExames: string, CPF: string, CRM: string, COREN: string, DataPrescricao: string, DataRealizacao: string, Status: string }[]> {
    return this.http.get<{ IdConsulta: string, CodExames: string, CPF: string, CRM: string, COREN: string, DataPrescricao: string, DataRealizacao: string, Status: string }[]>(`${this.apiUrl}/examesPrescritos/${COREN}`);
  }

  // Obtém o total de exames pendentes.
  getTotalExamesPendentes(): Observable<number> {
    return this.getExamesPresc().pipe(
      map(exames => exames.filter(exame => exame.Status === 'Pendente').length)
    );
  }

  // Atualiza o status de um exame prescrito.
  atualizarExamesPresc(IdConsulta: string, CodExames: string, COREN: string, Status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/examePrescrito/${IdConsulta}/${CodExames}`, { COREN, Status })
  }

  // Obtém todos os médicos cadastrados.
  getMedicos(): Observable<{ CRM: string, Nome: string, Especialidade: string, Email: string, Senha: string, Situação: string }[]> {
    return this.http.get<{ CRM: string, Nome: string, Especialidade: string, Email: string, Senha: string, Situação: string }[]>(`${this.apiUrl}/medicos`);
  }

  // Segue com outras funções semelhantes para CRUD de médicos, pacientes, enfermeiros, etc.

  getPacientes(): Observable<{ CPF: string, Nome: string, Email: string, Senha: string, Situação: string }[]> {
    return this.http.get<{ CPF: string, Nome: string, Email: string, Senha: string, Situação: string }[]>(`${this.apiUrl}/pacientes`);
  }

  getEnfermeiros(): Observable<{ COREN: string, Nome: string, Email: string, Senha: string, Situação: string }[]> {
    return this.http.get<{ COREN: string, Nome: string, Email: string, Senha: string, Situação: string }[]>(`${this.apiUrl}/enfermeiros`);
  }

  getAdministradores(): Observable<{ CPF: string, Nome: string, Email: string, Senha: string, Situação: string }[]> {
    return this.http.get<{ CPF: string, Nome: string, Email: string, Senha: string, Situação: string }[]>(`${this.apiUrl}/administradores`);
  }

  atualizarMedico(CRM: string, Nome: string, Especialidade: string, Email: string, Senha: string, Situação: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/medico/${CRM}`, { CRM, Nome, Especialidade, Email, Senha, Situação });
  }

  atualizarEnfermeiro(COREN: string, Nome: string, Email: string, Senha: string, Situação: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/enfermeiro/${COREN}`, { COREN, Nome, Email, Senha, Situação });
  }

  atualizarPaciente(CPF: string, Nome: string, Email: string, Senha: string, Situação: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/paciente/${Email}`, { CPF, Nome, Email, Senha, Situação });
  }

  atualizarADM(CPF: string, Nome: string, Email: string, Senha: string, Situação: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/administrador/${Email}`, { CPF, Nome, Email, Senha, Situação });
  }

  excluirMedico(CRM: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medico/${CRM}`);
  }

  excluirEnfermeiro(COREN: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/enfermeiro/${COREN}`);
  }

  excluirPaciente(Email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/paciente/${Email}`);
  }

  excluirADM(Email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/administrador/${Email}`);
  }

  enviarEmailAprovação(Email: string, Nome: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/conta-aprovada`, { Email, Nome });
  }

  getMedicoByCRM(CRM: string): Observable<{ CRM: string, Nome: string, Especialidade: string }[]> {
    return this.http.get<{ CRM: string, Nome: string, Especialidade: string }[]>(`${this.apiUrl}/medicos/${CRM}`);
  }

  getEnfermeiroByCOREN(COREN: string): Observable<{ COREN: string, Nome: string }[]> {
    return this.http.get<{ COREN: string, Nome: string }[]>(`${this.apiUrl}/enfermeiro/${COREN}`);
  }

  getEspecialidadeByCRM(CRM: string): Observable<{ especialidade: string }[]> {
    return this.http.get<{ especialidade: string }[]>(`${this.apiUrl}/especialidades/${CRM}`);
  }

  getConsultas(): Observable<{ IdConsulta: string, CPF: string, CRM: string, data: string, Horario: string }[]> {
    return this.http.get<{ IdConsulta: string, CPF: string, CRM: string, data: string, Horario: string }[]>(`${this.apiUrl}/consultas`);
  }

  marcarConsulta(consulta: any) {
    return this.http.post<any>(`${this.apiUrl}/consultas`, consulta).pipe(
      tap(() => this.emitirAtualizacaoConsulta()) // Emite o evento após a consulta ser marcada
    );
  }

  criarEspecialidade(CodEsp: string, Especialidade: string, Descrição: string) {
    return this.http.post<any>(`${this.apiUrl}/especialidade`, { CodEsp, Especialidade, Descrição });
  }

  criarExame(Nome: string, Descrição: string) {
    return this.http.post<any>(`${this.apiUrl}/exame`, { Nome, Descrição });
  }

  criarExamePresc(IdConsulta: string, CodExames: string, CPF: string, CRM: string) {
    return this.http.post<any>(`${this.apiUrl}/examePrescrito`, { IdConsulta, CodExames, CPF, CRM });
  }

  atualizarEspecialidade(CodEsp: string, Especialidade: string, Descrição: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/especialidade/${CodEsp}`, { CodEsp, Especialidade, Descrição });
  }

  atualizarExame(CodExames: string, Nome: string, Descrição: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/exame/${CodExames}`, { Nome, Descrição });
  }

  excluirEspecialidade(codEsp: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/especialidade/${codEsp}`);
  }

  excluirExame(CodExames: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/exame/${CodExames}`);
  }

  criarEnfermeiro(COREN: string, Nome: string, Email: string, Senha: string) {
    return this.http.post<any>(`${this.apiUrl}/enfermeiros`, { COREN, Nome, Email, Senha });
  }

  criarPaciente(CPF: string, Nome: string, Email: string, Senha: string) {
    return this.http.post<any>(`${this.apiUrl}/pacientes`, { CPF, Nome, Email, Senha });
  }

  criarAdministrador(CPF: string, Nome: string, Email: string, Senha: string) {
    return this.http.post<any>(`${this.apiUrl}/administradores`, { CPF, Nome, Email, Senha });
  }

  criarMedico(CRM: string, Nome: string, Especialidade: string, Email: string, Senha: string) {
    return this.http.post<any>(`${this.apiUrl}/medicos`, { CRM, Nome, Especialidade, Email, Senha });
  }

  getMedicosPorEspecialidade(especialidade: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos/especialidade/${especialidade}`);
  }

  getPacientePorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/paciente/${email}`).pipe(
      map(response => {
        // Verifica se a resposta contém dados
        if (response && response.length > 0) {
          // Retorna o primeiro paciente encontrado
          return response[0];
        } else {
          // Se não houver dados na resposta, lança um erro ou retorna null
          throw new Error('Paciente não encontrado');
          // Ou podemos retornar null
          // return null;
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  getAdmPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/administrador/${email}`).pipe(
      map(response => {
        if (response && response.length > 0) {
          return response[0];
        } else {
          throw new Error('Administrador não encontrado');
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  getConsultasDoMedico(CRM: string): Observable<{ IdConsulta: string, CPF: string, CRM: string, data: string, Horario: string }[]> {
    return this.http.get<{ IdConsulta: string, CPF: string, CRM: string, data: string, Horario: string }[]>(`${this.apiUrl}/consultas/medico/${CRM}`);
  }

  getConsultasDoPaciente(CPF: string): Observable<{ IdConsulta: string, CPF: string, CRM: string, data: string, Horario: string }[]> {
    return this.http.get<{ IdConsulta: string, CPF: string, CRM: string, data: string, Horario: string }[]>(`${this.apiUrl}/consultas/paciente/${CPF}`);
  }

  // Solicita a redefinição de senha com base no e-mail.
  solicitarRecuperacaoSenha(email: string, perfil: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, { email, Perfil: perfil });
  }

  solicitarConfirmaçãoDeConta(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/gerar-token-confirmacao`, { email });
  }

  // Redefine a senha usando um token.
  redefinirSenhaComToken(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, { token, novaSenha });
  }

  getExamesDoPaciente(CPF: string): Observable<{ IdConsulta: string, CodExames: string, CRM: string, COREN?: string, DataPrescricao: string, DataRealizacao?: string, Status: string }[]> {
    return this.http.get<{ IdConsulta: string, CodExames: string, CRM: string, COREN?: string, DataPrescricao: string, DataRealizacao?: string, Status: string }[]>(`${this.apiUrl}/examePrescrito/paciente/${CPF}`);
  }

}
