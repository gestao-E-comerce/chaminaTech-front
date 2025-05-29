import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { VendaPagamento } from '../../../../../../models/venda-pagamento';
import { Venda } from '../../../../../../models/venda';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagamento-parcial',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagamento-parcial.component.html',
  styleUrl: './pagamento-parcial.component.scss',
})
export class PagamentoParcialComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() vendaPagamento: VendaPagamento = new VendaPagamento();
  @Input() vendaParcial: Venda = new Venda();
  telaPequena: boolean = false;

  @ViewChild('dinheiroInput', { static: false })
  dinheiroInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('dinheiroInput') dinheiroRefs!: QueryList<ElementRef>;
  @ViewChildren('creditoInput') creditoRefs!: QueryList<ElementRef>;
  @ViewChildren('debitoInput') debitoRefs!: QueryList<ElementRef>;
  @ViewChildren('pixInput') pixRefs!: QueryList<ElementRef>;
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);

  dinheiroLista: number[] = [NaN];
  debitoLista: number[] = [NaN];
  creditoLista: number[] = [NaN];
  pixLista: number[] = [NaN];

  ngOnInit() {
    this.verificarTamanho();
    window.addEventListener('resize', this.verificarTamanho.bind(this));
    setTimeout(() => {
      if (this.dinheiroInput && this.dinheiroInput.nativeElement) {
        this.dinheiroInput.nativeElement.focus();
      }
    }, 0);
  }
  verificarTamanho() {
    this.telaPequena = window.innerWidth <= 768;
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
    const totalVenda = this.vendaParcial.valorTotal;

    if (totalPago > totalVenda) return 'Troco';
    return 'Diferença';
  }
  get valorTrocoOuDiferenca(): string {
    const totalPago = this.calcularTotal();
    const totalVenda = this.vendaParcial.valorTotal;

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
    const valorVenda = this.vendaParcial.valorTotal;
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
