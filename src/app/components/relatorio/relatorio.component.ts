import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Relatorio } from '../../models/relatorio';
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

@Component({
    selector: 'app-relatorio',
    imports: [
        FormsModule,
        NgClass,
        RouterLink,
        DatePipe,
        NgxMaskDirective,
        CurrencyPipe,
    ],
    templateUrl: './relatorio.component.html',
    styleUrl: './relatorio.component.scss'
})
export class RelatorioComponent {
  listaRelatoriosOrginal: Relatorio[] = [];

  funcionarioService = inject(FuncionarioService);
  relatorioService = inject(RelatorioService);
  globalService = inject(GlobalService);
  clienteService = inject(ClienteService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  router = inject(Router);
  modalRef!: NgbModalRef;

  usuario: Usuario = new Usuario();
  matriz: Matriz = new Matriz();
  relatorio: Relatorio = new Relatorio();
  funcionarios: Funcionario[] = [];
  clientes: Cliente[] = [];
  listaVendas: Venda[] = [];

  tituloModal!: string;
  active!: any;
  relatorioSelecionado!: Relatorio | null;
  urlString!: string;
  menuAberto = true;
  indice!: number;
  page!: number;
  size!: number;
  totalPages: number = 0;
  dadosGrafico: any[] = [];

  ngOnInit() {
    this.urlString = this.router.url.split('/')[1] ?? '';

    this.listaRelatorios();

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
          this.funcionarioService.listarFuncionarios().subscribe({
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
        },
      });
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
    this.relatorioSelecionado = null;
  }

  deletarRelatorio(modal: any, relatorio: Relatorio, indice: number) {
    this.relatorio = Object.assign({}, relatorio);
    this.indice = indice;

    this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Relatório';
  }

  confirmarDeletarRelatorio(relatorio: Relatorio) {
    this.relatorioService.deletar(relatorio.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.atualizarListaRelatorio(mensagem);
        this.modalService.dismissAll();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
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
  }

  convertStringToDate(value: string): Date | null {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length !== 8 && numeros.length !== 12) {
      throw new Error('Formato inválido: use ddMMyyyy ou ddMMyyyyHHmm');
    }

    const dia = parseInt(numeros.substring(0, 2), 10);
    const mes = parseInt(numeros.substring(2, 4), 10);
    const ano = parseInt(numeros.substring(4, 8), 10);
    const hora =
      numeros.length === 12 ? parseInt(numeros.substring(8, 10), 10) : 0;
    const minuto =
      numeros.length === 12 ? parseInt(numeros.substring(10, 12), 10) : 0;

    const data = new Date(ano, mes - 1, dia, hora, minuto);

    if (
      isNaN(data.getTime()) ||
      data.getDate() !== dia ||
      data.getMonth() + 1 !== mes ||
      data.getFullYear() !== ano ||
      data.getHours() !== hora ||
      data.getMinutes() !== minuto
    ) {
      throw new Error('Data inválida');
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
      if (!dataConvertida) throw new Error('Data Início inválida');
      di = dataConvertida;
    }

    if (this.relatorio.dataFim) {
      const dataConvertida = this.convertStringToDate(this.relatorio.dataFim);
      if (!dataConvertida) throw new Error('Data Fim inválida');
      df = dataConvertida;
    }

    if (di && df && df < di) {
      this.toastr.error('Data Fim não pode ser anterior à Data Início');
      return;
    }
    console.log('Relatorio:', this.relatorio);
    this.relatorio.nome = 'Relatório ' + this.relatorio.tipoConsulta;
    this.relatorioService.save(this.relatorio).subscribe({
      next: (mensagem) => {
        this.listaRelatorios();
        this.gerarRelatorio(this.relatorio);
        this.gerarGrafico(this.relatorio);
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
  gerarGrafico(relatorio: Relatorio) {
    this.relatorioService.gerarGrafico(relatorio).subscribe({
      next: (dados) => {
        this.dadosGrafico = dados;
        console.log('Dados do gráfico:', dados);
        // aqui você pode montar o gráfico com Chart.js, Recharts etc
      },
      error: () => {
        this.toastr.error('Erro ao gerar gráfico.');
      },
    });
  }
  gerarRelatorio(relatorio: Relatorio) {
    this.relatorioService.gerarRelatorio(relatorio).subscribe({
      next: (resultado) => {
        this.listaVendas = resultado.content;
        this.page = resultado.number;
        this.size = resultado.size;
        this.totalPages = resultado.totalPages;
      },
      error: (err) => {
        this.toastr.error('Erro ao gerar relatório.');
      },
    });
  }
  setPage(i: number) {
    if (i >= 0 && i < this.totalPages) {
      this.page = i;
      this.relatorio.tamanho = this.size;
      this.relatorio.pagina = this.page;
      this.gerarRelatorio(this.relatorio);
    }
  }
  alterarTamanho(event: Event) {
    const valor = +(event.target as HTMLSelectElement).value;
    this.size = valor;
    this.page = 0;
    this.relatorio.tamanho = this.size;
    this.relatorio.pagina = this.page;
    this.gerarRelatorio(this.relatorio);
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
}
