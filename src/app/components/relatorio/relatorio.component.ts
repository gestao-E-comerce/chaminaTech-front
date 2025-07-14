import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RelatorioService } from '../../services/relatorio.service';
import { GlobalService } from '../../services/global.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../models/usuario';
import { Matriz } from '../../models/matriz';
import { take } from 'rxjs';
import { Mensagem } from '../../models/mensagem';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';
import { Venda } from '../../models/venda';
import { NgxMaskDirective } from 'ngx-mask';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { Relatorio } from '../../models/relatorio';
import { RelatorioVendaService } from '../../services/relatorioVenda.service';
import { RelatorioConsumoService } from '../../services/relatorioConsumo.service';
import { RelatorioCaixaService } from '../../services/relatorioCaixa.service';
import { Caixa } from '../../models/caixa';
import { CaixaService } from '../../services/caixa.service';
import { RelatorioSangriaService } from '../../services/relatorioSangria.service';
import { Sangria } from '../../models/sangria';
import { RelatorioSuprimentoService } from '../../services/relatorioSuprimento.service';
import { Suprimento } from '../../models/suprimento';
import { RelatorioGorjetaService } from '../../services/relatorioGorjeta.service';
import { Gorjeta } from '../../models/gorjeta';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { Estoque } from '../../models/estoque';
import { Deposito } from '../../models/deposito';
import { DepositoDescartar } from '../../models/deposito-descartar';
import { EstoqueDescartar } from '../../models/estoque-descartar';
import { RelatorioEstoqueService } from '../../services/relatorioEstoque.service';
import { RelatorioEstoqueDescartarService } from '../../services/relatorioEstoqueDescartar.service';
import { RelatorioDepositoService } from '../../services/relatorioDeposito.service';
import { RelatorioDepositoDescartarService } from '../../services/relatorioDepositoDescartar.service';
import { ProdutoMaisVendido } from '../../models/produtoMaisVendido';
import { RelatorioProdutoService } from '../../services/relatorioProduto.service';

@Component({
  selector: 'app-relatorio',
  imports: [
    FormsModule,
    NgClass,
    RouterLink,
    DatePipe,
    NgxMaskDirective,
    CurrencyPipe,
    BaseChartDirective,
  ],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.scss',
})
export class RelatorioComponent {
  listaRelatoriosOrginal: Relatorio[] = [];

