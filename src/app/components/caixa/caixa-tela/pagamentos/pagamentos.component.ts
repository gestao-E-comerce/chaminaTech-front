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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VendaService } from '../../../../services/venda.service';
import { Caixa } from '../../../../models/caixa';
import { Matriz } from '../../../../models/matriz';
import { GlobalService } from '../../../../services/global.service';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Observacoes } from '../../../../models/observacoes';
import { ProdutoVenda } from '../../../../models/produto-venda';
@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [FormsModule],
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
  modalSelecionarProdutos!: NgbModalRef;
  modalDesconto!: NgbModalRef;
  @ViewChild('modalSelecionarProdutos', { static: true })
  modalSelecionarProdutosTemplate!: TemplateRef<any>;
  @ViewChild('modalDesconto', { static: true })
  modalDescontoTemplate!: TemplateRef<any>;
  @ViewChild('modalConfirmarImpressao', { static: true })
  modalConfirmarImpressao!: TemplateRef<any>;

  dinheiroLista: number[] = [NaN];
  debitoLista: number[] = [NaN];
  creditoLista: number[] = [NaN];
  pixLista: number[] = [NaN];
  tituloModal!: string;
  modalMessage!: string;
  modalRef!: NgbModalRef;
  tipoCaixa!: string;
  descontoValor!: number;
  descontoPercentual!: number;
  descontoAplicado = false;
  taxaAplicada = true;
  pagamentoParcial = false;
  isSalvarDisabled = true;

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.pagamentoParcial) {
      this.fecharModalPagamentoERestaurarVenda();
    }
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.modalService.hasOpenModals()) {
      return; // Impede atalho quando o modal está aberto
    }
    if (event.altKey) {
      switch (event.key) {
        case '3':
          this.abrirOuRemoverDesconto();
          break;
        case '2':
          this.aplicarOuRemoverTaxa();
          break;
        case '5':
          this.salvar();
          break;
        default:
          break;
      }
    }
  }
  fecharModalPagamentoERestaurarVenda() {
    this.vendaParcial = new Venda();
    this.venda = JSON.parse(JSON.stringify(this.vendaOriginal));
    this.pagamentoParcial = false;
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

    this.focoInput();
  }
  verificarTamanho() {
    this.telaPequena = window.innerWidth <= 768;
  }
  focoInput() {
    setTimeout(() => {
      if (this.dinheiroInput && this.dinheiroInput.nativeElement) {
        this.dinheiroInput.nativeElement.focus();
      }
    }, 0);
  }
  get podePagarParcial(): boolean {
    return (
      (this.venda?.produtoVendas?.length > 1 ||
        this.venda?.produtoVendas?.some((p) => p.quantidade > 1)) ??
      false
    );
  }
  abrirOuRemoverDesconto(): void {
    if (this.descontoAplicado) {
      this.removerDesconto();
    } else {
      this.abrirModalDesconto();
    }
  }
  aplicarOuRemoverDesconto(): void {
    if (this.descontoAplicado) {
      this.removerDesconto();
    } else {
      this.aplicarDesconto();
    }
  }
  aplicarOuRemoverTaxa(): void {
    if (this.taxaAplicada) {
      this.removerTaxaServico(this.venda);
    } else {
      this.valorTotal(this.venda);
    }
  }
  aplicarDesconto(): void {
    let descontoValorCalculado = this.descontoValor || 0;
    let descontoPercentualCalculado = 0;

    if (this.descontoPercentual != null && this.descontoPercentual > 0) {
      descontoPercentualCalculado =
        (this.venda.valorTotal * this.descontoPercentual) / 100;
    }

    const descontoCalculado =
      descontoValorCalculado + descontoPercentualCalculado;

    if (descontoCalculado > this.venda.valorTotal) {
      this.toastr.error('Desconto maior que o valor total da venda!');
      return;
    }

    this.venda.desconto = descontoCalculado;
    this.venda.valorTotal = Math.max(
      this.venda.valorTotal - descontoCalculado,
      0
    );

    this.descontoAplicado = true;
    this.modalDesconto.dismiss();
    this.focoInput();
  }
  removerDesconto(): void {
    if (this.venda.desconto && this.venda.desconto > 0) {
      this.venda.valorTotal += this.venda.desconto; // Restaura o valor
    }
    this.venda.desconto = 0;
    this.venda.motivoDesconto = '';
    this.descontoAplicado = false;
    this.focoInput();
  }
  abrirModalPagarParcial() {
    if (this.podePagarParcial) {
      this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
      this.vendaParcial = new Venda();
      this.vendaParcial.produtoVendas = [];
      this.modalSelecionarProdutos = this.modalService.open(
        this.modalSelecionarProdutosTemplate,
        { size: 'xl' }
      );
      this.tituloModal = 'Selecionar produtos';
      this.pagamentoParcial = true;

      this.venda.produtoVendas.forEach((produtoVenda) => {
        produtoVenda.quantidadeTransferir = 0;
        produtoVenda.selecionado = false;
      });
      this.updateSalvarDisabledState();
    }
  }
  abrirModalDesconto() {
    this.modalDesconto = this.modalService.open(this.modalDescontoTemplate, {
      size: 'xl',
    });
    this.tituloModal = `Desconto`;
  }
  salvarVendaParcial(vendaPagamento: VendaPagamento) {
    let nomeImpressora: any;
    if (this.matriz.configuracaoImpressao.usarImpressora == false) {
      nomeImpressora = null;
    } else {
      nomeImpressora = this.getNomeImpressora();
    }

    const salvar = () => {
      this.venda.vendaPagamento = vendaPagamento;
      this.venda.funcionario = this.vendaOriginal.funcionario;
      this.venda.caixa = this.caixa;
      this.venda.retirada = false;
      this.venda.entrega = false;
      this.venda.balcao = true;
      this.venda.ativo = false;
      this.venda.statusEmAberto = false;
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.statusEmPagamento = false;
      this.venda.nomeImpressora = nomeImpressora;

      this.vendaOriginal.statusEmAberto = true;
      this.vendaOriginal.statusEmPagamento = false;
      this.vendaOriginal.imprimirCadastrar = false;
      this.vendaOriginal.imprimirDeletar = false;

      const parcialDTO = {
        vendaOriginal: this.vendaOriginal,
        vendaParcial: this.venda,
        chaveUnico: this.chaveUnico,
      };

      this.vendaService.pagamentoParcial(parcialDTO).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.vendaParcial = new Venda();
          this.venda = JSON.parse(JSON.stringify(this.vendaOriginal));
          this.pagamentoParcial = false;
          this.retornoPagamentoParcial.emit(this.vendaOriginal);

          this.dinheiroLista = [NaN];
          this.debitoLista = [NaN];
          this.creditoLista = [NaN];
          this.pixLista = [NaN];
        },
        error: (err) => {
          this.toastr.error(
            err.error?.mensagem || 'Erro ao realizar pagamento parcial'
          );
        },
      });
    };
    if (this.matriz.configuracaoImpressao.imprimirNotaFiscal === 0) {
      this.venda.imprimirNotaFiscal = true;
      salvar();
    } else if (this.matriz.configuracaoImpressao.imprimirNotaFiscal === 1) {
      this.venda.imprimirNotaFiscal = false;
      salvar();
    } else if (this.matriz.configuracaoImpressao.imprimirNotaFiscal === 2) {
      this.abrirModalConfirmarImpressao(
        'notaFiscal',
        this.modalConfirmarImpressao
      ).then((result) => {
        if (result === 'imprimir') {
          this.venda.imprimirNotaFiscal = true;
          salvar();
        } else if (result === 'naoImprimir') {
          this.venda.imprimirNotaFiscal = false;
          salvar();
        }
      });
    }
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
    let taxa = 0;

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
    vendaCalcular.valorBruto = valorTotal;
    valorTotal += vendaCalcular.taxaEntrega ?? 0;
    if (
      this.tipoCaixa === 'mesa' &&
      this.matriz.configuracaoTaxaServicio.aplicar
    ) {
      if (
        this.matriz.configuracaoTaxaServicio.tipo === 'PERCENTUAL' &&
        this.matriz.configuracaoTaxaServicio.percentual > 0
      ) {
        taxa =
          (valorTotal * this.matriz.configuracaoTaxaServicio.percentual) / 100;
      } else if (
        this.matriz.configuracaoTaxaServicio.tipo === 'FIXO' &&
        this.matriz.configuracaoTaxaServicio.valorFixo > 0
      ) {
        taxa = this.matriz.configuracaoTaxaServicio.valorFixo;
      }
      valorTotal += taxa;
    }
    this.taxaAplicada = true;
    valorTotal -= this.venda.desconto ?? 0;
    vendaCalcular.valorServico = taxa;
    vendaCalcular.valorTotal = valorTotal;
  }
  removerTaxaServico(vendaCalcular: Venda) {
    this.taxaAplicada = false;
    vendaCalcular.valorTotal -= vendaCalcular.valorServico;
    vendaCalcular.valorServico = 0;
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
    const listas: { [key: string]: number[] } = {
      dinheiro: this.dinheiroLista,
      credito: this.creditoLista,
      debito: this.debitoLista,
      pix: this.pixLista,
    };

    switch (event.key) {
      case '*':
        event.preventDefault();
        const lista = listas[tipo];

        // Zera campo atual pra não atrapalhar cálculo
        const valorOriginal = lista[index];
        lista[index] = 0;
        const totalPago = this.calcularTotal();
        const valorRestante = this.venda.valorTotal - totalPago;

        if (valorRestante <= 0 || isNaN(valorRestante)) {
          lista[index] = valorOriginal;
          return;
        }

        lista[index] = parseFloat(valorRestante.toFixed(2));

        setTimeout(() => {
          refs[tipo].toArray()[index]?.nativeElement?.focus();
          refs[tipo].toArray()[index]?.nativeElement?.select();
        }, 0);
        return;

      case 'ArrowDown':
        event.preventDefault();
        novoIndex++;
        if (novoIndex >= refs[tipo].length) {
          // muda para o tipo seguinte
          tipoAtualIndex = (tipoAtualIndex + 1) % tipos.length;
          novoTipo = tipos[tipoAtualIndex];
          novoIndex = 0;
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        novoIndex--;
        if (novoIndex < 0) {
          // volta para o tipo anterior
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

    if (this.pagamentoParcial) {
      this.salvarVendaParcial(this.vendaPagamento);
    } else {
      this.retorno.emit(this.vendaPagamento);
    }
  }

  incrementarQuantidade(produtoVenda: any) {
    if (produtoVenda.quantidadeTransferir < produtoVenda.quantidade) {
      produtoVenda.quantidadeTransferir++;
      this.updateSalvarDisabledState();
    }
    this.atualizarSelecionado(produtoVenda);
  }
  decrementarQuantidade(produtoVenda: any) {
    if (produtoVenda.quantidadeTransferir > 0) {
      produtoVenda.quantidadeTransferir--;
      this.updateSalvarDisabledState();
    }
    this.atualizarSelecionado(produtoVenda);
  }
  atualizarSelecionado(produtoVenda: any) {
    produtoVenda.selecionado =
      produtoVenda.quantidadeTransferir === produtoVenda.quantidade;
    this.updateSalvarDisabledState();
  }
  atualizarQuantidadeTransferir(produtoVenda: any) {
    if (produtoVenda.selecionado) {
      produtoVenda.quantidadeTransferir = produtoVenda.quantidade;
    } else {
      produtoVenda.quantidadeTransferir = 0;
    }
    this.updateSalvarDisabledState();
  }
  updateSalvarDisabledState() {
    const totalItens = this.venda.produtoVendas.reduce(
      (acc, produto) => acc + produto.quantidade,
      0
    );

    const totalSelecionados = this.venda.produtoVendas.reduce(
      (acc, produto) => acc + produto.quantidadeTransferir,
      0
    );
    this.isSalvarDisabled =
      totalSelecionados === 0 || totalSelecionados === totalItens;
  }
  getObservacoesFormatadas(produto: any): string {
    const observacoesLista =
      produto.observacoesProdutoVenda
        ?.map((o: Observacoes) => o.observacao)
        .join(', ') || '';
    const observacaoIndividual = produto.observacaoProdutoVenda
      ? (observacoesLista ? ', ' : '') + produto.observacaoProdutoVenda
      : '';
    return observacoesLista + observacaoIndividual;
  }

  salvarProdutosParcial() {
    if (!this.vendaParcial.produtoVendas) {
      this.vendaParcial.produtoVendas = [];
    }

    this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));

    let produtoFoiSelecionado = false;

    for (let i = 0; i < this.vendaOriginal.produtoVendas.length; i++) {
      const produtoVenda = this.vendaOriginal.produtoVendas[i];

      if (produtoVenda.quantidadeTransferir > 0) {
        const novoProdutoVenda = new ProdutoVenda();
        novoProdutoVenda.quantidade = produtoVenda.quantidadeTransferir;
        novoProdutoVenda.produto = produtoVenda.produto;
        novoProdutoVenda.funcionario = produtoVenda.funcionario;
        novoProdutoVenda.observacoesProdutoVenda = [
          ...produtoVenda.observacoesProdutoVenda,
        ];
        novoProdutoVenda.observacaoProdutoVenda =
          produtoVenda.observacaoProdutoVenda;

        this.vendaParcial.produtoVendas.push(novoProdutoVenda);
        produtoVenda.quantidade -= produtoVenda.quantidadeTransferir;
        produtoVenda.quantidadeTransferir = 0;
        produtoFoiSelecionado = true;

        if (produtoVenda.quantidade === 0) {
          this.vendaOriginal.produtoVendas.splice(i, 1);
          i--;
        }
      }
    }

    if (!produtoFoiSelecionado) {
      this.toastr.error(
        'Selecione ao menos um produto para pagamento parcial!'
      );
      return;
    }

    this.valorTotal(this.vendaParcial);
    this.valorTotal(this.vendaOriginal);

    this.modalSelecionarProdutos.dismiss();

    this.venda = JSON.parse(JSON.stringify(this.vendaParcial));
    this.dinheiroLista = [NaN];
    this.debitoLista = [NaN];
    this.creditoLista = [NaN];
    this.pixLista = [NaN];
    this.focoInput();
  }
}
