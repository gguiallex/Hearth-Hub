import { AlertService } from '.././../services/alert.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import Chart, { LinearScale, CategoryScale, Title } from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Interface para contagem de consultas por mês
interface ContagemConsultasPorMes {
  [mes: number]: number;
}

// Declaração de módulo para o uso do plugin autoTable do jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  // Referência ao elemento do gráfico no template
  @ViewChild('myChart', { static: false }) chartElement!: ElementRef;
  showOptions: boolean = false; // Controla a visibilidade das opções
  mostrarFundoBranco: boolean = true; // Controla a visibilidade do fundo branco
  selectedOption: string = ''; // Armazena a opção selecionada
  medicos: any[] = []; // Armazena a lista de médicos
  pacientes: any[] = []; // Armazena a lista de pacientes
  enfermeiros: any[] = []; // Armazena a lista de enfermeiros
  selectedMedico: any; // Armazena o médico selecionado
  selectedPaciente: any; // Armazena o paciente selecionado
  selectedEnfermeiro: any; // Armazena o enfermeiro selecionado
  dataInicio: string = ''; // Data de início selecionada
  dataFim: string = ''; // Data de fim selecionada
  especialidades: { Especialidade: string }[] = []; // Lista de especialidades
  selectedEsp: string = ""; // Especialidade selecionada
  chart: any; // Objeto do gráfico
  maxDate: string = ''; // Data máxima para seleção

  constructor(private authService: AuthService,
    private router: Router,
    public popoverController: PopoverController,
    private apiService: ApiService,
    private alertService: AlertService,
    private toastController: ToastController) {
    this.chartElement = {} as ElementRef; // Inicializa o elemento do gráfico
  }

  ngOnInit() {

    const perfil = this.authService.getProfile();
    const situação = this.authService.getStatus();
    if (perfil !== 'A' && situação !== 'Validado') {
      this.router.navigate(['/login']); // Redireciona para a página de login se não for um administrador
    }

    this.carregarDados(); // Carrega os dados iniciais
    this.setMaxDate(); // Define a data máxima para os campos de data
  }

  // Método para exibir um toast (notificação)
  async exibirToast(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000, // duração em milissegundos
      position: 'top' // posição do toast
    });
    toast.present();
  }

  // Define a data máxima para os campos de data
  setMaxDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    this.maxDate = `${year}-${month}`;
  }

  // Alterna a visibilidade das opções
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  // Método para selecionar uma opção (médico, enfermeiro, paciente)
  selectOption(option: string) {
    this.apagarGrafico(); // Apaga o gráfico atual
    this.selectedOption = option; // Define a opção selecionada
    this.showOptions = false; // Esconde as opções
  }

  // Carrega os dados iniciais da API
  carregarDados() {
    // Carrega especialidades
    this.apiService.getEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades;
      },
      error => {
        console.error('Erro ao carregar especialidades:', error);
      }
    );

    // Carrega médicos
    this.apiService.getMedicos().subscribe(
      medicos => {
        this.medicos = medicos;
      },
      error => {
        console.error('Erro ao carregar médicos:', error);
      }
    );

    // Carrega pacientes
    this.apiService.getPacientes().subscribe(
      pacientes => {
        this.pacientes = pacientes;
      },
      error => {
        console.error('Erro ao carregar pacientes:', error);
      }
    );

    // Carrega enfermeiros
    this.apiService.getEnfermeiros().subscribe(
      enfermeiros => {
        this.enfermeiros = enfermeiros;
      },
      error => {
        console.error('Erro ao carregar enfermeiros:', error);
      }
    );

  }

  // Método chamado após a visualização estar inicializada
  ngAfterViewInit() {
    Chart.register(LinearScale, CategoryScale, Title); // Registro das escalas do gráfico
  }

  // Gera o gráfico para enfermeiros
  async gerarGraficoEnfermeiro() {
    if (!this.selectedEnfermeiro) {
      await this.alertService.showAlert("Escolha um enfermeiro antes de gerar o gráfico.");
      return;
    }

    const enfermeiroCOREN: string = this.selectedEnfermeiro.COREN;

    this.apiService.getExamesDoEnfermeiro(enfermeiroCOREN).subscribe(
      async exames => {
        console.log(enfermeiroCOREN);
        try {
          const dadosProcessados = await this.processarExamesEnfermeiro(exames);
          this.renderizarGraficoEnfermeiro(dadosProcessados);
        } catch (error) {
          console.error('Erro ao processar exames do enfermeiro:', error);
        }
      },
      error => {
        console.error('Erro ao carregar exames realizados do enfermeiro:', error);
      }
    );
  }

  // Processa os exames dos enfermeiros
  async processarExamesEnfermeiro(exames: any[]) {
    const contagemExamesPorMedico: { [nome: string]: number } = {};

    // Obter todos os CRMs dos exames
    const crms = [...new Set(exames.map(exame => exame.CRM))];

    // Buscar os nomes dos médicos para os CRMs
    const medicoRequests = crms.map(crm => this.apiService.getMedicoByCRM(crm).toPromise());
    const medicoRespostas = await Promise.all(medicoRequests);

    const medicoMap: { [crm: string]: string } = {};
    medicoRespostas.forEach(resposta => {
      if (resposta) {
        resposta.forEach(medico => {
          medicoMap[medico.CRM] = medico.Nome;
        });
      }
    });

    // Contar exames por médico
    for (const exame of exames) {
      const nomeMedico = medicoMap[exame.CRM];
      if (nomeMedico) {
        if (!contagemExamesPorMedico[nomeMedico]) {
          contagemExamesPorMedico[nomeMedico] = 0;
        }
        contagemExamesPorMedico[nomeMedico]++;
      }
    }

    return contagemExamesPorMedico;
  }

  // Renderiza o gráfico para enfermeiros
  renderizarGraficoEnfermeiro(dados: { [nome: string]: number }) {
    const nomesMedicos = Object.keys(dados);
    const quantidades = Object.values(dados);

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const container = document.getElementById('graficoContainer');
    if (container) {
      container.innerHTML = '';
      container.appendChild(canvas);
    } else {
      console.error("Contêiner de gráficos não encontrado");
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.style.backgroundColor = 'white';
    canvas.style.borderRadius = '10px';

    if (ctx) {
      new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
          labels: nomesMedicos, // Labels dos médicos
          datasets: [{
            label: 'Exames Realizados',
            data: quantidades, // Quantidade de exames realizados
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1 // Largura da borda das barras
          }]
        },
        options: {
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 0
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error("Contexto 2D do canvas não disponível.");
    }
  }

  // Gera o gráfico para pacientes
  async gerarGraficoPaciente() {
    if (!this.selectedPaciente) {
      await this.alertService.showAlert("Escolha um paciente antes de gerar o gráfico.");
      return;
    }

    const pacienteCPF: string = this.selectedPaciente.CPF;

    this.apiService.getConsultasDoPaciente(pacienteCPF).subscribe(
      consultas => {
        console.log(pacienteCPF);

        // Array de promessas para buscar as especialidades de cada consulta
        const promessasEspecialidades = consultas.map(consulta => {
          const medicoCRM = consulta.CRM;
          return this.apiService.getEspecialidadeByCRM(medicoCRM).toPromise();
        });

        // Aguardar todas as promessas serem resolvidas
        Promise.all(promessasEspecialidades).then(especialidadesArray => {
          const dadosProcessados = this.processarConsultasPaciente(consultas, especialidadesArray);
          this.renderizarGraficoPaciente(dadosProcessados);
        }).catch(error => {
          console.error('Erro ao buscar especialidades:', error);
        });
      },
      error => {
        console.error('Erro ao carregar consultas do paciente:', error);
      }
    );
  }

  // Processa as consultas dos pacientes
  processarConsultasPaciente(consultas: any[], especialidadesArray: any[]): { especialidades: string[], quantidades: number[] } {
    const contagemConsultasPorEspecialidade: { [especialidade: string]: number } = {};

    // Processar as especialidades para contagem de consultas
    for (let i = 0; i < consultas.length; i++) {
      const especialidades = especialidadesArray[i];
      const consulta = consultas[i];

      if (especialidades && especialidades.length > 0 && especialidades[0].especialidade) {
        const especialidade = especialidades[0].especialidade;

        if (!contagemConsultasPorEspecialidade[especialidade]) {
          contagemConsultasPorEspecialidade[especialidade] = 0;
        }
        contagemConsultasPorEspecialidade[especialidade]++;
      } else {
        console.error(`Especialidade do médico com CRM ${consulta.CRM} não encontrada.`);
      }
    }

    // Processamento dos resultados
    const especialidades = Object.keys(contagemConsultasPorEspecialidade);
    const quantidades = especialidades.map(especialidade => contagemConsultasPorEspecialidade[especialidade]);

    return {
      especialidades: especialidades,
      quantidades: quantidades
    };
  }

  // Renderiza o grafico dos pacientes
  renderizarGraficoPaciente(dados: { especialidades: string[], quantidades: number[] }) {
    // Cria um elemento canvas para renderizar o gráfico
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    // Encontra o contêiner onde o gráfico será adicionado
    const container = document.getElementById('graficoContainer');
    if (container) {
      container.innerHTML = ''; // Limpa qualquer conteúdo existente no contêiner
      container.appendChild(canvas); // Adiciona o novo canvas ao contêiner
    } else {
      console.error("Contêiner de gráficos não encontrado");
      return;
    }

    const ctx = canvas.getContext('2d'); // Obtém o contexto 2D do canvas para desenhar o gráfico

    // Estilos do canvas
    canvas.style.backgroundColor = 'white';
    canvas.style.borderRadius = '10px';

    if (ctx) {
      // Cria um gráfico de barras usando Chart.js
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dados.especialidades,
          datasets: [{
            label: 'Consultas por Especialidade',
            data: dados.quantidades,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true // O eixo Y começa do zero
            }
          }
        }
      });
    } else {
      console.error("Contexto 2D do canvas não disponível.");
    }
  }

  // Gera o gráfico para medicos
  async gerarGraficoMedico() {
    if (!this.dataInicio || !this.dataFim || !this.selectedMedico) {
      await this.alertService.showAlert("Preencha todos os campos para gerar o gráfico.");
      return;
    }

    const CRM = this.selectedMedico.CRM;
    const [anoInicio, mesInicio] = this.dataInicio.split('-').map(Number);
    const [anoFim, mesFim] = this.dataFim.split('-').map(Number);

    this.apiService.getConsultasDoMedico(CRM).subscribe(
      consultas => {
        const dadosProcessados = this.processarConsultasMedico(consultas, anoInicio, mesInicio, anoFim, mesFim); // Passando anos e meses
        this.renderizarGraficoMedico(dadosProcessados);
      },
      error => {
        console.error('Erro ao carregar consultas:', error);
      }
    );
  }

  // Processa as consultas dos Medicos
  processarConsultasMedico(consultas: any[], anoInicio: number, mesInicio: number, anoFim: number, mesFim: number) {
    const dadosProcessados = {
      meses: [] as string[],
      quantidades: [] as number[]
    };

    if (anoInicio === anoFim) {
      for (let mes = mesInicio; mes <= mesFim; mes++) {
        const contagemConsultasPorMes: ContagemConsultasPorMes = {};
        for (let i = 1; i <= 12; i++) {
          contagemConsultasPorMes[i] = 0;
        }

        for (const consulta of consultas) {
          const dataConsulta = new Date(consulta.data);
          const consultaAno = dataConsulta.getFullYear();
          const consultaMes = dataConsulta.getMonth() + 1;

          if (consultaAno === anoInicio && consultaMes === mes) {
            contagemConsultasPorMes[mes]++;
          }
        }

        const mesNome = new Date(anoInicio, mes - 1).toLocaleString('pt-BR', { month: 'long' });
        dadosProcessados.meses.push(`${mesNome} ${anoInicio}`);
        dadosProcessados.quantidades.push(contagemConsultasPorMes[mes] || 0);
      }
    } else {

      for (let ano = anoInicio; ano <= anoFim; ano++) {
        const contagemConsultasPorMes: ContagemConsultasPorMes = {};
        for (let mes = 1; mes <= 12; mes++) {
          contagemConsultasPorMes[mes] = 0;
        }

        for (const consulta of consultas) {
          const dataConsulta = new Date(consulta.data);
          const consultaAno = dataConsulta.getFullYear();
          const consultaMes = dataConsulta.getMonth() + 1;

          if (consultaAno === ano) {
            contagemConsultasPorMes[consultaMes]++;
          }
        }

        if (ano === anoInicio) {
          for (let mes = mesInicio; mes <= 12; mes++) {
            const mesNome = new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long' });
            dadosProcessados.meses.push(`${mesNome} ${ano}`);
            dadosProcessados.quantidades.push(contagemConsultasPorMes[mes] || 0);
          }
        } else if (ano === anoFim) {
          for (let mes = 1; mes <= mesFim; mes++) {
            const mesNome = new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long' });
            dadosProcessados.meses.push(`${mesNome} ${ano}`);
            dadosProcessados.quantidades.push(contagemConsultasPorMes[mes] || 0);
          }
        } else {
          for (let mes = 1; mes <= 12; mes++) {
            const mesNome = new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long' });
            dadosProcessados.meses.push(`${mesNome} ${ano}`);
            dadosProcessados.quantidades.push(contagemConsultasPorMes[mes] || 0);
          }
        }
      }
    }

    return dadosProcessados;
  }

  // Renderiza o grafico dos medicos
  renderizarGraficoMedico(dados: any) {
    // Cria um novo elemento canvas
    const novoCanvas = document.createElement('canvas');
    novoCanvas.width = 400; // Ajuste o tamanho conforme necessário
    novoCanvas.height = 400; // Ajuste o tamanho conforme necessário

    // Adiciona o novo canvas ao contêiner de gráficos
    const container = document.getElementById('graficoContainer');
    if (container) {
      container.innerHTML = '';
      container.appendChild(novoCanvas);
    } else {
      console.error("Contêiner de gráficos não encontrado");
      return;
    }

    const ctx = novoCanvas.getContext('2d');

    // Estilos para o novo canvas
    novoCanvas.style.backgroundColor = 'white';
    novoCanvas.style.borderRadius = '10px';

    Chart.register(LinearScale, CategoryScale, Title);

    // Cria um novo gráfico no novo canvas
    if (ctx) {
      // Se o contexto não for nulo, criar o gráfico
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dados.meses,
          datasets: [{
            label: 'Atendimentos',
            data: dados.quantidades,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error("Contexto 2D do canvas não disponível.");
    }
  }

  // Apaga o grafico gerado
  apagarGrafico() {
    const container = document.getElementById('graficoContainer');
    if (container) {
      container.innerHTML = '';
    }
  }

  // Baixa as informações em formato PDF
  baixarPDF() {
    const doc = new jsPDF();
    const title = this.selectedOption === 'Paciente' ? 'Consultas Feitas por Especialidade' :
      this.selectedOption === 'Médico' ? 'Atendimentos Feitos por Mês' :
        'Exames realizados por Médicos';

    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 10);

    let currentY = 20;

    if (this.selectedOption === 'Médico') {
      if (!this.dataInicio || !this.dataFim || !this.selectedMedico) {
        console.warn("Preencha todos os campos para gerar o PDF.");
        this.exibirToast('Preencha todos os campos antes de gerar o PDF.');
        return;
      }

      const CRM = this.selectedMedico.CRM;
      const [anoInicio, mesInicio] = this.dataInicio.split('-').map(Number);
      const [anoFim, mesFim] = this.dataFim.split('-').map(Number);

      this.apiService.getConsultasDoMedico(CRM).subscribe(
        consultas => {
          const dadosProcessados = this.processarConsultasMedico(consultas, anoInicio, mesInicio, anoFim, mesFim);

          doc.setFontSize(12);
          doc.text(`Médico: ${this.selectedMedico.Nome}`, 10, currentY);
          currentY += 10;
          doc.text(`CRM: ${this.selectedMedico.CRM}`, 10, currentY);
          currentY += 10;
          this.adicionarTabelaAoPDF(doc, dadosProcessados, currentY);
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 400;
          doc.save('relatorio_Medico.pdf');
          this.exibirToast('Relatório baixado com sucesso! Verifique sua pasta de Downloads');
        },
        error => {
          console.error('Erro ao carregar consultas:', error);
        }
      );
    } else if (this.selectedOption === 'Paciente') {
      if (!this.selectedPaciente) {
        console.warn("Escolha um paciente antes de gerar o PDF.");
        this.exibirToast('Escolha um paciente antes de gerar o PDF.');
        return;
      }

      const pacienteCPF = this.selectedPaciente.CPF;

      this.apiService.getConsultasDoPaciente(pacienteCPF).subscribe(
        consultas => {
          const promessasEspecialidades = consultas.map(consulta => {
            const medicoCRM = consulta.CRM;
            return this.apiService.getEspecialidadeByCRM(medicoCRM).toPromise();
          });

          // Aguardar todas as promessas serem resolvidas
          Promise.all(promessasEspecialidades).then(especialidadesArray => {
            // Chame a função passando os dois argumentos necessários
            const dadosProcessados = this.processarConsultasPaciente(consultas, especialidadesArray);

            doc.setFontSize(12);
            doc.text(`Paciente: ${this.selectedPaciente.Nome}`, 10, currentY);
            currentY += 10;
            doc.text(`CPF: ${this.selectedPaciente.CPF}`, 10, currentY);
            currentY += 10;

            this.adicionarTabelaDeConsultasPorPacienteAoPDF(doc, dadosProcessados, currentY);
            // Agora que a tabela foi adicionada ao documento, podemos salvar o PDF

            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            /* if (ctx) {
               this.renderizarGraficoPaciente(dadosProcessados); // Aqui você renderiza o gráfico novamente para o canvas
               const dataURL = canvas.toDataURL('image/png');
 
               // Adicionar a imagem do gráfico ao PDF
               const imgWidth = 180; // Largura da imagem no PDF
               const imgHeight = 100; // Altura da imagem no PDF
               const imgX = (pageWidth - imgWidth) / 2; // Posição X centralizada
               const imgY = currentY + 20; // Posição Y após a tabela
 
               doc.addImage(dataURL, 'PNG', imgX, imgY, imgWidth, imgHeight);
               currentY = imgY + imgHeight + 10;
 
               // Agora que a tabela e o gráfico foram adicionados ao documento, podemos salvar o PDF
               doc.save('relatorio_Medico.pdf');
             } else {
               console.error("Contexto 2D do canvas não disponível.");
             }*/
            doc.save('relatorio_paciente.pdf');
            this.exibirToast('Relatório baixado com sucesso! Verifique sua pasta de Downloads');
          }).catch(error => {
            console.error('Erro ao buscar especialidades:', error);
          });
        },
        error => {
          console.error('Erro ao carregar consultas do paciente:', error);
        }
      );
    } else {
      if (!this.selectedEnfermeiro) {
        console.warn("Escolha um enfermeiro antes de gerar o PDF.");
        this.exibirToast('Escolha um enfermeiro antes de gerar o PDF.');
        return;
      }

      const enfermeiroCOREN = this.selectedEnfermeiro.COREN;

      this.apiService.getExamesDoEnfermeiro(enfermeiroCOREN).subscribe(
        async exames => {
          // Processa os exames realizados pelo enfermeiro e aguarda a conclusão da operação
          const dadosProcessados = await this.processarExamesEnfermeiro(exames);

          doc.setFontSize(12);
          doc.text(`Enfermeiro: ${this.selectedEnfermeiro.Nome}`, 10, currentY);
          currentY += 10;
          doc.text(`COREN: ${this.selectedEnfermeiro.COREN}`, 10, currentY);
          currentY += 10;

          // Adiciona a tabela de exames realizados por médico ao PDF
          this.adicionarTabelaDeExamesPorEnfermeiroAoPDF(doc, dadosProcessados, currentY);

          // Salva o PDF
          doc.save('relatorio_Enfermeiro.pdf');
          this.exibirToast('Relatório baixado com sucesso! Verifique sua pasta de Downloads');
        },
        error => {
          console.error('Erro ao carregar exames realizados do enfermeiro:', error);
        }
      );
    }
  }

  // Adiciona a tabela com as informações do medico ao PDF
  adicionarTabelaAoPDF(doc: jsPDF, dados: any, startY: number) {
    if (!dados || !dados.meses || !dados.quantidades) {
      console.error("Dados inválidos para criar a tabela no PDF.");
      return;
    }

    const total = dados.quantidades.reduce((acc: number, val: number) => acc + val, 0);

    const rows = dados.meses.map((mes: string, index: number) => [
      mes,
      dados.quantidades[index]
    ]);

    rows.push(['Total', total]);

    doc.autoTable({
      head: [['Mês', 'Consultas']],
      body: rows,
      startY: startY
    });
  }

  // Adiciona a tabela com as informações do enfermeiro ao PDF
  adicionarTabelaDeExamesPorEnfermeiroAoPDF(doc: jsPDF, dados: { [nome: string]: number }, startY: number) {
    if (!dados || Object.keys(dados).length === 0) {
      console.error("Dados inválidos ou vazios para criar a tabela no PDF.");
      return;
    }

    // Converte o objeto de dados em um array de linhas para a tabela
    const rows = Object.entries(dados).map(([nome, quantidade]) => [nome, quantidade]);

    // Adiciona a linha de total
    const total = Object.values(dados).reduce((acc, val) => acc + val, 0);
    rows.push(['Total', total]);

    // Cria a tabela no PDF
    doc.autoTable({
      head: [['Médicos', 'Qtde. Exames Realizados']],
      body: rows,
      startY: startY
    });
  }

  // Adiciona a tabela com as informações do paciente ao PDF
  adicionarTabelaDeConsultasPorPacienteAoPDF(doc: jsPDF, dados: any, startY: number) {
    if (!dados || !dados.especialidades || !dados.quantidades) {
      console.error("Dados inválidos para criar a tabela no PDF.");
      return;
    }

    const total = dados.quantidades.reduce((acc: number, val: number) => acc + val, 0);

    const rows = dados.especialidades.map((especialidade: string, index: number) => [
      especialidade,
      dados.quantidades[index]
    ]);

    rows.push(['Total', total]);

    doc.autoTable({
      head: [['Especialidade', 'Consultas']],
      body: rows,
      startY: startY
    });
  }
}