  relatorioSuprimentoService = inject(RelatorioSuprimentoService);
  relatorioProdutoService = inject(RelatorioProdutoService);
  relatorioConsumoService = inject(RelatorioConsumoService);
  relatorioSangriaService = inject(RelatorioSangriaService);
  relatorioGorjetaService = inject(RelatorioGorjetaService);
  relatorioEstoqueService = inject(RelatorioEstoqueService);
  relatorioEstoqueDescartarService = inject(RelatorioEstoqueDescartarService);
  relatorioDepositoService = inject(RelatorioDepositoService);
  relatorioDepositoDescartarService = inject(RelatorioDepositoDescartarService);
  relatorioVendaService = inject(RelatorioVendaService);
  relatorioCaixaService = inject(RelatorioCaixaService);
  funcionarioService = inject(FuncionarioService);
  relatorioService = inject(RelatorioService);
  globalService = inject(GlobalService);
  caixaService = inject(CaixaService);
  produtoService = inject(ProdutoService);
  clienteService = inject(ClienteService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  router = inject(Router);
  modalRef!: NgbModalRef;

  usuario: Usuario = new Usuario();
  matriz: Matriz = new Matriz();
  relatorio: Relatorio = new Relatorio();
  funcionarios: Funcionario[] = [];
  caixas: Caixa[] = [];
  produtos: Produto[] = [];
  clientes: Cliente[] = [];
  listaVendas: Venda[] = [];
  listaVendasConsumo: Venda[] = [];
  listaCaixas: Caixa[] = [];
  listaSangrias: Sangria[] = [];
  listaSuprimentos: Suprimento[] = [];
  listaGorjetas: Gorjeta[] = [];
  listaEstoques: Estoque[] = [];
  listaDepositos: Deposito[] = [];
  listaDepositosDescatados: DepositoDescartar[] = [];
  listaEstoquesDescatados: EstoqueDescartar[] = [];
  listaProdutosMaisVendidos: ProdutoMaisVendido[] = [];

  tituloModal!: string;
  active!: any;
  urlString!: string;
  menuAberto = true;
  page!: number;
  size!: number;
  totalPages: number = 0;
  cor!: string;

  chartLabelsTotalSuprimento: string[] = [];
  chartLabelsValorTotal: string[] = [];
  chartLabelsResumoCaixa: string[] = [];
  chartLabelsTipoSangria: string[] = [];
  chartLabelsTotalSangria: string[] = [];
  chartLabelsTotalGorjeta: string[] = [];
  chartLabelsComposicaoSaldoCaixa: string[] = [];
  chartLabelsResumoEstoque: string[] = [];
  chartLabelsResumoEstoqueDescartar: string[] = [];
  chartLabelsResumoDeposito: string[] = [];
  chartLabelsResumoDepositoDescartar: string[] = [];
  chartLabelsProdutoRetirada: string[] = [];
  chartLabelsProdutoEntrega: string[] = [];
  chartLabelsProdutoBalcao: string[] = [];
  chartLabelsProdutoMesa: string[] = [];
  chartLabelsPagamento: string[] = ['Pix', 'Crédito', 'Débito', 'Dinheiro'];
  chartLabelsTipoVenda: string[] = ['Mesa', 'Balcão', 'Entrega', 'Retirada'];
  chartLabelsPeriodo: string[] = ['Madrugada', 'Manhã', 'Tarde', 'Noite'];
  backgroundColorsPadrao = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'];
  borderColorsPadrao = ['#388E3C', '#1976D2', '#FFA000', '#E64A19'];

  chartDataValorTotal: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataResumoCaixa: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataResumoEstoque: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataResumoEstoqueDescartar: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataResumoDeposito: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataResumoDepositoDescartar: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataComposicaoPagamentosCaixa: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataComposicaoDescontosCaixa: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataComposicaoGorjetasCaixa: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataComposicaoServicoCaixa: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataPagamento: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    pointBackgroundColor?: string | string[];
    pointBorderColor?: string | string[];
    fill?: boolean;
  }[] = [];
  chartDataTipoVenda: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    pointBackgroundColor?: string | string[];
    pointBorderColor?: string | string[];
    fill?: boolean;
  }[] = [];
  chartDataPeriodo: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    pointBackgroundColor?: string | string[];
    pointBorderColor?: string | string[];
    fill?: boolean;
  }[] = [];
  chartDataTipoSangria: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataTotalSangria: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataTotalSuprimento: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataTotalGorjeta: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataProdutoRetirada: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataProdutoEntrega: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataProdutoBalcao: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];
  chartDataProdutoMesa: {
    data: number[];
    label: string;
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[] = [];

  chartType: ChartType = 'pie';
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: this.cor,
        },
      },
    },
  };
  ngOnInit() {
    this.urlString = this.router.url.split('/')[1] ?? '';
    this.cor = this.globalService.getTema() === 'claro' ? '#000000' : '#ffffff';

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
          this.funcionarioService.listarTudosFuncionarios().subscribe({
            next: (lista) => {
              this.funcionarios = lista || [];
            },
            error: () => {
              this.toastr.error('Erro ao filtrar funcionarios.');
            },
          });
          this.clienteService.listarClientesPorMatrizId().subscribe({
            next: (lista) => {
              this.clientes = lista || [];
            },
            error: () => {
              this.toastr.error('Erro ao filtrar funcionarios.');
            },
          });
          this.caixaService.listarCaixas().subscribe({
            next: (lista) => {
              this.caixas = lista || [];
            },
            error: () => {
              this.toastr.error('Erro ao filtrar funcionarios.');
            },
          });
          this.produtoService.listarTudosProdutos().subscribe({
            next: (lista) => {
              this.produtos = lista || [];
            },
            error: () => {
              this.toastr.error('Erro ao filtrar funcionarios.');
            },
          });
        },
      });
    this.listaRelatorios();
  }

  alternarTipoVenda(tipo: string) {
    switch (tipo) {
      case 'MESA':
        this.relatorio.mesa = this.relatorio.mesa === true ? null : true;
        break;
      case 'BALCAO':
        this.relatorio.balcao = this.relatorio.balcao === true ? null : true;
        break;
      case 'ENTREGA':
        this.relatorio.entrega = this.relatorio.entrega === true ? null : true;
        break;
      case 'RETIRADA':
        this.relatorio.retirada =
          this.relatorio.retirada === true ? null : true;
        break;
    }
  }

  alternarTipoPagamento(tipo: string) {
    switch (tipo) {
      case 'PIX':
        this.relatorio.pix = this.relatorio.pix === true ? null : true;
        break;
      case 'CREDITO':
        this.relatorio.credito = this.relatorio.credito === true ? null : true;
        break;
      case 'DEBITO':
        this.relatorio.debito = this.relatorio.debito === true ? null : true;
        break;
      case 'DINHEIRO':
        this.relatorio.dinheiro =
          this.relatorio.dinheiro === true ? null : true;
        break;
    }
  }

  atualizarListaRelatorio(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.listaRelatorios();
  }

  deletarRelatorio(modal: any, relatorio: Relatorio) {
    this.relatorio = Object.assign({}, relatorio);

    this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Relatório';
  }
  editarRelatorio(modalRelatorio: any, relatorio: Relatorio) {
    this.relatorio = Object.assign({}, relatorio);
    this.modalRef = this.modalService.open(modalRelatorio, { size: 'md' });
    this.tituloModal = 'Editar Relatório';
  }

  confirmarDeletarRelatorio(relatorio: Relatorio) {
    this.relatorioService.deletar(relatorio.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.atualizarListaRelatorio(mensagem);
        this.fecharRelatorio();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  fecharRelatorio() {
    this.modalService.dismissAll();
    this.relatorio = new Relatorio();
    this.chartDataValorTotal = [];
    this.chartDataResumoCaixa = [];
    this.chartDataResumoEstoque = [];
    this.chartDataResumoEstoqueDescartar = [];
    this.chartDataResumoDeposito = [];
    this.chartDataResumoDepositoDescartar = [];
    this.chartDataComposicaoPagamentosCaixa = [];
    this.chartDataComposicaoDescontosCaixa = [];
    this.chartDataComposicaoGorjetasCaixa = [];
    this.chartDataComposicaoServicoCaixa = [];
    this.chartDataPagamento = [];
    this.chartDataTipoVenda = [];
    this.chartDataPeriodo = [];
    this.chartDataTipoSangria = [];
    this.chartDataTotalSangria = [];
    this.chartDataTotalSuprimento = [];
    this.chartDataTotalGorjeta = [];
    this.chartDataProdutoRetirada = [];
    this.chartDataProdutoEntrega = [];
    this.chartDataProdutoBalcao = [];
    this.chartDataProdutoMesa = [];



    this.listaVendas = [];
    this.listaVendasConsumo = [];
    this.listaCaixas = [];
    this.listaSangrias = [];
    this.listaSuprimentos = [];
    this.listaGorjetas = [];
    this.listaEstoques = [];
    this.listaDepositos = [];
    this.listaDepositosDescatados = [];
    this.listaEstoquesDescatados = [];
    this.listaProdutosMaisVendidos = [];
  }
  zerarRelatorio(tipo: string | null) {
    this.fecharRelatorio();
    this.relatorio.tipoConsulta = tipo;
  }

  listaRelatorios() {
    this.relatorioService.listarRelatorios().subscribe({
      next: (listaRelatorios) => {
        this.listaRelatoriosOrginal = listaRelatorios;
      },
    });
  }

  selecionarRelatorio(relatorio: any) {
    this.relatorio = relatorio;
    this.active = relatorio;
    this.menuAberto = false;
    this.aplicarRelatorio();
  }

  setPage(i: number) {
    if (this.totalPages > 1) {
      if (i >= 0 && i < this.totalPages) {
        this.page = i;
        this.relatorio.tamanho = this.size;
        this.relatorio.pagina = this.page;
        this.gerarRelatorioVenda(this.relatorio);
      }
    }
  }
  alterarTamanho(event: Event) {
    if (this.totalPages > 1) {
      const valor = +(event.target as HTMLSelectElement).value;
      this.size = valor;
      this.page = 0;
      this.relatorio.tamanho = this.size;
      this.relatorio.pagina = this.page;
      this.gerarRelatorioTipo(this.relatorio);
    }
  }
  gerarRelatorioTipo(relatorio: Relatorio) {
    if (relatorio.tipoConsulta === 'VENDA') {
      this.gerarRelatorioVenda(relatorio);
    } else if (relatorio.tipoConsulta === 'CONSUMO') {
      this.gerarRelatorioConsumo(relatorio);
    } else if (relatorio.tipoConsulta === 'CAIXA') {
      this.gerarRelatorioCaixa(relatorio);
    } else if (relatorio.tipoConsulta === 'SANGRIA') {
      this.gerarRelatorioSangria(relatorio);
    } else if (relatorio.tipoConsulta === 'SUPRIMENTO') {
      this.gerarRelatorioSuprimento(relatorio);
    } else if (relatorio.tipoConsulta === 'GORJETA') {
      this.gerarRelatorioGorjeta(relatorio);
    } else if (relatorio.tipoConsulta === 'ESTOQUE') {
      this.gerarRelatorioEstoque(relatorio);
    } else if (relatorio.tipoConsulta === 'ESTOQUEDESCARTAR') {
      this.gerarRelatorioEstoqueDescartar(relatorio);
    } else if (relatorio.tipoConsulta === 'DEPOSITO') {
      this.gerarRelatorioDeposito(relatorio);
    } else if (relatorio.tipoConsulta === 'DEPOSITODESCARTAR') {
      this.gerarRelatorioDepositoDescartar(relatorio);
    }
  }
  pagesVisiveis(): number[] {
    const total = this.totalPages;
    const atual = this.page;

    const maxVisiveis = 5;
    let inicio = Math.max(0, atual - Math.floor(maxVisiveis / 2));
    let fim = inicio + maxVisiveis;

    if (fim > total) {
      fim = total;
      inicio = Math.max(0, fim - maxVisiveis);
    }

    const intervalo = [];
    for (let i = inicio; i < fim; i++) {
      intervalo.push(i);
    }
    return intervalo;
  }

  convertStringToDate(value: string): Date | null {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length !== 8 && numeros.length !== 12) {
      this.toastr.error('Formato inválido: use DD/MM/YYYY ou DD/MM/YYYY HH:MM');
      return null;
    }

    const dia = parseInt(numeros.substring(0, 2), 10);
    const mes = parseInt(numeros.substring(2, 4), 10);
    const ano = parseInt(numeros.substring(4, 8), 10);
    const hora =
      numeros.length === 12 ? parseInt(numeros.substring(8, 10), 10) : 0;
    const minuto =
      numeros.length === 12 ? parseInt(numeros.substring(10, 12), 10) : 0;

    if (dia < 1 || dia > 31) {
      this.toastr.error('Dia inválido (1-31)');
      return null;
    }
    if (mes < 1 || mes > 12) {
      this.toastr.error('Mês inválido (1-12)');
      return null;
    }
    if (hora < 0 || hora > 23) {
      this.toastr.error('Hora inválida (0-23)');
      return null;
    }
    if (minuto < 0 || minuto > 59) {
      this.toastr.error('Minuto inválido (0-59)');
      return null;
    }

    const data = new Date(ano, mes - 1, dia, hora, minuto);

    if (
      isNaN(data.getTime()) ||
      data.getDate() !== dia ||
      data.getMonth() + 1 !== mes ||
      data.getFullYear() !== ano ||
      data.getHours() !== hora ||
      data.getMinutes() !== minuto
    ) {
      this.toastr.error('Data inválida no calendário');
      return null;
    }

    return data;
  }

  aplicarRelatorio() {
    if (!this.relatorio.tipoConsulta?.trim()) {
      this.toastr.error('Tipo de objeto obrigatório!');
      return;
    }

    let di: Date | undefined;
    let df: Date | undefined;

    if (this.relatorio.dataInicio) {
      const dataConvertida = this.convertStringToDate(
        this.relatorio.dataInicio
      );
      if (!dataConvertida) return; // Interrompe se inválida
      di = dataConvertida;
    }

    if (this.relatorio.dataFim) {
      const dataConvertida = this.convertStringToDate(this.relatorio.dataFim);
      if (!dataConvertida) return; // Interrompe se inválida
      df = dataConvertida;
    }

    if (di && df && df < di) {
      this.toastr.error('Data Fim não pode ser anterior à Data Início');
      return;
    }
    if (!this.relatorio.nome?.trim()) {
      this.relatorio.nome = 'Relatório ' + this.relatorio.tipoConsulta;
    }
    this.relatorio.nome = this.relatorio.nome.toUpperCase();
    this.relatorioService.save(this.relatorio).subscribe({
      next: (relatorioSalvo) => {
        this.listaRelatorios();
        console.log(relatorioSalvo);
        this.relatorio = relatorioSalvo;
        if (relatorioSalvo.tipoConsulta === 'VENDA') {
          this.gerarGraficoVenda(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'CONSUMO') {
          this.gerarGraficoConsumo(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'CAIXA') {
          this.gerarGraficoCaixa(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'SANGRIA') {
          this.gerarGraficoSangria(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'SUPRIMENTO') {
          this.gerarGraficoSuprimento(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'GORJETA') {
          this.gerarGraficoGorjeta(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'ESTOQUE') {
          this.gerarGraficoEstoque(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'ESTOQUEDESCARTAR') {
          this.gerarGraficoEstoqueDescartar(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'DEPOSITO') {
          this.gerarGraficoDeposito(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'DEPOSITODESCARTAR') {
          this.gerarGraficoDepositoDescartar(relatorioSalvo);
        } else if (relatorioSalvo.tipoConsulta === 'PRODUTO') {
          this.gerarGraficoProduto(relatorioSalvo);
        }
        this.modalService.dismissAll();
      },
      error: (erro) => {
        this.toastr.error(erro.error);
      },
    });
  }
  trocarAgrupamento(agrupamento: string) {
    this.relatorio.agrupamento = agrupamento;
    if (this.relatorio.tipoConsulta === 'VENDA') {
      this.gerarGraficoValorTotalVenda(this.relatorio);
    } else if (this.relatorio.tipoConsulta === 'CONSUMO') {
      this.gerarGraficoValorTotalConsumo(this.relatorio);
    }
  }
  mudarTipoGrafico(tipo: ChartType) {
    this.chartType = tipo;
    const esconderEscalas = tipo === 'pie' || tipo === 'doughnut';

    this.chartOptions = {
      ...this.chartOptions,
      scales: esconderEscalas
        ? undefined
        : {
            x: {
              display: true,
              ticks: {
                color: this.cor,
              },
              grid: {
                color: '#444',
              },
            },
            y: {
              display: true,
              ticks: {
                color: this.cor,
              },
              grid: {
                color: '#444',
              },
            },
          },
    };
  }
  gerarGraficoVenda(relatorio: Relatorio) {
    this.gerarRelatorioVenda(relatorio);
    this.gerarGraficoValorTotalVenda(relatorio);
    this.gerarGraficoPagamentoVenda(relatorio);
    this.gerarGraficoTipoVendaVenda(relatorio);
    this.gerarGraficoPeriodoVenda(relatorio);
  }

  gerarGraficoCaixa(relatorio: Relatorio) {
    this.gerarRelatorioCaixa(relatorio);
    this.gerarGraficoResumoCaixa(relatorio);
    this.gerarGraficoComposicaoSaldoCaixa(relatorio);
  }

  gerarGraficoSangria(relatorio: Relatorio) {
    this.gerarRelatorioSangria(relatorio);
    this.gerarGraficoTipoSangria(relatorio);
    this.gerarGraficoTotalSangria(relatorio);
  }
  gerarGraficoSuprimento(relatorio: Relatorio) {
    this.gerarRelatorioSuprimento(relatorio);
    this.gerarGraficoTotalSuprimento(relatorio);
  }

  gerarGraficoGorjeta(relatorio: Relatorio) {
    this.gerarRelatorioGorjeta(relatorio);
    this.gerarGraficoTotalGorjeta(relatorio);
    this.gerarGraficoPagamentoGorjeta(relatorio);
  }

  gerarGraficoEstoque(relatorio: Relatorio) {
    this.gerarRelatorioEstoque(relatorio);
    this.gerarGraficoResumoEstoque(relatorio);
  }

  gerarGraficoEstoqueDescartar(relatorio: Relatorio) {
    this.gerarRelatorioEstoqueDescartar(relatorio);
    this.gerarGraficoResumoEstoqueDescartar(relatorio);
  }

  gerarGraficoDeposito(relatorio: Relatorio) {
    this.gerarRelatorioDeposito(relatorio);
    this.gerarGraficoResumoDeposito(relatorio);
  }

  gerarGraficoDepositoDescartar(relatorio: Relatorio) {
    this.gerarRelatorioDepositoDescartar(relatorio);
    this.gerarGraficoResumoDepositoDescartar(relatorio);
  }

  gerarGraficoProduto(relatorio: Relatorio) {
    this.gerarRelatorioProduto(relatorio);
    this.gerarGraficoProdutoRetirada(relatorio);
    this.gerarGraficoProdutoEntrega(relatorio);
    this.gerarGraficoProdutoBalcao(relatorio);
    this.gerarGraficoProdutoMesa(relatorio);
  }

  gerarGraficoConsumo(relatorio: Relatorio) {
    this.gerarRelatorioConsumo(relatorio);
    this.gerarGraficoValorTotalConsumo(relatorio);
    this.gerarGraficoTipoVendaConsumo(relatorio);
  }

  gerarRelatorioConsumo(relatorio: Relatorio) {
    this.relatorioConsumoService.gerarRelatorioConsumo(relatorio).subscribe({
      next: (resultado) => {
        this.listaVendasConsumo = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
        if (resultado.content.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  gerarRelatorioVenda(relatorio: Relatorio) {
    this.relatorioVendaService.gerarRelatorioVenda(relatorio).subscribe({
      next: (resultado) => {
        this.listaVendas = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
        if (resultado.content.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  gerarRelatorioSangria(relatorio: Relatorio) {
    if (relatorio.tipo != 'FUNCIONARIO') {
      relatorio.funcionarioNome = null;
    }
    this.relatorioSangriaService.gerarRelatorioSangria(relatorio).subscribe({
      next: (resultado) => {
        this.listaSangrias = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
        if (resultado.content.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  gerarRelatorioSuprimento(relatorio: Relatorio) {
    this.relatorioSuprimentoService
      .gerarRelatorioSuprimento(relatorio)
      .subscribe({
        next: (resultado) => {
          this.listaSuprimentos = resultado.content;
          this.page = resultado.number;
          this.size = resultado.size;
          this.totalPages = resultado.totalPages;
          if (resultado.content.length === 0) {
            this.toastr.warning('Nenhum resultado encontrado!');
          }
        },
        error: (err) => {
          this.toastr.error('Erro ao gerar relatório.');
        },
      });
  }
  gerarRelatorioGorjeta(relatorio: Relatorio) {
    this.relatorioGorjetaService.gerarRelatorioGorjeta(relatorio).subscribe({
      next: (resultado) => {
        this.listaGorjetas = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
        if (resultado.content.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  gerarRelatorioCaixa(relatorio: Relatorio) {
    this.relatorioCaixaService.gerarRelatorioCaixa(relatorio).subscribe({
      next: (resultado) => {
        this.listaCaixas = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
        if (resultado.content.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  gerarRelatorioEstoque(relatorio: Relatorio) {
    this.relatorioEstoqueService.gerarRelatorioEstoque(relatorio).subscribe({
      next: (resultado) => {
        this.listaEstoques = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
        if (resultado.content.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  gerarRelatorioEstoqueDescartar(relatorio: Relatorio) {
    this.relatorioEstoqueDescartarService
      .gerarRelatorioEstoqueDescartar(relatorio)
      .subscribe({
        next: (resultado) => {
          this.listaEstoquesDescatados = resultado.content;
          this.page = resultado.number;
          this.size = resultado.size;
          this.totalPages = resultado.totalPages;
          if (resultado.content.length === 0) {
            this.toastr.warning('Nenhum resultado encontrado!');
          }
        },
        error: (err) => {
          this.toastr.error('Erro ao gerar relatório.');
        },
      });
  }
  gerarRelatorioDeposito(relatorio: Relatorio) {
    this.relatorioDepositoService.gerarRelatorioDeposito(relatorio).subscribe({
      next: (resultado) => {
        this.listaDepositos = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
        if (resultado.content.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }

  gerarRelatorioDepositoDescartar(relatorio: Relatorio) {
    this.relatorioDepositoDescartarService
      .gerarRelatorioDepositoDescartar(relatorio)
      .subscribe({
        next: (resultado) => {
          this.listaDepositosDescatados = resultado.content;
          this.page = resultado.number;
          this.size = resultado.size;
          this.totalPages = resultado.totalPages;
          if (resultado.content.length === 0) {
            this.toastr.warning('Nenhum resultado encontrado!');
          }
        },
        error: (err) => {
          this.toastr.error('Erro ao gerar relatório.');
        },
      });
  }
  gerarRelatorioProduto(relatorio: Relatorio) {
    this.relatorioProdutoService.gerarRelatorioProduto(relatorio).subscribe({
      next: (resultado) => {
        this.listaProdutosMaisVendidos = resultado;
        if (resultado.length === 0) {
          this.toastr.warning('Nenhum resultado encontrado!');
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  gerarGraficoPagamentoVenda(relatorio: Relatorio) {
    this.relatorioVendaService.gerarGraficoPagamentoVenda(relatorio).subscribe({
      next: (dados) => {
        this.chartDataPagamento = [
          {
            data: [
              dados.pix || 0,
              dados.credito || 0,
              dados.debito || 0,
              dados.dinheiro || 0,
            ],
            label: 'Total',
            backgroundColor: this.backgroundColorsPadrao,
            borderColor: '#666',
            pointBackgroundColor: this.backgroundColorsPadrao,
            fill: false,
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico.');
      },
    });
  }
  gerarGraficoTipoVendaVenda(relatorio: Relatorio) {
    this.relatorioVendaService.gerarGraficoTipoVendaVenda(relatorio).subscribe({
      next: (dados) => {
        this.chartDataTipoVenda = [
          {
            data: [
              dados.mesa || 0,
              dados.balcao || 0,
              dados.entrega || 0,
              dados.retirada || 0,
            ],
            label: 'Vendas',
            backgroundColor: this.backgroundColorsPadrao,
            borderColor: '#666',
            pointBackgroundColor: this.backgroundColorsPadrao,
            fill: false,
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico.');
      },
    });
  }
  gerarGraficoPeriodoVenda(relatorio: Relatorio) {
    this.relatorioVendaService.gerarGraficoPeriodoVenda(relatorio).subscribe({
      next: (dados) => {
        this.chartDataPeriodo = [
          {
            data: [
              dados.madrugada || 0,
              dados.manha || 0,
              dados.tarde || 0,
              dados.noite || 0,
            ],
            label: 'Vendas',
            backgroundColor: this.backgroundColorsPadrao,
            borderColor: '#666',
            pointBackgroundColor: this.backgroundColorsPadrao,
            fill: false,
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico.');
      },
    });
  }
  gerarGraficoValorTotalVenda(relatorio: Relatorio) {
    this.relatorioVendaService
      .gerarGraficoValorTotalVenda(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsValorTotal = dados.map((item) => item.periodo);
          this.chartDataValorTotal = [
            {
              data: dados.map((item) => item.valorTotal),
              label: 'Valor Total',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
            {
              data: dados.map((item) => item.valorBruto),
              label: 'Valor Bruto',
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
            },
            {
              data: dados.map((item) => item.valorServico),
              label: 'Serviço',
              backgroundColor: '#FFC107',
              borderColor: '#FFA000',
            },
            {
              data: dados.map((item) => item.taxaEntrega),
              label: 'Taxa de Entrega',
              backgroundColor: '#FF5722',
              borderColor: '#E64A19',
            },
            {
              data: dados.map((item) => item.desconto),
              label: 'Desconto',
              backgroundColor: '#9C27B0',
              borderColor: '#7B1FA2',
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico.');
        },
      });
  }
  gerarGraficoTipoVendaConsumo(relatorio: Relatorio) {
    this.relatorioConsumoService
      .gerarGraficoTipoVendaConsumo(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartDataTipoVenda = [
            {
              data: [
                dados.mesa || 0,
                dados.balcao || 0,
                dados.entrega || 0,
                dados.retirada || 0,
              ],
              label: 'Vendas',
              backgroundColor: this.backgroundColorsPadrao,
              borderColor: '#666',
              pointBackgroundColor: this.backgroundColorsPadrao,
              fill: false,
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico.');
        },
      });
  }
  gerarGraficoValorTotalConsumo(relatorio: Relatorio) {
    this.relatorioConsumoService
      .gerarGraficoValorTotalConsumo(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsValorTotal = dados.map((item) => item.periodo);
          this.chartDataValorTotal = [
            {
              data: dados.map((item) => item.valorTotal),
              label: 'Valor Total',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico.');
        },
      });
  }
  gerarGraficoResumoCaixa(relatorio: Relatorio) {
    this.relatorioCaixaService.gerarGraficoResumoCaixa(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsResumoCaixa = dados.map((item) => item.dataAbertura);
        this.chartDataResumoCaixa = [
          {
            data: dados.map((item) => item.abertura),
            label: 'Abertura',
            backgroundColor: '#4CAF50',
            borderColor: '#388E3C',
          },
          {
            data: dados.map((item) => item.suprimentos),
            label: 'Suprimentos',
            backgroundColor: '#2196F3',
            borderColor: '#1976D2',
          },
          {
            data: dados.map((item) => item.vendas),
            label: 'Vendas',
            backgroundColor: '#FF9800',
            borderColor: '#F57C00',
          },
          {
            data: dados.map((item) => item.servico),
            label: 'Serviço',
            backgroundColor: '#9C27B0',
            borderColor: '#7B1FA2',
          },
          {
            data: dados.map((item) => item.gorjetas),
            label: 'Gorjetas',
            backgroundColor: '#00BCD4',
            borderColor: '#0097A7',
          },
          {
            data: dados.map((item) => item.sangrias),
            label: 'Sangrias',
            backgroundColor: '#F44336',
            borderColor: '#D32F2F',
          },
          {
            data: dados.map((item) => item.descontos),
            label: 'Descontos',
            backgroundColor: '#795548',
            borderColor: '#5D4037',
          },
          {
            data: dados.map((item) => item.saldoDefinido),
            label: 'Saldo Definido',
            backgroundColor: '#607D8B',
            borderColor: '#455A64',
          },
          {
            data: dados.map((item) => item.saldoFinal),
            label: 'Saldo Final',
            backgroundColor: '#8BC34A',
            borderColor: '#689F38',
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico.');
      },
    });
  }
  gerarGraficoComposicaoSaldoCaixa(relatorio: Relatorio) {
    this.relatorioCaixaService
      .gerarGraficoComposicaoSaldoCaixa(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsComposicaoSaldoCaixa = dados.map(
            (item) => item.dataAbertura
          );

          this.chartDataComposicaoPagamentosCaixa = [
            {
              data: dados.map((item) => item.pagamentoPix),
              label: 'Pagamento Pix',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
            {
              data: dados.map((item) => item.pagamentoCredito),
              label: 'Pagamento Crédito',
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
            },
            {
              data: dados.map((item) => item.pagamentoDebito),
              label: 'Pagamento Débito',
              backgroundColor: '#FFC107',
              borderColor: '#FFA000',
            },
            {
              data: dados.map((item) => item.pagamentoDinheiro),
              label: 'Pagamento Dinheiro',
              backgroundColor: '#FF5722',
              borderColor: '#E64A19',
            },
          ];

          this.chartDataComposicaoDescontosCaixa = [
            {
              data: dados.map((item) => item.descontoPix),
              label: 'Desconto Pix',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
            {
              data: dados.map((item) => item.descontoCredito),
              label: 'Desconto Crédito',
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
            },
            {
              data: dados.map((item) => item.descontoDebito),
              label: 'Desconto Débito',
              backgroundColor: '#FFC107',
              borderColor: '#FFA000',
            },
            {
              data: dados.map((item) => item.descontoDinheiro),
              label: 'Desconto Dinheiro',
              backgroundColor: '#FF5722',
              borderColor: '#E64A19',
            },
          ];

          this.chartDataComposicaoGorjetasCaixa = [
            {
              data: dados.map((item) => item.gorjetaPix),
              label: 'Gorjeta Pix',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
            {
              data: dados.map((item) => item.gorjetaCredito),
              label: 'Gorjeta Crédito',
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
            },
            {
              data: dados.map((item) => item.gorjetaDebito),
              label: 'Gorjeta Débito',
              backgroundColor: '#FFC107',
              borderColor: '#FFA000',
            },
            {
              data: dados.map((item) => item.gorjetaDinheiro),
              label: 'Gorjeta Dinheiro',
              backgroundColor: '#FF5722',
              borderColor: '#E64A19',
            },
          ];

          this.chartDataComposicaoServicoCaixa = [
            {
              data: dados.map((item) => item.servicoPix),
              label: 'Serviço Pix',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
            {
              data: dados.map((item) => item.servicoCredito),
              label: 'Serviço Crédito',
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
            },
            {
              data: dados.map((item) => item.servicoDebito),
              label: 'Serviço Débito',
              backgroundColor: '#FFC107',
              borderColor: '#FFA000',
            },
            {
              data: dados.map((item) => item.servicoDinheiro),
              label: 'Serviço Dinheiro',
              backgroundColor: '#FF5722',
              borderColor: '#E64A19',
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico de composição de saldo.');
        },
      });
  }
  gerarGraficoTipoSangria(relatorio: Relatorio) {
    this.relatorioSangriaService.gerarGraficoTipoSangria(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsTipoSangria = dados.map((item) => item.tipo);
        this.chartDataTipoSangria = [
          {
            data: dados.map((item) => item.total),
            label: 'Total por Tipo',
            backgroundColor: this.backgroundColorsPadrao,
            borderColor: this.borderColorsPadrao,
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico de tipo de sangria.');
      },
    });
  }
  gerarGraficoTotalSangria(relatorio: Relatorio) {
    this.relatorioSangriaService.gerarGraficoTotalSangria(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsTotalSangria = dados.map(
          (item) => `Caixa ${item.caixaId}`
        );
        this.chartDataTotalSangria = [
          {
            data: dados.map((item) => item.total),
            label: 'Total por Caixa',
            backgroundColor: this.backgroundColorsPadrao,
            borderColor: this.borderColorsPadrao,
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico de total por caixa.');
      },
    });
  }
  gerarGraficoTotalSuprimento(relatorio: Relatorio) {
    this.relatorioSuprimentoService
      .gerarGraficoTotalSuprimento(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsTotalSuprimento = dados.map(
            (item) => `Caixa ${item.caixaId}`
          );
          this.chartDataTotalSuprimento = [
            {
              data: dados.map((item) => item.total),
              label: 'Total por Caixa',
              backgroundColor: this.backgroundColorsPadrao,
              borderColor: this.borderColorsPadrao,
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico de total por caixa.');
        },
      });
  }
  gerarGraficoTotalGorjeta(relatorio: Relatorio) {
    this.relatorioGorjetaService.gerarGraficoTotalGorjeta(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsTotalGorjeta = dados.map(
          (item) => `Caixa ${item.caixaId}`
        );
        this.chartDataTotalGorjeta = [
          {
            data: dados.map((item) => item.total),
            label: 'Total por Caixa',
            backgroundColor: this.backgroundColorsPadrao,
            borderColor: this.borderColorsPadrao,
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico de total por caixa.');
      },
    });
  }
  gerarGraficoPagamentoGorjeta(relatorio: Relatorio) {
    this.relatorioGorjetaService
      .gerarGraficoPagamentoGorjeta(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartDataPagamento = [
            {
              data: [
                dados.pix || 0,
                dados.credito || 0,
                dados.debito || 0,
                dados.dinheiro || 0,
              ],
              label: 'Total',
              backgroundColor: this.backgroundColorsPadrao,
              borderColor: '#666',
              pointBackgroundColor: this.backgroundColorsPadrao,
              fill: false,
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico.');
        },
      });
  }
  gerarGraficoResumoEstoque(relatorio: Relatorio) {
    this.relatorioEstoqueService
      .gerarGraficoResumoEstoque(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsResumoEstoque = dados.map((item) => item.produtoNome);
          this.chartDataResumoEstoque = [
            {
              data: dados.map((item) => item.quantidadeTotal),
              label: 'Quantidade Total',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
            {
              data: dados.map((item) => item.quantidadeVendida),
              label: 'Quantidade Vendida',
              backgroundColor: '#FF9800',
              borderColor: '#F57C00',
            },
            {
              data: dados.map((item) => item.quantidadeDisponivel),
              label: 'Quantidade Disponível',
              backgroundColor: '#00BCD4',
              borderColor: '#0097A7',
            },
            {
              data: dados.map((item) => item.valorTotal),
              label: 'Valor Total',
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico de estoque.');
        },
      });
  }
  gerarGraficoResumoDeposito(relatorio: Relatorio) {
    this.relatorioDepositoService
      .gerarGraficoResumoDeposito(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsResumoDeposito = dados.map(
            (item) => item.materiaNome
          );
          this.chartDataResumoDeposito = [
            {
              data: dados.map((item) => item.quantidadeTotal),
              label: 'Quantidade Total',
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
            },
            {
              data: dados.map((item) => item.quantidadeVendida),
              label: 'Quantidade Vendida',
              backgroundColor: '#FF9800',
              borderColor: '#F57C00',
            },
            {
              data: dados.map((item) => item.quantidadeDisponivel),
              label: 'Quantidade Disponível',
              backgroundColor: '#00BCD4',
              borderColor: '#0097A7',
            },
            {
              data: dados.map((item) => item.valorTotal),
              label: 'Valor Total',
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico de depósito.');
        },
      });
  }
  gerarGraficoResumoEstoqueDescartar(relatorio: Relatorio) {
    this.relatorioEstoqueDescartarService
      .gerarGraficoResumoEstoqueDescartar(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsResumoEstoqueDescartar = dados.map(
            (item) => item.produtoNome
          );
          this.chartDataResumoEstoqueDescartar = [
            {
              data: dados.map((item) => item.quantidadeDescartada),
              label: 'Quantidade Descartada',
              backgroundColor: '#F44336',
              borderColor: '#D32F2F',
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico de estoque descartado.');
        },
      });
  }
  gerarGraficoResumoDepositoDescartar(relatorio: Relatorio) {
    this.relatorioDepositoDescartarService
      .gerarGraficoResumoDepositoDescartar(relatorio)
      .subscribe({
        next: (dados) => {
          this.chartLabelsResumoDepositoDescartar = dados.map(
            (item) => item.materiaNome
          );
          this.chartDataResumoDepositoDescartar = [
            {
              data: dados.map((item) => item.quantidadeDescartada),
              label: 'Quantidade Descartada',
              backgroundColor: '#F44336',
              borderColor: '#D32F2F',
            },
          ];
        },
        error: () => {
          this.toastr.error('Erro ao gerar gráfico de depósito descartado.');
        },
      });
  }
  gerarGraficoProdutoRetirada(relatorio: Relatorio) {
    this.relatorioProdutoService.graficoProdutoRetirada(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsProdutoRetirada = dados.map((item) => item.produtoNome);

        this.chartDataProdutoRetirada = [
          {
            data: dados.map((item) => item.quantidadeTotal),
            label: 'Quantidade Vendida',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
          },
          {
            data: dados.map((item) => item.valorTotal),
            label: 'Valor Total (R$)',
            backgroundColor: '#66BB6A',
            borderColor: '#388E3C',
          },
          {
            data: dados.map((item) => item.totalVendas),
            label: 'Total de Vendas',
            backgroundColor: '#FFCA28',
            borderColor: '#F57F17',
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico de retirada.');
      },
    });
  }
  gerarGraficoProdutoEntrega(relatorio: Relatorio) {
    this.relatorioProdutoService.graficoProdutoEntrega(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsProdutoEntrega = dados.map((item) => item.produtoNome);

        this.chartDataProdutoEntrega = [
          {
            data: dados.map((item) => item.quantidadeTotal),
            label: 'Quantidade Vendida',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
          },
          {
            data: dados.map((item) => item.valorTotal),
            label: 'Valor Total (R$)',
            backgroundColor: '#66BB6A',
            borderColor: '#388E3C',
          },
          {
            data: dados.map((item) => item.totalVendas),
            label: 'Total de Vendas',
            backgroundColor: '#FFCA28',
            borderColor: '#F57F17',
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico de retirada.');
      },
    });
  }
  gerarGraficoProdutoBalcao(relatorio: Relatorio) {
    this.relatorioProdutoService.graficoProdutoBalcao(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsProdutoBalcao = dados.map((item) => item.produtoNome);

        this.chartDataProdutoBalcao = [
          {
            data: dados.map((item) => item.quantidadeTotal),
            label: 'Quantidade Vendida',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
          },
          {
            data: dados.map((item) => item.valorTotal),
            label: 'Valor Total (R$)',
            backgroundColor: '#66BB6A',
            borderColor: '#388E3C',
          },
          {
            data: dados.map((item) => item.totalVendas),
            label: 'Total de Vendas',
            backgroundColor: '#FFCA28',
            borderColor: '#F57F17',
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico de retirada.');
      },
    });
  }
  gerarGraficoProdutoMesa(relatorio: Relatorio) {
    this.relatorioProdutoService.graficoProdutoMesa(relatorio).subscribe({
      next: (dados) => {
        this.chartLabelsProdutoMesa = dados.map((item) => item.produtoNome);

        this.chartDataProdutoMesa = [
          {
            data: dados.map((item) => item.quantidadeTotal),
            label: 'Quantidade Vendida',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
          },
          {
            data: dados.map((item) => item.valorTotal),
            label: 'Valor Total (R$)',
            backgroundColor: '#66BB6A',
            borderColor: '#388E3C',
          },
          {
            data: dados.map((item) => item.totalVendas),
            label: 'Total de Vendas',
            backgroundColor: '#FFCA28',
            borderColor: '#F57F17',
          },
        ];
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico de retirada.');
      },
    });
  }
}
