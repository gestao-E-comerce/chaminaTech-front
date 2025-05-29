import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Venda } from '../../../../models/venda';
import { VendaPagamento } from '../../../../models/venda-pagamento';
import { PagarParcialComponent } from './pagar-parcial/pagar-parcial.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PagamentoParcialComponent } from './pagar-parcial/pagamento-parcial/pagamento-parcial.component';
import { VendaService } from '../../../../services/venda.service';
import { Caixa } from '../../../../models/caixa';
import { Matriz } from '../../../../models/matriz';
import { GlobalService } from '../../../../services/global.service';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [FormsModule, PagarParcialComponent, PagamentoParcialComponent],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.scss',
})
export class PagamentosComponent implements OnInit {
  @Output() retornoPagamentoParcial = new EventEmitter<any>();
  @Output() retorno = new EventEmitter<any>();
  @Input() venda!: Venda;
  @Input() vendaPagamento: VendaPagamento = new VendaPagamento();
  @Input() chaveUnico: string = '';
  vendaParcial: Venda = new Venda();
  vendaOriginal: Venda = new Venda();
  caixa: Caixa = new Caixa();
  matriz!: Matriz;
  telaPequena: boolean = false;

  @ViewChild('dinheiroInput', { static: false })
  dinheiroInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('dinheiroInput') dinheiroRefs!: QueryList<ElementRef>;
  @ViewChildren('creditoInput') creditoRefs!: QueryList<ElementRef>;
  @ViewChildren('debitoInput') debitoRefs!: QueryList<ElementRef>;
  @ViewChildren('pixInput') pixRefs!: QueryList<ElementRef>;

  globalService = inject(GlobalService);
  vendaService = inject(VendaService);
  modalService = inject(NgbModal);
  rota = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  modalPagamentoparcial!: NgbModalRef;
  modalSelecionarProdutos!: NgbModalRef;
  @ViewChild('modalSelecionarProdutos', { static: true })
  modalSelecionarProdutosTemplate!: TemplateRef<any>;

  dinheiroLista: number[] = [NaN];
  debitoLista: number[] = [NaN];
  creditoLista: number[] = [NaN];
  pixLista: number[] = [NaN];
  tituloModal!: string;
  modalMessage!: string;
  modalRef!: NgbModalRef;
  tipoCaixa!: string;

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.modalPagamentoparcial && this.tituloModal === 'Pagar parcial') {
      // Apenas para o modal de pagamento
      this.fecharModalPagamentoERestaurarVenda();
    }
  }
  fecharModalPagamentoERestaurarVenda() {
    this.vendaParcial = new Venda();
    this.venda = JSON.parse(JSON.stringify(this.vendaOriginal));
  }

  ngOnInit() {
    this.verificarTamanho();
    window.addEventListener('resize', this.verificarTamanho.bind(this));
    this.rota.params.subscribe((params) => {
      this.tipoCaixa = params['tipoCaixa'];
    });

    if (this.venda?.vendaPagamento) {
      this.vendaPagamento = this.venda.vendaPagamento;

      this.dinheiroLista = this.vendaPagamento.dinheiro
        ? [this.vendaPagamento.dinheiro]
        : [NaN];
      this.debitoLista = this.vendaPagamento.debito
        ? [this.vendaPagamento.debito]
        : [NaN];
      this.creditoLista = this.vendaPagamento.credito
        ? [this.vendaPagamento.credito]
        : [NaN];
      this.pixLista = this.vendaPagamento.pix
        ? [this.vendaPagamento.pix]
        : [NaN];
    }

    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
        },
      });
    this.globalService
      .getCaixaAsync()
      .pipe(take(1))
      .subscribe({
        next: (caixa) => {
          if (caixa) {
            this.caixa = caixa;
          }
        },
        error: () => {
          this.toastr.error('Caixa não está definido.');
        },
      });

    setTimeout(() => {
      if (this.dinheiroInput && this.dinheiroInput.nativeElement) {
        this.dinheiroInput.nativeElement.focus();
      }
    }, 0);
  }
  verificarTamanho() {
    this.telaPequena = window.innerWidth <= 768;
  }

  get podePagarParcial(): boolean {
    return (
      (this.venda?.produtoVendas?.length > 1 ||
        this.venda?.produtoVendas?.some((p) => p.quantidade > 1)) ??
      false
    );
  }

  abrirModalPagarParcial() {
    if (
      this.venda.produtoVendas.length > 1 ||
      this.venda.produtoVendas.some((p) => p.quantidade > 1)
    ) {
      this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
      this.venda = Object.assign({}, this.venda);
      this.modalSelecionarProdutos = this.modalService.open(
        this.modalSelecionarProdutosTemplate,
        { size: 'xl' }
      );
      this.tituloModal = `Selecionar produtos`;
    }
  }

  retornoProdutosParcial(vendaParcial: Venda, modalPagamentosParcial: any) {
    this.valorTotal(vendaParcial);
    this.modalPagamentoparcial = this.modalService.open(
      modalPagamentosParcial,
      { size: 'fullscreen' }
    );
    this.tituloModal = `Pagar parcial`;
  }
  retornoVendaPagamentoParcial(
    vendaPagamento: VendaPagamento,
    modalConfirmarImpressao: any
  ) {
    let nomeImpressora: any;
    if (this.matriz.usarImpressora == false) {
      nomeImpressora = null;
    } else {
      nomeImpressora = this.getNomeImpressora();
    }
    this.vendaParcial.vendaPagamento = vendaPagamento;

    this.valorTotal(this.venda);
    this.venda.statusEmAberto = true;
    this.venda.imprimirCadastrar = false;
    this.venda.imprimirDeletar = false;
    const salvarVenda = () =>
      this.vendaService.save(this.venda, this.chaveUnico).subscribe({
        next: (mensagem) => {
          this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
          this.vendaParcial.mesa = this.venda.mesa;
          this.vendaParcial.funcionario = this.venda.funcionario;
          this.vendaParcial.retirada = false;
          this.vendaParcial.entrega = false;
          this.vendaParcial.balcao = false;
          this.vendaParcial.ativo = false;
          this.vendaParcial.statusEmAberto = false;
          this.vendaParcial.statusEmPagamento = false;
          this.vendaParcial.nomeImpressora = nomeImpressora;
          this.vendaParcial.caixa = this.caixa;

          this.vendaService.saveParcial(this.vendaParcial).subscribe({
            next: (mensagem) => {
              this.modalPagamentoparcial.dismiss();
              this.modalSelecionarProdutos.dismiss();
              this.toastr.success(mensagem.mensagem);
              this.vendaParcial = new Venda();

              this.dinheiroLista = [NaN];
              this.debitoLista = [NaN];
              this.creditoLista = [NaN];
              this.pixLista = [NaN];
            },
          });
        },
      });
    if (this.matriz.imprimirNotaFiscal === 0) {
      this.vendaParcial.imprimirNotaFiscal = true;
      salvarVenda();
    } else if (this.matriz.imprimirNotaFiscal === 1) {
      this.vendaParcial.imprimirNotaFiscal = false;
      salvarVenda();
    } else if (this.matriz.imprimirNotaFiscal === 2) {
      this.abrirModalConfirmarImpressao(
        'notaFiscal',
        modalConfirmarImpressao
      ).then((result) => {
        if (result === 'imprimir') {
          this.vendaParcial.imprimirNotaFiscal = true;
          salvarVenda();
        } else if (result === 'naoImprimir') {
          this.vendaParcial.imprimirNotaFiscal = false;
          salvarVenda();
        }
      });
    }
    this.retornoPagamentoParcial.emit(this.venda);
  }
  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }
  abrirModalConfirmarImpressao(
    acao: string,
    modalConfirmarImpressao: any
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let modalTitle = '';
      let modalMessage = '';

      if (acao === 'notaFiscal') {
        modalTitle = 'Imprimir Nota Fiscal';
        modalMessage = 'Deseja imprimir a Nota Fiscal?';
      }

      this.tituloModal = modalTitle;
      this.modalMessage = modalMessage;

      setTimeout(() => {
        this.modalRef = this.modalService.open(modalConfirmarImpressao, {
          size: 'md',
          backdrop: 'static',
          keyboard: false,
        });

        this.modalRef.result
          .then((result) => {
            if (result === 'imprimir') {
              resolve(result);
            } else if (result === 'naoImprimir') {
              resolve(result);
            }
          })
          .catch((erro) => {
            resolve('fechar');
          });
      }, 100);
    });
  }
  valorTotal(vendaCalcular: Venda) {
    let valorTotal = 0;

    if (vendaCalcular.produtoVendas && vendaCalcular.produtoVendas.length > 0) {
      for (const produtoVenda of vendaCalcular.produtoVendas) {
        const produto = produtoVenda.produto;
        let valorProduto = 0;

        if (produto.tipo) {
          valorProduto = (produto.valor / 1000) * produtoVenda.quantidade;
        } else {
          valorProduto = produto.valor * produtoVenda.quantidade;
        }

        if (produtoVenda.observacoesProdutoVenda) {
          for (const obs of produtoVenda.observacoesProdutoVenda) {
            if (obs.valor != null) {
              valorProduto += obs.valor * produtoVenda.quantidade;
            }
          }
        }

        produtoVenda.valor = valorProduto;

        valorTotal += valorProduto;
      }
    }

    vendaCalcular.valorTotal = valorTotal;
  }
  navegarInputs(event: KeyboardEvent, tipo: string, index: number): void {
    if (['e', 'E', '-', '+', ','].includes(event.key)) {
      event.preventDefault();
      return;
    }

    // Impede mais de 10 dígitos
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    if (
      valor.length >= 10 &&
      event.key.length === 1 &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      event.preventDefault();
      return;
    }

    const tipos = ['dinheiro', 'credito', 'debito', 'pix'];
    const refs: { [key: string]: QueryList<ElementRef> } = {
      dinheiro: this.dinheiroRefs,
      credito: this.creditoRefs,
      debito: this.debitoRefs,
      pix: this.pixRefs,
    };

    let tipoAtualIndex = tipos.indexOf(tipo);
    let novoTipo = tipo;
    let novoIndex = index;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        novoIndex++;
        if (novoIndex >= refs[tipo].length) {
          novoIndex = 0;
          tipoAtualIndex = (tipoAtualIndex + 1) % tipos.length;
          novoTipo = tipos[tipoAtualIndex];
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        novoIndex--;
        if (novoIndex < 0) {
          tipoAtualIndex = (tipoAtualIndex - 1 + tipos.length) % tipos.length;
          novoTipo = tipos[tipoAtualIndex];
          novoIndex = refs[novoTipo].length - 1;
        }
        break;

      case 'Enter':
        event.preventDefault();
        this.salvar();
        return;

      default:
        return;
    }

    const next = refs[novoTipo].toArray()[novoIndex];
    if (next) {
      next.nativeElement.focus();
      next.nativeElement.select();
    }
  }

  adicionarCampo(tipo: string) {
    switch (tipo) {
      case 'dinheiro':
        this.dinheiroLista.push(NaN);
        break;
      case 'debito':
        this.debitoLista.push(NaN);
        break;
      case 'credito':
        this.creditoLista.push(NaN);
        break;
      case 'pix':
        this.pixLista.push(NaN);
        break;
    }
  }

  calcularTotal(): number {
    const somaValores = (lista: number[]) =>
      lista.reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    return (
      somaValores(this.dinheiroLista) +
      somaValores(this.debitoLista) +
      somaValores(this.creditoLista) +
      somaValores(this.pixLista)
    );
  }

  get tipoTrocoOuDiferenca(): string {
    const totalPago = this.calcularTotal();
    const totalVenda = this.venda.valorTotal;

    if (totalPago > totalVenda) return 'Troco';
    return 'Diferença';
  }
  get valorTrocoOuDiferenca(): string {
    const totalPago = this.calcularTotal();
    const totalVenda = this.venda.valorTotal;

    if (totalPago > totalVenda) {
      // troco
      const troco = totalPago - totalVenda;
      const dinheiroPago = this.dinheiroLista.reduce(
        (s, v) => s + (isNaN(v) ? 0 : v),
        0
      );
      const trocoFinal = Math.min(troco, dinheiroPago);
      return trocoFinal.toFixed(2); // só o número
    } else {
      // diferença
      return (totalVenda - totalPago).toFixed(2);
    }
  }

  salvar() {
    const valorVenda = this.venda.valorTotal;
    const valorPago = this.calcularTotal();
    const excedente = valorPago - valorVenda;

    let dinheiroTotal = this.dinheiroLista.reduce(
      (acc, val) => acc + (isNaN(val) ? 0 : val),
      0
    );
    let debitoTotal = this.debitoLista.reduce(
      (acc, val) => acc + (isNaN(val) ? 0 : val),
      0
    );
    let creditoTotal = this.creditoLista.reduce(
      (acc, val) => acc + (isNaN(val) ? 0 : val),
      0
    );
    let pixTotal = this.pixLista.reduce(
      (acc, val) => acc + (isNaN(val) ? 0 : val),
      0
    );

    if (valorPago === valorVenda) {
      this.definirPagamentoEEmitir(
        dinheiroTotal,
        debitoTotal,
        creditoTotal,
        pixTotal
      );
      return;
    }

    if (valorPago < valorVenda) {
      const faltante = valorVenda - valorPago;
      this.toastr.error(
        `Pagamento insuficiente. Falta R$ ${faltante.toFixed(2)}`
      );
      return;
    }

    if (excedente > dinheiroTotal) {
      this.toastr.error('Pagamento inválido');
      return;
    }

    dinheiroTotal -= excedente;

    this.toastr.success(`Troco: R$ ${excedente.toFixed(2)}`);
    this.definirPagamentoEEmitir(
      dinheiroTotal,
      debitoTotal,
      creditoTotal,
      pixTotal
    );
  }
  private definirPagamentoEEmitir(
    dinheiro: number,
    debito: number,
    credito: number,
    pix: number
  ) {
    this.vendaPagamento.dinheiro = dinheiro;
    this.vendaPagamento.debito = debito;
    this.vendaPagamento.credito = credito;
    this.vendaPagamento.pix = pix;

    this.retorno.emit(this.vendaPagamento);
  }
}
