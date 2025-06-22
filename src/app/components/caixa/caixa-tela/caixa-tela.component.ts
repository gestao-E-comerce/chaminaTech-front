import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Venda } from '../../../models/venda';
import { Funcionario } from '../../../models/funcionario';
import { ProdutoVenda } from '../../../models/produto-venda';
import { Produto } from '../../../models/produto';
import { Caixa } from '../../../models/caixa';
import { ProdutoService } from '../../../services/produto.service';
import { VendaService } from '../../../services/venda.service';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { VendaPagamento } from '../../../models/venda-pagamento';
import { Observacoes } from '../../../models/observacoes';
import { ActivatedRoute, Router } from '@angular/router';
import { VendaListaComponent } from './venda-lista/venda-lista.component';
import { DatePipe, NgClass } from '@angular/common';
import { GestaoCaixa } from '../../../models/gestao-caixa';
import { GestaoCaixaService } from '../../../services/gestao-caixa.service';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';
import { SelecionarProdutosComponent } from './selecionar-produtos/selecionar-produtos.component';
import { PagamentosComponent } from './pagamentos/pagamentos.component';
import { TransferirMesaComponent } from './transferir-mesa/transferir-mesa.component';
import { ProdutoObservacaoComponent } from './produto-observacao/produto-observacao.component';
import { SelecionarClienteComponent } from './selecionar-cliente/selecionar-cliente.component';
import { NgxMaskPipe } from 'ngx-mask';
import { GlobalService } from '../../../services/global.service';
import { Matriz } from '../../../models/matriz';
import { ProdutosComponent } from './produtos/produtos.component';
import { ImpressaoService } from '../../../services/impressao.service';
import { Usuario } from '../../../models/usuario';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria';
import { ProdutoObservacaoTouchComponent } from './caixa-tela-touch/produto-observacao-touch/produto-observacao-touch.component';
import { VendaListaTouchComponent } from './caixa-tela-touch/venda-lista-touch/venda-lista-touch.component';
import { SocketService } from '../../../services/socket.service';
import { ProdutoObservacaoTouchDeveComponent } from './caixa-tela-touch/produto-observacao-touch-deve/produto-observacao-touch-deve.component';

@Component({
  selector: 'app-caixa-tela',
  standalone: true,
  imports: [
    FormsModule,
    SelecionarProdutosComponent,
    PagamentosComponent,
    TransferirMesaComponent,
    ProdutoObservacaoComponent,
    VendaListaComponent,
    NgClass,
    DatePipe,
    SelecionarClienteComponent,
    NgxMaskPipe,
    ProdutosComponent,
    ProdutoObservacaoTouchComponent,
    VendaListaTouchComponent,
    ProdutoObservacaoTouchDeveComponent,
  ],
  templateUrl: './caixa-tela.component.html',
  styleUrl: './caixa-tela.component.scss',
})
export class CaixaTelaComponent implements OnInit {
  @ViewChild('quantidadeProdutoPeso', { static: false })
  quantidadeProdutoPeso!: ElementRef<HTMLInputElement>;
  @ViewChild('quantidadeProduto', { static: false })
  quantidadeProduto!: ElementRef<HTMLInputElement>;
  @ViewChild('quantedadePessoas', { static: false })
  quantedadePessoas!: ElementRef<HTMLInputElement>;
  @ViewChild('codigoProduto', { static: false })
  codigoProduto!: ElementRef<HTMLInputElement>;
  @ViewChild('numeroVenda', { static: false })
  numeroVenda!: ElementRef<HTMLInputElement>;
  @ViewChild('numeroMesaTransferir', { static: false })
  numeroMesaTransferir!: ElementRef<HTMLInputElement>;
  @ViewChild('vendasListagem') vendasListagem!: VendaListaComponent;
  @ViewChild('salvarPagamento') salvarPagamento!: PagamentosComponent;
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  @ViewChild('modalPagamentos') modalPagamentos!: TemplateRef<any>;
  @ViewChild('modalDeletarVenda') modalDeletarVenda!: TemplateRef<any>;
  @ViewChild('modalConfirmarImpressao')
  modalConfirmarImpressao!: TemplateRef<any>;
  @ViewChild('modalTransferirNumero')
  modalTransferirNumero!: TemplateRef<any>;
  @ViewChild('modalQuantedade')
  modalQuantedade!: TemplateRef<any>;

  @Output() retorno = new EventEmitter<any>();
  @Input() venda: Venda = new Venda();
  @Input() modoTouch!: boolean;
  funcionario: Funcionario = new Funcionario();
  usuario!: Usuario;
  produtoVenda: ProdutoVenda = new ProdutoVenda();
  produto: Produto = new Produto();
  produtoVendaSelecionada: ProdutoVenda = new ProdutoVenda();
  produtoSelecionado: Produto | null = null;
  caixa: Caixa = new Caixa();
  vendaOriginal: Venda = new Venda();
  vendaTransferir: Venda = new Venda();
  vendaSelecionadaParaAbrir: Venda = new Venda();
  cupomSelecionado: GestaoCaixa = new GestaoCaixa();
  cupom: GestaoCaixa = new GestaoCaixa();
  matriz!: Matriz;
  produtoCache: Produto | null = null;

  gestaoCaixaService = inject(GestaoCaixaService);
  socketService = inject(SocketService);
  impressaoService = inject(ImpressaoService);
  produtoService = inject(ProdutoService);
  globalService = inject(GlobalService);
  vendaService = inject(VendaService);
  modalService = inject(NgbModal);
  activatedRoute = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  router = inject(Router);

  modalRef!: NgbModalRef;
  indice: number | null = null;
  index!: number;
  tituloModal!: string;
  tituloModalConfermacao!: string;
  tituloInput!: string;
  textoBotaoNao!: string;
  textoBotaoSim!: string;
  textoBotaoAmbos!: string;
  tipoPagamento!: string;
  modalMessage!: string;
  modo: number = 1;
  modoQuantidade: boolean = false;
  transferir: boolean = false;
  codigoNomeProduto: number | null = null;
  nomeProduto: string | null = null;
  tipoCaixa!: string;
  mostrarBotaoObservacoes: boolean = true;
  modoRetirada!: boolean;
  modoPagar: boolean = false;
  mostrarAmbos: boolean = false;
  motivoDeletar: string = '';
  quantidadePessoasVariavel!: number;
  chaveUnico!: string;
  urlString!: string;
  telaPequena!: boolean;
  tamanhoTela!: number;
  kmEntregaCalculado: number | null = null;
  vendaTransferidaAssumida: boolean = false;
  horaEntregaPrevista: string = '';
  taxaServico?: number;

  ngOnInit() {
    this.onResize();
    this.globalService.modoTouch$.subscribe((valor) => {
      this.modoTouch = valor;
      if (this.modoTouch) {
        this.carregarCategorias();
      }
    });
    this.urlString = this.router.url.split('/')[1] ?? '';
    this.activatedRoute.params.subscribe((params) => {
      this.tipoCaixa = params['tipoCaixa'];
      this.atualizarEstadoCaixa();
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

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
    this.globalService
      .getFuncionarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (funcionario) => {
          this.funcionario = funcionario;
        },
      });
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
          this.socketService.subscribe(
            `/topic/venda/${matriz.id}`,
            (notificacao: any) => {
              if (notificacao.tipo === this.tipoCaixa) {
                if (notificacao.acao === 'liberar') {
                  if (this.venda && this.venda.id === notificacao.venda.id) {
                    this.toastr.warning('Venda foi liberada!');
                    this.atualizarEstadoCaixa();
                  }
                }
              }
            }
          );
        },
      });
  }
  abrirModalDetalhes(
    produtoVenda: ProdutoVenda,
    indice: number,
    modalDetalhes: any
  ) {
    this.produtoVenda = Object.assign({}, produtoVenda);
    this.indice = indice;
    this.modalRef = this.modalService.open(modalDetalhes, {
      size: 'fullscreen',
    });
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.modalService.hasOpenModals()) {
      return; // Impede atalho quando o modal está aberto
    }
    if (event.altKey) {
      const key = event.key.toLowerCase();
      switch (key) {
        case '5':
          this.atalhoPagar();
          break;
        case '9':
          this.atalhoDeletarVenda();
          break;
        case '8':
          this.atalhoFechar();
          break;
        case '7':
          this.atalhoTransferir();
          break;
        case '4':
          this.atalhoImprimirConta();
          break;
        case '1':
          this.atlahoLancarVenda();
          break;
        case '0':
          this.atlahoFocar();
          break;
        case 'z':
          if (this.usuario.permissao.vendaBalcao) {
            this.router.navigate([`/${this.urlString}/balcao`]);
          }
          break;
        case 'x':
          if (this.usuario.permissao.vendaMesa) {
            this.router.navigate([`/${this.urlString}/mesa`]);
          }
          break;
        case 'c':
          if (this.usuario.permissao.vendaRetirada) {
            this.router.navigate([`/${this.urlString}/retirada`]);
          }
          break;
        case 'v':
          if (this.usuario.permissao.vendaEntrega) {
            this.router.navigate([`/${this.urlString}/entrega`]);
          }
          break;
        default:
          break;
      }
    }
  }
  atalhoPagar() {
    if (
      (((this.tipoCaixa == 'mesa' ||
        this.tipoCaixa == 'retirada' ||
        this.tipoCaixa == 'entrega') &&
        !this.vendaAlterada() &&
        this.venda.dataVenda != null &&
        this.venda.deletado == false) ||
        (this.tipoCaixa == 'balcao' && this.venda.produtoVendas != null)) &&
      this.usuario &&
      this.usuario.permissao &&
      this.usuario.permissao.caixa &&
      this.urlString === 'caixa'
    ) {
      this.pagar(this.chaveUnico, this.modalPagamentos);
    }
  }

  atalhoDeletarVenda() {
    if (
      this.tipoCaixa != 'balcao' &&
      !this.vendaAlterada() &&
      this.venda.dataVenda != null &&
      this.venda.deletado == false &&
      this.usuario &&
      this.usuario.permissao &&
      this.usuario.permissao.deletarVenda &&
      this.urlString === 'caixa'
    ) {
      this.deletarVenda(
        this.venda,
        this.modalDeletarVenda,
        this.modalConfirmarImpressao
      );
    }
  }

  atalhoFechar() {
    if (
      (this.tipoCaixa == 'mesa' && this.venda.mesa != null) ||
      (this.tipoCaixa == 'balcao' && this.venda.produtoVendas != null) ||
      ((this.tipoCaixa == 'entrega' || this.tipoCaixa == 'retirada') &&
        this.venda.cliente != null)
    ) {
      this.cancelar();
    }
  }

  atalhoTransferir() {
    if (
      this.tipoCaixa == 'mesa' &&
      !this.vendaAlterada() &&
      this.venda.mesa &&
      this.venda.dataVenda != null &&
      this.venda.deletado == false &&
      this.usuario &&
      this.usuario.permissao &&
      this.usuario.permissao.transferirVenda
    ) {
      this.transferirMesa(this.modalTransferirNumero);
    }
  }

  atalhoImprimirConta() {
    if (
      (this.tipoCaixa == 'mesa' ||
        this.tipoCaixa == 'retirada' ||
        this.tipoCaixa == 'entrega') &&
      !this.vendaAlterada() &&
      this.venda.dataVenda != null &&
      this.venda.deletado == false &&
      this.usuario &&
      this.usuario.permissao &&
      this.usuario.permissao.imprimir &&
      this.urlString === 'caixa' &&
      this.matriz.configuracaoImpressao.usarImpressora
    ) {
      this.abrirModalImprimirConta(this.modalQuantedade);
    }
  }

  atlahoLancarVenda() {
    if (
      (this.tipoCaixa == 'mesa' && this.vendaAlterada() && !this.transferir) ||
      ((this.tipoCaixa == 'retirada' || this.tipoCaixa == 'entrega') &&
        this.vendaAlterada() &&
        this.venda.produtoVendas)
    ) {
      this.lancarVendaTipo(this.modalConfirmarImpressao, this.modalPagamentos);
    }
  }

  atlahoFocar() {
    this.focoQuantedadeProduto();
    this.focoQuantedadeProdutoPeso();
    this.focoCodigoProduto();
    this.focoNumeroVenda();
  }

  @HostListener('window:resize', [])
  onResize() {
    const valor = window.innerWidth;
    this.tamanhoTela = valor;

    if (valor > 1024) {
      this.telaPequena = false;
    } else {
      this.telaPequena = true;
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  public beforeUnloadHandler(event: BeforeUnloadEvent): void {
    if (this.vendaAlterada()) {
      event.preventDefault();
      event.returnValue = '';
    } else {
      if (this.venda.id) {
        this.liberarVenda(this.venda.id);
      }
      if (this.venda.deletado) {
        this.deletarVendaInativa(this.venda);
      }
    }
  }
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (
      this.modalRef &&
      this.tituloModal == 'Pagar' &&
      this.tipoCaixa !== 'balcao'
    ) {
      this.venda = JSON.parse(JSON.stringify(this.vendaOriginal));
      this.separarProdutos();
    }
  }
  fecharModalPagamentoERestaurarVenda() {
    if (this.tipoCaixa !== 'balcao' && this.tituloModal == 'Pagar') {
      this.venda = JSON.parse(JSON.stringify(this.vendaOriginal));
      this.separarProdutos();
    }
  }
  atualizarVendaOriginal(vendaAtualizada: Venda) {
    this.venda = JSON.parse(JSON.stringify(vendaAtualizada));
    this.vendaOriginal = JSON.parse(JSON.stringify(vendaAtualizada));
  }
  @Output() buscarNomeProduto(codigoNomeProduto: number | null) {
    if (codigoNomeProduto && codigoNomeProduto > 0) {
      this.produtoService
        .obterProdutoPorCodigoEMatriz(codigoNomeProduto)
        .subscribe({
          next: (produto) => {
            if (produto) {
              this.nomeProduto = produto.nome;
              this.produtoCache = produto;
            } else {
              this.nomeProduto = null;
              this.produtoCache = null;
            }
          },
        });
    } else {
      this.nomeProduto = null;
      this.produtoCache = null;
    }
  }
  retornoObservacao(produtoVenda: ProdutoVenda) {
    this.produtoVendaSelecionada = produtoVenda;
    this.modalRef.dismiss();
    this.focoQuantedadeProduto();
  }
  retornoProdutoSelecionado(produto: Produto) {
    this.modalRef.dismiss();
    this.codigoProduto.nativeElement.value = produto.codigo.toString();
    this.buscarNomeProduto(produto.codigo);
    this.focoCodigoProduto();
  }
  retornoTransferir(venda: Venda, vendaTransferir: Venda) {
    const configurarVenda = (vendaSalva: Venda) => {
      return {
        ...vendaSalva,
        retirada: false,
        entrega: false,
        balcao: false,
        statusEmAberto: false,
        statusEmPagamento: false,
        ativo: true,
        funcionario: this.funcionario,
      };
    };
    const vendaOriginalModificada = configurarVenda(venda);
    const vendaDestinoModificada = configurarVenda(vendaTransferir);

    const transferenciaDTO = {
      vendaOriginal: vendaOriginalModificada,
      vendaDestino: vendaDestinoModificada,
    };
    this.vendaService.transferir(transferenciaDTO).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.estadoMesa();
        this.modalService.dismissAll();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
  retornoVendaPagamento(
    vendaPagamento: VendaPagamento,
    modalConfirmarImpressao: any
  ) {
    this.retorno.emit('ok');
    this.venda.vendaPagamento = vendaPagamento;

    const salvarPagamento = () => {
      this.venda.caixa = this.caixa;

      if (this.matriz.configuracaoImpressao.imprimirNotaFiscal === 0) {
        this.venda.imprimirNotaFiscal = true;
        this.salvarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirNotaFiscal === 1) {
        this.venda.imprimirNotaFiscal = false;
        this.salvarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirNotaFiscal === 2) {
        this.abrirModalConfirmarImpressao(
          'notaFiscal',
          modalConfirmarImpressao
        ).then((result) => {
          if (result === 'imprimir') {
            this.venda.imprimirNotaFiscal = true;
            // this.venda.ativo = false;
            this.salvarVenda();
          } else if (result === 'naoImprimir') {
            this.venda.imprimirNotaFiscal = false;
            // this.venda.ativo = false;
            this.salvarVenda();
          }
        });
      }
    };
    if (this.tipoCaixa === 'retirada' || this.tipoCaixa === 'entrega') {
      if (this.modoPagar) {
        salvarPagamento();
      } else {
        this.lancarVenda(modalConfirmarImpressao);
      }
    } else if (this.tipoCaixa === 'balcao') {
      if (this.matriz.configuracaoImpressao.imprimirCadastrar === 0) {
        this.venda.imprimirCadastrar = true;
        salvarPagamento();
      } else if (this.matriz.configuracaoImpressao.imprimirCadastrar === 1) {
        this.venda.imprimirCadastrar = false;
        salvarPagamento();
      } else if (this.matriz.configuracaoImpressao.imprimirCadastrar === 2) {
        if (this.funcionario.preferenciaImpressaoProdutoNovo === 'SEMPRE') {
          this.venda.imprimirCadastrar = true;
          this.salvarVenda();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoNovo === 'NUNCA'
        ) {
          this.venda.imprimirCadastrar = false;
          this.salvarVenda();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoNovo === 'PERGUNTAR'
        ) {
          this.abrirModalConfirmarImpressao(
            'cadastrar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirCadastrar = true;
              this.salvarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirCadastrar = false;
              this.salvarVenda();
            }
          });
        } else if (this.funcionario.preferenciaImpressaoProdutoNovo == null) {
          this.venda.imprimirCadastrar = true;
          this.salvarVenda();
        }
      }
    } else {
      salvarPagamento();
    }
  }
  pagar(chaveUnico: string, modalPagamentos: any) {
    if (!this.venda.produtoVendas || this.venda.produtoVendas.length === 0) {
      this.toastr.error('Não há produtos na venda!');
    } else {
      setTimeout(() => {
        this.chaveUnico = chaveUnico;
        this.modalRef = this.modalService.open(modalPagamentos, {
          size: 'fullscreen',
        });
        this.tituloModal = 'Pagar';

        if (this.tipoCaixa === 'mesa') {
          this.tipoPagamento = 'Mesa ' + this.venda.mesa;
        } else if (this.tipoCaixa === 'balcao') {
          this.tipoPagamento = 'Balcao';
        } else if (this.tipoCaixa === 'entrega') {
          this.modoPagar = true;
          this.tipoPagamento = 'Entrega ' + this.cupomSelecionado.cupom;
        } else if (this.tipoCaixa === 'retirada') {
          this.modoPagar = true;
          this.tipoPagamento = 'Retirada ' + this.cupomSelecionado.cupom;
        }
      }, 0);
    }
  }
  abrirModalImpressao(venda: Venda, modalImpressao: any) {
    this.venda = Object.assign({}, venda);
    this.modalRef = this.modalService.open(modalImpressao, {
      size: 'md',
    });
  }
  editarProduto(produto: ProdutoVenda, indice: number) {
    this.focoQuantedadeProduto();
    this.produtoVenda = Object.assign({}, produto);
    this.produtoSelecionado = produto.produto;
    this.produtoVendaSelecionada = produto;
    this.indice = indice;

    if (!produto.id) {
      this.mostrarBotaoObservacoes = true;
    } else {
      this.mostrarBotaoObservacoes = false;
    }
  }
  deletarProduto(
    index: number,
    modalDelatarProduto: any,
    modalConfirmarImpressao: any
  ) {
    if (this.tipoCaixa === 'balcao') {
      this.venda.produtoVendas.splice(index, 1);
      this.valorTotal();
      if (!this.venda.produtoVendas || this.venda.produtoVendas.length === 0) {
        this.estadoBalcao();
      }
      this.focoCodigoProduto();
    } else {
      this.index = index;
      const produtoRemovido = this.venda.produtoVendas[index];
      this.valorTotal();
      this.tipoVenda();
      if (produtoRemovido.id == null) {
        this.venda.produtoVendas.splice(index, 1);
        this.valorTotal();
      } else {
        if (
          this.matriz.configuracaoImpressao.mostarMotivoDeletarProduto == true
        ) {
          this.modalService.open(modalDelatarProduto, { size: 'md' });
        } else {
          const salvarEVoltar = () => {
            this.venda.produtoVendas[index].motivoExclusao = '';
            this.venda.produtoVendas.splice(index, 1);
            this.valorTotal();
            this.tipoVenda();

            this.vendaService.save(this.venda, this.chaveUnico).subscribe({
              next: (mensagem) => {
                this.toastr.success('Produto removido e venda salva!');
                this.vendaService
                  .buscarPorId(this.venda.id)
                  .subscribe((venda: Venda) => {
                    this.motivoDeletar = '';
                    this.index = undefined as unknown as number;
                    this.marcarVendaEmUso(venda.id);
                    if (!this.modoTouch) {
                      this.focoCodigoProduto();
                      this.modalService.dismissAll();
                    } else {
                      this.separarProdutos();
                    }
                  });
              },
              error: (erro) => {
                this.toastr.error(erro.error.mensagem);
              },
            });
          };

          if (this.matriz.configuracaoImpressao.imprimirDeletar === 0) {
            this.venda.imprimirDeletar = true;
            salvarEVoltar();
          } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 1) {
            this.venda.imprimirDeletar = false;
            salvarEVoltar();
          } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 2) {
            if (
              this.funcionario.preferenciaImpressaoProdutoDeletado === 'SEMPRE'
            ) {
              this.venda.imprimirDeletar = true;
              salvarEVoltar();
            } else if (
              this.funcionario.preferenciaImpressaoProdutoDeletado === 'NUNCA'
            ) {
              this.venda.imprimirDeletar = false;
              salvarEVoltar();
            } else if (
              this.funcionario.preferenciaImpressaoProdutoDeletado ===
              'PERGUNTAR'
            ) {
              this.abrirModalConfirmarImpressao(
                'deletar',
                modalConfirmarImpressao
              ).then((result) => {
                if (result === 'imprimir') {
                  this.venda.imprimirDeletar = true;
                  salvarEVoltar();
                } else if (result === 'naoImprimir') {
                  this.venda.imprimirDeletar = false;
                  salvarEVoltar();
                }
              });
            } else if (
              this.funcionario.preferenciaImpressaoProdutoDeletado == null
            ) {
              this.venda.imprimirDeletar = true;
              salvarEVoltar();
            }
          }
        }
      }
    }
  }
  confirmarDeletarProduto(index: number, modalConfirmarImpressao: any) {
    if (!this.motivoDeletar?.trim()) {
      this.toastr.error('Motivo indefinido!!');
      return;
    } else {
      const salvarEVoltar = () => {
        this.venda.produtoVendas[index].motivoExclusao = this.motivoDeletar;
        this.venda.produtoVendas.splice(index, 1);
        this.valorTotal();

        this.tipoVenda();

        this.vendaService.save(this.venda, this.chaveUnico).subscribe({
          next: (mensagem) => {
            this.toastr.success('Produto removido e venda salva!');
            this.modalService.dismissAll();
            this.vendaService
              .buscarPorId(this.venda.id)
              .subscribe((venda: Venda) => {
                this.marcarVendaEmUso(venda.id);
                this.focoCodigoProduto();
                this.motivoDeletar = '';
                this.index = undefined as unknown as number;
                this.modalService.dismissAll();
              });
          },
          error: (mensagem) => {
            this.toastr.error(mensagem);
          },
        });
      };

      if (this.matriz.configuracaoImpressao.imprimirDeletar === 0) {
        this.venda.imprimirDeletar = true;
        salvarEVoltar();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 1) {
        this.venda.imprimirDeletar = false;
        salvarEVoltar();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 2) {
        if (this.funcionario.preferenciaImpressaoProdutoDeletado === 'SEMPRE') {
          this.venda.imprimirDeletar = true;
          salvarEVoltar();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado === 'NUNCA'
        ) {
          this.venda.imprimirDeletar = false;
          salvarEVoltar();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado === 'PERGUNTAR'
        ) {
          this.abrirModalConfirmarImpressao(
            'deletar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirDeletar = true;
              salvarEVoltar();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirDeletar = false;
              salvarEVoltar();
            }
          });
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado == null
        ) {
          this.venda.imprimirDeletar = true;
          salvarEVoltar();
        }
      }
    }
  }
  validarNumero(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    input.value = input.value.replace(/^0+/, '');
    input.value = input.value.slice(0, 10);
    input.value = input.value;
  }
  validarNumeroPeso(event: Event): void {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/,/g, '.');
    input.value = input.value.slice(0, 10);

    input.value = input.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');

    if (input.value.startsWith('0') && input.value[1] !== '.') {
      input.value = input.value.replace(/^0+/, '');
    }
  }
  cancelar(): Observable<boolean> {
    if (this.tipoCaixa === 'mesa') {
      if (this.vendaTransferir.id != null) {
        if (this.vendaTransferir.deletado === true) {
          this.deletarVendaInativa(this.vendaTransferir);
        } else if (this.vendaTransferir.id) {
          this.liberarVenda(this.vendaTransferir.id);
        }
      }
      if (this.venda.deletado === true) {
        this.deletarVendaInativa(this.venda);
        this.estadoMesa();
        this.modalService.dismissAll(); // Fecha aqui

        return of(true);
      } else if (this.vendaAlterada()) {
        return from(
          this.modalService.open(this.modalCancelar, {
            size: 'mm',
            backdrop: 'static',
            keyboard: false,
          }).result
        ).pipe(
          take(1),
          switchMap((result) => {
            if (result === 'confirmado') {
              this.modalService.dismissAll();
              return of(true);
            }
            return of(false);
          }),
          catchError((error) => {
            return of(false);
          })
        );
      } else if (
        !this.venda.produtoVendas ||
        this.venda.produtoVendas.length === 0
      ) {
        if (this.venda.dataVenda != null) {
          this.vendaService.deletar(this.venda).subscribe({
            next: (mensagem) => {
              this.toastr.success(mensagem.mensagem);
              this.retorno.emit(mensagem);
              this.estadoMesa();
            },
            error: (erro) => {
              this.toastr.error(erro.error.mensagem);
            },
          });
        }
        this.modalService.dismissAll();
        return of(true);
      } else {
        if (this.venda.id) {
          this.liberarVenda(this.venda.id);
        }
        this.estadoMesa();
        this.modalService.dismissAll();
        return of(true);
      }
    } else if (this.tipoCaixa === 'balcao') {
      if (!this.venda.produtoVendas || this.venda.produtoVendas.length === 0) {
        this.estadoBalcao();
        this.modalService.dismissAll();
        return of(true);
      } else {
        return from(
          this.modalService.open(this.modalCancelar, {
            size: 'mm',
            backdrop: 'static',
            keyboard: false,
          }).result
        ).pipe(
          take(1),
          switchMap((result) => {
            if (result === 'confirmado') {
              this.modalService.dismissAll();
              return of(true);
            }
            return of(false);
          }),
          catchError((error) => {
            return of(false);
          })
        );
      }
    } else if (this.tipoCaixa === 'entrega') {
      if (this.vendaAlterada()) {
        return from(
          this.modalService.open(this.modalCancelar, {
            size: 'mm',
            backdrop: 'static',
            keyboard: false,
          }).result
        ).pipe(
          take(1),
          switchMap((result) => {
            if (result === 'confirmado') {
              this.modalService.dismissAll();
              return of(true);
            }
            return of(false);
          }),
          catchError((error) => {
            return of(false);
          })
        );
      } else if (
        !this.venda.produtoVendas ||
        this.venda.produtoVendas.length === 0
      ) {
        if (this.venda.dataVenda != null) {
          this.vendaService.deletar(this.venda).subscribe({
            next: (mensagem) => {
              this.toastr.success(mensagem.mensagem);
              this.retorno.emit(mensagem);
              this.estadoEntrega();
            },
            error: (erro) => {
              this.toastr.error(erro.error.mensagem);
            },
          });
        }
        this.modalService.dismissAll();
        return of(true);
      } else {
        if (this.venda.id) {
          this.liberarVenda(this.venda.id);
        }
        this.estadoEntrega();
        this.modalService.dismissAll();
        return of(true);
      }
    } else if (this.tipoCaixa === 'retirada') {
      if (this.vendaAlterada()) {
        return from(
          this.modalService.open(this.modalCancelar, {
            size: 'mm',
            backdrop: 'static',
            keyboard: false,
          }).result
        ).pipe(
          take(1),
          switchMap((result) => {
            if (result === 'confirmado') {
              this.modalService.dismissAll();
              return of(true);
            }
            return of(false);
          }),
          catchError((error) => {
            return of(false);
          })
        );
      } else if (
        !this.venda.produtoVendas ||
        this.venda.produtoVendas.length === 0
      ) {
        if (this.venda.dataVenda != null) {
          this.vendaService.deletar(this.venda).subscribe({
            next: (mensagem) => {
              this.toastr.success(mensagem.mensagem);
              this.retorno.emit(mensagem);
              this.estadoRetirada();
            },
            error: (erro) => {
              this.toastr.error(erro.error.mensagem);
            },
          });
        }
        this.modalService.dismissAll();
        return of(true);
      } else {
        if (this.venda.id) {
          this.liberarVenda(this.venda.id);
        }
        this.estadoRetirada();
        this.modalService.dismissAll();
        return of(true);
      }
    }
    return of(false);
  }
  confirmarEFechar(modal: NgbActiveModal): void {
    this.confirmarCancelar().subscribe((resultado: boolean) => {
      if (resultado) {
        modal.close('confirmado');
      } else {
        modal.close(false);
      }
    });
  }
  confirmarCancelar(): Observable<boolean> {
    try {
      if (this.modo == 2) {
        this.liberarVenda(this.venda.id);
        this.venda = JSON.parse(JSON.stringify(this.vendaOriginal));
        this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
        this.venda = JSON.parse(JSON.stringify(this.vendaSelecionadaParaAbrir));
        this.vendaOriginal = JSON.parse(
          JSON.stringify(this.vendaSelecionadaParaAbrir)
        );
        this.marcarVendaEmUso(this.venda.id);
        this.modo = 1;
      } else {
        if (this.venda.id) {
          this.liberarVenda(this.venda.id);
        }
        this.atualizarEstadoCaixa();
      }
      this.atualizarEstadoCaixa();
      this.modalService.dismissAll();
      return of(true);
    } catch (error) {
      return of(false);
    }
  }

  abrirVendaSelecionada(
    event: { venda?: Venda; gestaoCaixa?: GestaoCaixa },
    modalCancelar: any,
    modalPagamentos: any,
    modalVendaSelecionada: any
  ) {
    if (
      this.venda.id != null &&
      (!this.venda.produtoVendas || this.venda.produtoVendas.length === 0)
    ) {
      this.venda.mesa == this.venda.mesa;
      this.venda.retirada = false;
      this.venda.entrega = false;
      this.venda.balcao = false;
      this.venda.statusEmAberto = false;
      this.venda.ativo = true;
      this.venda.nomeImpressora = null;
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.imprimirNotaFiscal = false;
      this.venda.motivoDeletar = '';
      this.vendaService.deletar(this.venda).subscribe({
        next: (mensagem) => {
          this.modalService.dismissAll();
          this.motivoDeletar = '';
        },
      });
    }
    // Verifique se o evento contém uma venda ou um gestaoCaixa
    if (this.tipoCaixa === 'mesa' && event.venda) {
      this.abrirNumeroMesa(
        event.venda,
        modalCancelar,
        modalPagamentos,
        modalVendaSelecionada
      ); // Chama a função passando a venda
    } else if (this.tipoCaixa === 'entrega' && event.gestaoCaixa) {
      this.abrirCupomEntrega(
        event.gestaoCaixa,
        modalCancelar,
        modalVendaSelecionada
      ); // Chama a função passando o GestaoCaixa
    } else if (this.tipoCaixa === 'retirada' && event.gestaoCaixa) {
      this.abrirCupomRetirada(
        event.gestaoCaixa,
        modalCancelar,
        modalVendaSelecionada
      ); // Chama a função passando o GestaoCaixa
    } else {
      this.toastr.error('Tipo de evento não compatível ou falta de dados');
    }
  }
  abrirNumeroMesa(
    venda: Venda,
    modalCancelar: any,
    modalPagamentos: any,
    modalVendaSelecionada: any
  ) {
    if (this.venda && this.venda.id != venda.id) {
      if (venda.statusEmAberto) {
        this.toastr.error('Esta mesa já está sendo editada por outro usuário!');
      } else if (venda.statusEmPagamento) {
        if (this.urlString === 'caixa' && this.usuario.permissao.caixa) {
          this.venda = venda;
          this.pagar('', modalPagamentos);
        } else {
          this.toastr.error('Esta mesa está em pagamento!');
        }
      } else {
        if (this.modoTouch) {
          this.venda = venda;
          this.valorTotal();
          this.vendaOriginal = JSON.parse(JSON.stringify(venda));
          this.marcarVendaEmUso(this.venda.id);
          this.abrirModalVendaSelecionada(modalVendaSelecionada);
          this.separarProdutos();
        } else {
          if (this.venda.deletado === true) {
            this.venda = venda;
            this.vendaOriginal = JSON.parse(JSON.stringify(venda));
            this.valorTotal();
            this.marcarVendaEmUso(this.venda.id);
            this.deletarVendaInativa(venda);
            this.focoCodigoProduto();
          } else {
            if (this.vendaAlterada()) {
              this.vendaSelecionadaParaAbrir = venda;
              this.modo = 2;
              this.modalService.open(modalCancelar, { size: 'mm' });
            } else {
              if (this.venda.id) {
                this.liberarVenda(this.venda.id);
              }
              this.venda = venda;
              this.valorTotal();
              this.vendaOriginal = JSON.parse(JSON.stringify(venda));
              this.focoCodigoProduto();
              this.marcarVendaEmUso(this.venda.id);
            }
          }
        }
      }
    }
  }
  abrirCupomEntrega(
    cupom: GestaoCaixa,
    modalCancelar: any,
    modalVendaSelecionada: any
  ) {
    if (this.venda && this.venda.id != cupom.venda.id) {
      if (cupom.venda.statusEmAberto) {
        this.toastr.error(
          'Esta entrega já está sendo editada por outro usuário!'
        );
      } else {
        if (this.modoTouch) {
          this.cupomSelecionado = cupom;
          this.venda = cupom.venda;
          this.valorTotal();
          this.vendaOriginal = JSON.parse(JSON.stringify(cupom.venda));
          this.marcarVendaEmUso(this.venda.id);
          this.abrirModalVendaSelecionada(modalVendaSelecionada);
          this.separarProdutos();
        } else {
          if (this.vendaAlterada()) {
            this.cupom = cupom;
            this.vendaSelecionadaParaAbrir = cupom.venda;
            this.modo = 2;
            this.modalService.open(modalCancelar, { size: 'mm' });
          } else {
            if (this.venda.id) {
              this.liberarVenda(this.venda.id);
            }
            this.cupomSelecionado = cupom;
            this.venda = cupom.venda;
            this.valorTotal();
            this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
            this.marcarVendaEmUso(this.venda.id);
            this.focoCodigoProduto();
          }
        }
        this.kmEntregaCalculado = this.calcularKmEntregaSeAplicavel();
        if (cupom.venda.dataVenda && cupom.venda.tempoEstimado) {
          const dataVenda = new Date(cupom.venda.dataVenda);
          const entregaFinal = new Date(
            dataVenda.getTime() + cupom.venda.tempoEstimado * 60000
          );
          this.horaEntregaPrevista = entregaFinal.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        } else {
          this.horaEntregaPrevista = '';
        }
      }
    }
  }
  abrirCupomRetirada(
    cupom: GestaoCaixa,
    modalCancelar: any,
    modalVendaSelecionada: any
  ) {
    if (this.venda && this.venda.id != cupom.venda.id) {
      if (cupom.venda.statusEmAberto) {
        this.toastr.error(
          'Esta retirada já está sendo editada por outro usuário!'
        );
      } else {
        if (this.modoTouch) {
          this.cupomSelecionado = cupom;
          this.venda = cupom.venda;
          this.valorTotal();
          this.vendaOriginal = JSON.parse(JSON.stringify(cupom.venda));
          this.marcarVendaEmUso(this.venda.id);
          this.abrirModalVendaSelecionada(modalVendaSelecionada);
          this.separarProdutos();
        } else {
          if (this.vendaAlterada()) {
            this.cupom = cupom;
            this.vendaSelecionadaParaAbrir = cupom.venda;
            this.modo = 2;
            this.modalService.open(modalCancelar, { size: 'mm' });
          } else {
            if (this.venda.id) {
              this.liberarVenda(this.venda.id);
            }
            this.cupomSelecionado = cupom;
            this.venda = cupom.venda;
            this.valorTotal();
            this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
            this.marcarVendaEmUso(this.venda.id);
            this.focoCodigoProduto();
          }
        }
        this.kmEntregaCalculado = this.calcularKmEntregaSeAplicavel();
        if (cupom.venda.dataVenda && cupom.venda.tempoEstimado) {
          const dataVenda = new Date(cupom.venda.dataVenda);
          const entregaFinal = new Date(
            dataVenda.getTime() + cupom.venda.tempoEstimado * 60000
          );
          this.horaEntregaPrevista = entregaFinal.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        } else {
          this.horaEntregaPrevista = '';
        }
      }
    }
  }
  deletarVenda(
    venda: Venda,
    modalDelatarVenda: any,
    modalConfirmarImpressao: any
  ) {
    this.venda = Object.assign({}, venda);
    if (this.matriz.configuracaoImpressao.mostarMotivoDeletarVenda == true) {
      this.modalService.open(modalDelatarVenda, { size: 'md' });
    } else {
      const deletarVenda = () => {
        this.tipoVenda();
        this.venda.motivoDeletar = '';
        this.vendaService.deletar(this.venda).subscribe({
          next: (mensagem) => {
            this.toastr.success(mensagem.mensagem);
            this.retorno.emit(mensagem);
            this.modalService.dismissAll();
            this.motivoDeletar = '';
            this.atualizarEstadoCaixa();
          },
        });
      };

      if (this.matriz.configuracaoImpressao.imprimirDeletar === 0) {
        this.venda.imprimirDeletar = true;
        deletarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 1) {
        this.venda.imprimirDeletar = false;
        deletarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 2) {
        if (this.funcionario.preferenciaImpressaoProdutoDeletado === 'SEMPRE') {
          this.venda.imprimirDeletar = true;
          deletarVenda();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado === 'NUNCA'
        ) {
          this.venda.imprimirDeletar = false;
          deletarVenda();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado === 'PERGUNTAR'
        ) {
          this.abrirModalConfirmarImpressao(
            'deletar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirDeletar = true;
              deletarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirDeletar = false;
              deletarVenda();
            }
          });
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado == null
        ) {
          this.venda.imprimirDeletar = true;
          deletarVenda();
        }
      }
    }
  }
  confirmarDeletarVenda(modalConfirmarImpressao: any) {
    if (!this.motivoDeletar?.trim()) {
      this.toastr.error('Motivo indefinido!!');
      return;
    } else {
      const deletarVenda = () => {
        this.tipoVenda();
        this.venda.motivoDeletar = this.motivoDeletar;
        this.vendaService.deletar(this.venda).subscribe({
          next: (mensagem) => {
            this.toastr.success(mensagem.mensagem);
            this.retorno.emit(mensagem);
            this.modalService.dismissAll();
            this.motivoDeletar = '';
            this.atualizarEstadoCaixa();
          },
        });
      };

      if (this.matriz.configuracaoImpressao.imprimirDeletar === 0) {
        this.venda.imprimirDeletar = true;
        deletarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 1) {
        this.venda.imprimirDeletar = false;
        deletarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 2) {
        if (this.funcionario.preferenciaImpressaoProdutoDeletado === 'SEMPRE') {
          this.venda.imprimirDeletar = true;
          deletarVenda();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado === 'NUNCA'
        ) {
          this.venda.imprimirDeletar = false;
          deletarVenda();
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado === 'PERGUNTAR'
        ) {
          this.abrirModalConfirmarImpressao(
            'deletar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirDeletar = true;
              deletarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirDeletar = false;
              deletarVenda();
            }
          });
        } else if (
          this.funcionario.preferenciaImpressaoProdutoDeletado == null
        ) {
          this.venda.imprimirDeletar = true;
          deletarVenda();
        }
      }
    }
  }
  transferirMesa(modalTransferirNumero: any) {
    if (this.modoTouch) {
      this.modalRef = this.modalService.open(modalTransferirNumero, {
        size: 'md',
        backdrop: 'static',
        keyboard: false,
      });
    } else {
      this.transferir = true;
      setTimeout(() => {
        if (
          this.numeroMesaTransferir &&
          this.numeroMesaTransferir.nativeElement
        ) {
          this.numeroMesaTransferir.nativeElement.focus();
        }
      }, 0);
    }
  }
  abrirModalTransferir(
    mesaDestino: number,
    modalTransferir: any,
    vendaOriginal: Venda
  ) {
    if (mesaDestino > 0 && vendaOriginal.mesa !== mesaDestino) {
      this.vendaService
        .buscarMesaAtivaByMatrizId(mesaDestino)
        .subscribe((vendaDestino: Venda | null) => {
          if (vendaDestino) {
            // Se a mesa destino já existe
            if (vendaDestino.statusEmAberto) {
              this.toastr.error(
                'Esta mesa já está sendo editada por outro usuário!'
              );
              return;
            }

            // Marca a mesa encontrada como em uso
            vendaDestino.statusEmAberto = true;
            this.vendaService
              .marcarVendaEmUso(vendaDestino.id)
              .subscribe(() => {
                this.abrirModalTransferirPreparar(
                  vendaOriginal,
                  vendaDestino,
                  modalTransferir
                );
              });
          } else {
            // Se não encontrou, cadastra uma nova mesa destino
            this.prepararNovaMesa(mesaDestino).subscribe({
              next: (vendaDestino: Venda) => {
                this.abrirModalTransferirPreparar(
                  vendaOriginal,
                  vendaDestino,
                  modalTransferir
                );
              },
              error: (erro) => {
                this.toastr.error(
                  'Erro ao cadastrar a mesa: ' + erro.error.mensagem
                );
              },
            });
          }
        });
    }
  }
  abrirModalTransferirPreparar(
    venda: Venda,
    vendaTransferir: Venda,
    modalTransferir: any
  ) {
    this.venda = Object.assign({}, venda);
    this.vendaTransferir = Object.assign({}, vendaTransferir);
    this.vendaTransferidaAssumida = true;

    this.modalRef = this.modalService.open(modalTransferir, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    this.tituloModal =
      'Origem ' + venda.mesa + ' >>> Destino ' + vendaTransferir.mesa;
  }
  prepararNovaMesa(mesaDestino: number): Observable<Venda> {
    const novaVenda = new Venda();
    novaVenda.mesa = mesaDestino;
    novaVenda.balcao = false;
    novaVenda.entrega = false;
    novaVenda.retirada = false;
    novaVenda.deletado = true;
    novaVenda.statusEmAberto = true;
    novaVenda.produtoVendas = [];
    novaVenda.funcionario = this.funcionario;
    novaVenda.imprimirCadastrar = false;
    novaVenda.imprimirDeletar = false;
    novaVenda.imprimirNotaFiscal = false;

    return this.vendaService.saveSimples(novaVenda);
  }
  verificarVenda(
    venda: number,
    modalPagamentos: any,
    modalVendaSelecionada: any
  ) {
    if (this.tipoCaixa === 'mesa') {
      this.verificarMesa(venda, modalPagamentos, modalVendaSelecionada);
    } else if (this.tipoCaixa === 'entrega') {
      this.verificarCupomEntrega(venda, modalVendaSelecionada);
    } else if (this.tipoCaixa === 'retirada') {
      this.verificarCupomRetirada(venda, modalVendaSelecionada);
    }
  }
  verificarMesa(
    mesa: number,
    modalPagamentos: any,
    modalVendaSelecionada: any
  ) {
    if (mesa > 0) {
      this.vendaService
        .buscarMesaAtivaByMatrizId(mesa)
        .subscribe((venda: Venda) => {
          if (venda) {
            if (venda.statusEmAberto) {
              this.toastr.error(
                'Esta mesa já está sendo editada por outro usuário!'
              );
            } else if (venda.statusEmPagamento) {
              if (this.urlString === 'caixa' && this.usuario.permissao.caixa) {
                this.venda = venda;
                this.pagar('', modalPagamentos);
              } else {
                this.toastr.error('Esta mesa está em pagamento!');
              }
            } else {
              this.venda = venda;
              this.valorTotal();
              this.vendaOriginal = JSON.parse(JSON.stringify(venda));
              this.marcarVendaEmUso(this.venda.id);
              if (this.modoTouch) {
                this.abrirModalVendaSelecionada(modalVendaSelecionada);
                this.separarProdutos();
              } else {
                this.focoCodigoProduto();
              }
            }
          } else {
            this.venda.mesa = mesa;
            this.cadastrarMesa(mesa);
            if (this.modoTouch) {
              this.abrirModalVendaSelecionada(modalVendaSelecionada);
              this.separarProdutos();
            } else {
              this.focoCodigoProduto();
            }
          }
        });
    }
  }
  verificarCupomRetirada(cupom: number, modalVendaSelecionada: any) {
    if (cupom > 0) {
      this.gestaoCaixaService
        .findByCupomAndAtivoAndRetiradaAndMatrizId(cupom)
        .subscribe((cupom: GestaoCaixa) => {
          if (cupom) {
            if (cupom.venda.statusEmAberto) {
              this.toastr.error(
                'Esta retirada já está sendo editada por outro usuário!'
              );
            } else {
              this.cupomSelecionado = cupom;
              this.venda = cupom.venda;
              this.valorTotal();
              this.vendaOriginal = JSON.parse(JSON.stringify(cupom.venda));
              this.marcarVendaEmUso(this.venda.id);
              if (this.modoTouch) {
                this.abrirModalVendaSelecionada(modalVendaSelecionada);
                this.separarProdutos();
              } else {
                this.focoCodigoProduto();
              }
            }
            this.kmEntregaCalculado = this.calcularKmEntregaSeAplicavel();
            if (cupom.venda.dataVenda && cupom.venda.tempoEstimado) {
              const dataVenda = new Date(cupom.venda.dataVenda);
              const entregaFinal = new Date(
                dataVenda.getTime() + cupom.venda.tempoEstimado * 60000
              );
              this.horaEntregaPrevista = entregaFinal.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
            } else {
              this.horaEntregaPrevista = '';
            }
          } else {
            this.toastr.warning('Cupom inválido!');
            this.focoNumeroVenda();
          }
        });
    }
  }
  verificarCupomEntrega(cupom: number, modalVendaSelecionada: any) {
    if (cupom > 0) {
      this.gestaoCaixaService
        .findByCupomAndAtivoAndEntregaAndMatrizId(cupom)
        .subscribe((cupom: GestaoCaixa) => {
          if (cupom) {
            if (cupom.venda.statusEmAberto) {
              this.toastr.error(
                'Esta mesa já está sendo editada por outro usuário!'
              );
            } else {
              this.cupomSelecionado = cupom;
              this.venda = cupom.venda;
              this.valorTotal();
              this.vendaOriginal = JSON.parse(JSON.stringify(cupom.venda));
              this.marcarVendaEmUso(this.venda.id);
              if (this.modoTouch) {
                this.abrirModalVendaSelecionada(modalVendaSelecionada);
                this.separarProdutos();
              } else {
                this.focoCodigoProduto();
              }
            }
            this.kmEntregaCalculado = this.calcularKmEntregaSeAplicavel();
            if (cupom.venda.dataVenda && cupom.venda.tempoEstimado) {
              const dataVenda = new Date(cupom.venda.dataVenda);
              const entregaFinal = new Date(
                dataVenda.getTime() + cupom.venda.tempoEstimado * 60000
              );
              this.horaEntregaPrevista = entregaFinal.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
            } else {
              this.horaEntregaPrevista = '';
            }
          } else {
            this.toastr.warning('Cupom inválido!');
            this.focoNumeroVenda();
          }
        });
    }
  }
  verificarCodigo(
    codigo: number,
    modalPagamentos: any,
    modalConfirmarImpressao: any,
    modalObservacao: any,
    modalObservacaoTouchDeve: any
  ) {
    if (codigo > 0) {
      if (this.produtoCache && this.produtoCache.codigo === codigo) {
        this.tratarProdutoEncontrado(
          this.produtoCache,
          modalObservacao,
          modalObservacaoTouchDeve
        );
      } else {
        this.produtoService
          .obterProdutoPorCodigoEMatriz(codigo)
          .subscribe((produto: Produto) => {
            if (produto) {
              if (produto.tipo) {
                this.modoQuantidade = true;
                this.codigoNomeProduto = null;
                this.nomeProduto = null;
                this.produtoVendaSelecionada.produto = produto;
                this.produtoSelecionado = produto;
                if (produto.categoria.obsObrigatotio == true) {
                  this.observacaoBotao(
                    modalObservacao,
                    modalObservacaoTouchDeve,
                    this.produtoVendaSelecionada
                  );
                } else {
                  this.focoQuantedadeProdutoPeso();
                }
              } else {
                this.modoQuantidade = false;
                this.codigoNomeProduto = null;
                this.nomeProduto = null;
                this.produtoVendaSelecionada.produto = produto;
                this.produtoSelecionado = produto;
                if (produto.categoria.obsObrigatotio == true) {
                  this.observacaoBotao(
                    modalObservacao,
                    modalObservacaoTouchDeve,
                    this.produtoVendaSelecionada
                  );
                } else {
                  this.focoQuantedadeProduto();
                }
              }
            } else {
              this.toastr.error('Produto não encontrado!');
              this.focoCodigoProduto();
            }
          });
      }
    } else if (this.produtoSelecionado == null) {
      if (this.tipoCaixa === 'balcao') {
        if (
          !this.venda.produtoVendas ||
          this.venda.produtoVendas.length === 0
        ) {
          this.toastr.error('Não há produtos na venda!');
        } else {
          this.pagar(this.chaveUnico, modalPagamentos);
        }
      } else {
        if (
          !this.venda.produtoVendas ||
          this.venda.produtoVendas.length === 0
        ) {
          if (this.venda.dataVenda != null) {
            this.vendaService.deletar(this.venda).subscribe({
              next: (mensagem) => {
                this.toastr.success(mensagem.mensagem);
                this.retorno.emit(mensagem);
                this.atualizarEstadoCaixa();
              },
              error: (erro) => {
                this.toastr.error(erro.error.mensagem);
              },
            });
          }
        } else {
          if (this.vendaAlterada()) {
            this.valorTotal();
            if (this.tipoCaixa === 'retirada' || this.tipoCaixa === 'entrega') {
              this.lancarVendaViagem(modalPagamentos, modalConfirmarImpressao);
            } else {
              this.lancarVenda(modalConfirmarImpressao);
            }
          }
        }
      }
    }
  }
  tratarProdutoEncontrado(
    produto: Produto,
    modalObservacao: any,
    modalObservacaoTouchDeve: any
  ) {
    if (produto.tipo) {
      this.modoQuantidade = true;
      this.codigoNomeProduto = null;
      this.nomeProduto = null;
      this.produtoVendaSelecionada.produto = produto;
      this.produtoSelecionado = produto;
      if (produto.categoria.obsObrigatotio == true) {
        this.observacaoBotao(
          modalObservacao,
          modalObservacaoTouchDeve,
          this.produtoVendaSelecionada
        );
      } else {
        this.focoQuantedadeProdutoPeso();
      }
    } else {
      this.modoQuantidade = false;
      this.codigoNomeProduto = null;
      this.nomeProduto = null;
      this.produtoVendaSelecionada.produto = produto;
      this.produtoSelecionado = produto;
      if (produto.categoria.obsObrigatotio == true) {
        this.observacaoBotao(
          modalObservacao,
          modalObservacaoTouchDeve,
          this.produtoVendaSelecionada
        );
      } else {
        this.focoQuantedadeProduto();
      }
    }
  }
  cancelarSelecaoProduto() {
    if (this.produtoSelecionado?.categoria.obsObrigatotio == true) {
      this.produtoVendaSelecionada = new ProdutoVenda();
      this.produtoSelecionado = null;
      this.focoCodigoProduto();
    } else {
      this.focoQuantedadeProduto();
    }
  }
  trocarCliente(modalCliente: any, venda: Venda) {
    this.venda = Object.assign({}, venda);
    this.modalRef = this.modalService.open(modalCliente, { size: 'mm' });

    this.tituloModal = 'Trocar Cliente';
  }
  selecionarCliente(modalCliente: any) {
    this.venda = new Venda();
    if (this.venda.cliente) {
      this.venda.cliente = this.venda.cliente;
    }
    this.modalService.open(modalCliente, { size: 'mm' });
    if (this.tipoCaixa === 'retirada') {
      this.modoRetirada = true;
    } else if (this.tipoCaixa === 'entrega') {
      this.modoRetirada = false;
    }
    this.tituloModal = 'Selecionar cliente';
  }
  lancarVendaTipo(modalConfirmarImpressao: any, modalPagamentos: any) {
    if (this.tipoCaixa === 'entrega' || this.tipoCaixa === 'retirada') {
      this.lancarVendaViagem(modalPagamentos, modalConfirmarImpressao);
    } else {
      this.lancarVenda(modalConfirmarImpressao);
    }
  }
  vincularCliente(modalVendaSelecionada: any) {
    this.retorno.emit('ok');

    if (this.modoTouch) {
      this.abrirModalVendaSelecionada(modalVendaSelecionada);
      this.separarProdutos();
    } else {
      this.modalService.dismissAll();
    }

    if (
      this.tipoCaixa === 'retirada' &&
      this.matriz.configuracaoRetirada.tempoEstimadoRetidara != null
    ) {
      this.venda.tempoEstimado =
        this.matriz.configuracaoRetirada.tempoEstimadoRetidara;
    }

    if (this.tipoCaixa === 'entrega') {
      const endereco = this.venda.endereco;
      const matriz = this.matriz;

      if (
        matriz.configuracaoEntrega.calcular === 0 &&
        endereco.latitude != null &&
        endereco.longitude != null &&
        matriz.latitude != null &&
        matriz.longitude != null
      ) {
        const distancia = this.calcularDistanciaKm(
          matriz.latitude,
          matriz.longitude,
          endereco.latitude,
          endereco.longitude
        );

        const distanciaEmKm = Math.ceil(distancia);

        let menorDiferenca = Infinity;
        let taxaEntrega: number | null = null;
        let tempoEstimado: number | null = null;
        let maiorFaixaKm = 0;

        for (const faixa of matriz.configuracaoEntrega.taxasEntregaKm) {
          if (faixa.km != null && faixa.valor != null) {
            if (faixa.km > maiorFaixaKm) maiorFaixaKm = faixa.km;

            const diferenca = Math.abs(distanciaEmKm - faixa.km);

            if (diferenca < menorDiferenca) {
              menorDiferenca = diferenca;
              taxaEntrega = faixa.valor;
              tempoEstimado = faixa.tempo ?? null;
            }
          }
        }

        if (distanciaEmKm > maiorFaixaKm) {
          this.toastr.error(
            `Endereço fora da área de entrega. Distância: ${distanciaEmKm} km.`
          );
          this.atualizarEstadoCaixa();
          return;
        }

        this.venda.taxaEntrega = taxaEntrega ?? 0;
        this.venda.tempoEstimado = tempoEstimado ?? 0;

        this.valorTotal();
      }
    }

    this.kmEntregaCalculado = this.calcularKmEntregaSeAplicavel();
    this.focoCodigoProduto();
  }
  private calcularDistanciaKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.grausParaRadianos(lat2 - lat1);
    const dLon = this.grausParaRadianos(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.grausParaRadianos(lat1)) *
        Math.cos(this.grausParaRadianos(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const resultado = R * c;
    return resultado;
  }
  private grausParaRadianos(graus: number): number {
    const rad = graus * (Math.PI / 180);
    return rad;
  }
  calcularKmEntregaSeAplicavel(): number | null {
    if (
      this.tipoCaixa === 'entrega' &&
      this.venda?.endereco?.latitude &&
      this.venda?.endereco?.longitude &&
      this.matriz?.latitude &&
      this.matriz?.longitude
    ) {
      const distancia = this.calcularDistanciaKm(
        this.matriz.latitude,
        this.matriz.longitude,
        this.venda.endereco.latitude,
        this.venda.endereco.longitude
      );

      const distanciaEmKm = Math.ceil(distancia);
      return distanciaEmKm;
    }
    return null;
  }

  lancarVendaViagem(modalPagamentos: any, modalConfirmarImpressao: any) {
    this.modoPagar = false;
    if (this.venda.vendaPagamento != null) {
      this.valorTotal();
      this.lancarVenda(modalConfirmarImpressao);
    } else {
      setTimeout(() => {
        this.modalRef = this.modalService.open(modalPagamentos, {
          size: 'fullscreen',
        });
        this.tituloModal = 'Definir Pagamento';

        if (this.tipoCaixa === 'entrega') {
          this.tipoPagamento = 'Entrega';
        } else if (this.tipoCaixa === 'retirada') {
          this.tipoPagamento = 'Retirada';
        }
      }, 0);
    }
  }
  lancarVenda(modalConfirmarImpressao: any) {
    let contadorCadastrar = 0;
    let contadorDeletar = 0;

    const vendaAtual = this.venda.produtoVendas ? this.venda.produtoVendas : [];
    const vendaOriginal = this.vendaOriginal.produtoVendas
      ? this.vendaOriginal.produtoVendas
      : [];

    const mapaVendaAtual = new Map(vendaAtual.map((p) => [p.id, p]));
    const mapaVendaOriginal = new Map(vendaOriginal.map((p) => [p.id, p]));

    vendaOriginal.forEach((produto) => {
      const produtoAtual = mapaVendaAtual.get(produto.id);
      if (!produtoAtual) {
        contadorDeletar++;
      } else if (produtoAtual.quantidade < produto.quantidade) {
        contadorDeletar++;
      }
    });

    vendaAtual.forEach((produto) => {
      const produtoOriginal = mapaVendaOriginal.get(produto.id);
      if (!produtoOriginal) {
        contadorCadastrar++;
      } else if (produto.quantidade > produtoOriginal.quantidade) {
        contadorCadastrar++;
      }
    });

    const imprimirCadastrar =
      this.matriz.configuracaoImpressao.imprimirCadastrar;
    const imprimirDeletar = this.matriz.configuracaoImpressao.imprimirDeletar;
    const prefNovo = this.funcionario.preferenciaImpressaoProdutoNovo;
    const prefDel = this.funcionario.preferenciaImpressaoProdutoDeletado;

    if (contadorCadastrar > 0 && contadorDeletar > 0) {
      if (imprimirCadastrar === 0 && imprimirDeletar === 0) {
        this.venda.imprimirDeletar = true;
        this.venda.imprimirCadastrar = true;
        this.salvarVenda();
      } else if (imprimirCadastrar === 1 && imprimirDeletar === 1) {
        this.venda.imprimirDeletar = false;
        this.venda.imprimirCadastrar = false;
        this.salvarVenda();
      } else if (imprimirCadastrar === 0 && imprimirDeletar === 1) {
        this.venda.imprimirDeletar = false;
        this.venda.imprimirCadastrar = true;
        this.salvarVenda();
      } else if (imprimirCadastrar === 1 && imprimirDeletar === 0) {
        this.venda.imprimirDeletar = true;
        this.venda.imprimirCadastrar = false;
        this.salvarVenda();
      } else if (imprimirCadastrar === 2 && imprimirDeletar === 2) {
        if (
          prefNovo == null ||
          prefDel == null ||
          (prefNovo === 'PERGUNTAR' && prefDel === 'PERGUNTAR')
        ) {
          this.abrirModalConfirmarImpressao(
            'ambos',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimirAmbos') {
              this.venda.imprimirDeletar = true;
              this.venda.imprimirCadastrar = true;
            } else if (result === 'imprimirCadastrar') {
              this.venda.imprimirDeletar = false;
              this.venda.imprimirCadastrar = true;
            } else if (result === 'imprimirDeletar') {
              this.venda.imprimirDeletar = true;
              this.venda.imprimirCadastrar = false;
            } else if (result === 'naoImprimirNada') {
              this.venda.imprimirDeletar = false;
              this.venda.imprimirCadastrar = false;
            }
            this.salvarVenda();
          });
        } else if (prefNovo === 'SEMPRE' && prefDel === 'SEMPRE') {
          this.venda.imprimirDeletar = true;
          this.venda.imprimirCadastrar = true;
          this.salvarVenda();
        } else if (prefNovo === 'NUNCA' && prefDel === 'NUNCA') {
          this.venda.imprimirDeletar = false;
          this.venda.imprimirCadastrar = false;
          this.salvarVenda();
        } else if (prefNovo === 'SEMPRE' && prefDel === 'NUNCA') {
          this.venda.imprimirCadastrar = true;
          this.venda.imprimirDeletar = false;
          this.salvarVenda();
        } else if (prefNovo === 'NUNCA' && prefDel === 'SEMPRE') {
          this.venda.imprimirCadastrar = false;
          this.venda.imprimirDeletar = true;
          this.salvarVenda();
        } else if (prefNovo === 'SEMPRE' && prefDel === 'PERGUNTAR') {
          this.abrirModalConfirmarImpressao(
            'deletar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirCadastrar = true;
              this.venda.imprimirDeletar = true;
              this.salvarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirCadastrar = true;
              this.venda.imprimirDeletar = false;
              this.salvarVenda();
            }
          });
        } else if (prefNovo === 'NUNCA' && prefDel === 'PERGUNTAR') {
          this.abrirModalConfirmarImpressao(
            'deletar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirCadastrar = false;
              this.venda.imprimirDeletar = true;
              this.salvarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirCadastrar = false;
              this.venda.imprimirDeletar = false;
              this.salvarVenda();
            }
          });
        } else if (prefNovo === 'PERGUNTAR' && prefDel === 'SEMPRE') {
          this.abrirModalConfirmarImpressao(
            'cadastrar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirCadastrar = true;
              this.venda.imprimirDeletar = true;
              this.salvarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirCadastrar = false;
              this.venda.imprimirDeletar = true;
              this.salvarVenda();
            }
          });
        } else if (prefNovo === 'PERGUNTAR' && prefDel === 'NUNCA') {
          this.abrirModalConfirmarImpressao(
            'cadastrar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirCadastrar = true;
              this.venda.imprimirDeletar = false;
              this.salvarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirCadastrar = false;
              this.venda.imprimirDeletar = false;
              this.salvarVenda();
            }
          });
        }
      } else if (imprimirCadastrar === 2 && imprimirDeletar === 0) {
        this.abrirModalConfirmarImpressao(
          'cadastrar',
          modalConfirmarImpressao
        ).then((result) => {
          if (result === 'imprimir') {
            this.venda.imprimirCadastrar = true;
            this.venda.imprimirDeletar = true;
            this.salvarVenda();
          } else if (result === 'naoImprimir') {
            this.venda.imprimirCadastrar = false;
            this.venda.imprimirDeletar = true;
            this.salvarVenda();
          }
        });
      } else if (imprimirCadastrar === 2 && imprimirDeletar === 1) {
        this.abrirModalConfirmarImpressao(
          'cadastrar',
          modalConfirmarImpressao
        ).then((result) => {
          if (result === 'imprimir') {
            this.venda.imprimirCadastrar = true;
            this.venda.imprimirDeletar = false;
            this.salvarVenda();
          } else if (result === 'naoImprimir') {
            this.venda.imprimirCadastrar = false;
            this.venda.imprimirDeletar = false;
            this.salvarVenda();
          }
        });
      } else if (imprimirCadastrar === 0 && imprimirDeletar === 2) {
        this.abrirModalConfirmarImpressao(
          'deletar',
          modalConfirmarImpressao
        ).then((result) => {
          if (result === 'imprimir') {
            this.venda.imprimirCadastrar = true;
            this.venda.imprimirDeletar = true;
            this.salvarVenda();
          } else if (result === 'naoImprimir') {
            this.venda.imprimirCadastrar = true;
            this.venda.imprimirDeletar = false;
            this.salvarVenda();
          }
        });
      } else if (imprimirCadastrar === 1 && imprimirDeletar === 2) {
        this.abrirModalConfirmarImpressao(
          'deletar',
          modalConfirmarImpressao
        ).then((result) => {
          if (result === 'imprimir') {
            this.venda.imprimirCadastrar = false;
            this.venda.imprimirDeletar = true;
            this.salvarVenda();
          } else if (result === 'naoImprimir') {
            this.venda.imprimirCadastrar = false;
            this.venda.imprimirDeletar = false;
            this.salvarVenda();
          }
        });
      }
    } else if (contadorDeletar > 0) {
      if (this.matriz.configuracaoImpressao.imprimirDeletar === 0) {
        this.venda.imprimirDeletar = true;
        this.salvarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 1) {
        this.venda.imprimirDeletar = false;
        this.salvarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirDeletar === 2) {
        if (prefDel === 'SEMPRE') {
          this.venda.imprimirDeletar = true;
          this.salvarVenda();
        } else if (prefDel === 'NUNCA') {
          this.venda.imprimirDeletar = false;
          this.salvarVenda();
        } else if (prefDel === 'PERGUNTAR') {
          this.abrirModalConfirmarImpressao(
            'deletar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirDeletar = true;
              this.salvarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirDeletar = false;
              this.salvarVenda();
            }
          });
        } else if (prefDel == null) {
          this.venda.imprimirDeletar = true;
          this.salvarVenda();
        }
      }
    } else if (contadorCadastrar > 0) {
      if (this.matriz.configuracaoImpressao.imprimirCadastrar === 0) {
        this.venda.imprimirCadastrar = true;
        this.salvarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirCadastrar === 1) {
        this.venda.imprimirCadastrar = false;
        this.salvarVenda();
      } else if (this.matriz.configuracaoImpressao.imprimirCadastrar === 2) {
        if (prefNovo === 'SEMPRE') {
          this.venda.imprimirCadastrar = true;
          this.salvarVenda();
        } else if (prefNovo === 'NUNCA') {
          this.venda.imprimirCadastrar = false;
          this.salvarVenda();
        } else if (prefNovo === 'PERGUNTAR') {
          this.abrirModalConfirmarImpressao(
            'cadastrar',
            modalConfirmarImpressao
          ).then((result) => {
            if (result === 'imprimir') {
              this.venda.imprimirCadastrar = true;
              this.salvarVenda();
            } else if (result === 'naoImprimir') {
              this.venda.imprimirCadastrar = false;
              this.salvarVenda();
            }
          });
        } else if (prefNovo == null) {
          this.venda.imprimirCadastrar = true;
          this.salvarVenda();
        }
      }
    }
  }
  salvarVenda() {
    this.tipoVenda();
    this.venda.taxaEntrega = this.venda.taxaEntrega;
    this.venda.funcionario = this.funcionario;
    this.vendaService.save(this.venda, this.chaveUnico).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.retorno.emit(mensagem);
        this.modalService.dismissAll();
        this.atualizarEstadoCaixa();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
  abrirModalConfirmarImpressao(
    acao: string,
    modalConfirmarImpressao: any
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let modalTitle = '';
      let modalMessage = '';
      let size = '';

      if (acao === 'notaFiscal') {
        modalTitle = 'Imprimir Nota Fiscal';
        modalMessage = 'Deseja imprimir a Nota Fiscal?';
        size = 'md';
      } else if (acao === 'deletar') {
        modalTitle = 'Imprimir Remoção de Produto';
        modalMessage = 'Deseja imprimir a remoção do produto?';
        size = 'md';
      } else if (acao === 'cadastrar') {
        modalTitle = 'Imprimir Produtos';
        modalMessage = 'Deseja imprimir o Produtos?';
        size = 'md';
      } else if (acao === 'ambos') {
        modalTitle = 'Imprimir Itens da Venda';
        modalMessage = 'Escolha quais itens deseja imprimir:';
        size = 'xl';
        this.mostrarAmbos = true;
      } else {
        this.mostrarAmbos = false;
      }

      this.tituloModalConfermacao = modalTitle;
      this.modalMessage = modalMessage;

      setTimeout(() => {
        this.modalRef = this.modalService.open(modalConfirmarImpressao, {
          size: size,
          backdrop: 'static',
          keyboard: false,
        });

        this.modalRef.result
          .then((result) => {
            if (result === 'imprimir') {
              this.mostrarAmbos = false;
              resolve(result);
            } else if (result === 'naoImprimir') {
              this.mostrarAmbos = false;
              resolve(result);
            } else if (result === 'imprimirCadastrar') {
              this.mostrarAmbos = false;
              resolve(result);
            } else if (result === 'imprimirAmbos') {
              this.mostrarAmbos = false;
              resolve(result);
            } else if (result === 'imprimirDeletar') {
              this.mostrarAmbos = false;
              resolve(result);
            } else if (result === 'naoImprimirNada') {
              this.mostrarAmbos = false;
              resolve(result);
            }
          })
          .catch((erro) => {
            this.mostrarAmbos = false;
            resolve('fechar');
          });
      }, 100);
    });
  }
  adicionarQuantidade(quantidade: number) {
    if (this.produtoVendaSelecionada.id != null && quantidade > 0) {
      if (this.produtoSelecionado)
        this.produtoVenda.produto = this.produtoSelecionado;
      this.produtoVenda.quantidade = quantidade;
      this.produtoVenda.funcionario = this.funcionario;
      if (
        this.produtoVendaSelecionada.observacaoProdutoVenda != null ||
        this.produtoVendaSelecionada.observacoesProdutoVenda != null
      ) {
        this.produtoVendaSelecionada.observacaoProdutoVenda =
          this.produtoVendaSelecionada.observacaoProdutoVenda;
        this.produtoVendaSelecionada.observacoesProdutoVenda =
          this.produtoVendaSelecionada.observacoesProdutoVenda;
      }

      if (this.venda.produtoVendas == null) this.venda.produtoVendas = [];
      if (this.indice !== null) {
        this.venda.produtoVendas[this.indice] = this.produtoVenda;
      }
      this.produtoVendaSelecionada = new ProdutoVenda();
      this.indice = null;
      this.valorTotal();
      this.toastr.success('Produto atualizado com sucesso!');

      this.produtoSelecionado = null;
      this.focoCodigoProduto();
    } else if (this.produtoSelecionado && quantidade > 0) {
      const novoProdutoVenda = new ProdutoVenda();
      novoProdutoVenda.produto = this.produtoSelecionado;
      novoProdutoVenda.quantidade = quantidade;
      novoProdutoVenda.funcionario = this.funcionario;
      if (
        this.produtoVendaSelecionada.observacaoProdutoVenda != null ||
        this.produtoVendaSelecionada.observacoesProdutoVenda != null
      ) {
        novoProdutoVenda.observacaoProdutoVenda =
          this.produtoVendaSelecionada.observacaoProdutoVenda;
        novoProdutoVenda.observacoesProdutoVenda =
          this.produtoVendaSelecionada.observacoesProdutoVenda;
      }

      if (this.venda.produtoVendas == null) this.venda.produtoVendas = [];
      if (this.indice !== null) {
        this.venda.produtoVendas[this.indice] = novoProdutoVenda;
      } else {
        this.venda.produtoVendas.push(novoProdutoVenda);
      }

      this.produtoVendaSelecionada = new ProdutoVenda();
      this.indice = null;
      this.valorTotal();
      this.toastr.success('Produto adicionado com sucesso!');

      this.produtoSelecionado = null;
      this.focoCodigoProduto();
    } else {
      this.toastr.error('Quantidade inválida ou produto não selecionado.');
    }
  }
  observacao(
    modalObservacao: any,
    modalObservacaoTouchDeve: any,
    produtoVenda: ProdutoVenda,
    event: KeyboardEvent
  ) {
    if (event.key === '*') {
      this.produtoVendaSelecionada = Object.assign({}, produtoVenda);
      if (
        this.produtoVendaSelecionada.produto.categoria.obsObrigatotio == true
      ) {
        setTimeout(() => {
          this.modalRef = this.modalService.open(modalObservacaoTouchDeve, {
            size: 'mm',
            backdrop: 'static',
            keyboard: false,
          });
        }, 0);
      } else if (
        this.produtoVendaSelecionada.produto.categoria.obsObrigatotio == false
      ) {
        setTimeout(() => {
          this.modalRef = this.modalService.open(modalObservacao, {
            size: 'mm',
            backdrop: 'static',
            keyboard: false,
          });
        }, 0);
      }
    }
  }
  observacaoBotao(
    modalObservacao: any,
    modalObservacaoTouchDeve: any,
    produtoVenda: ProdutoVenda
  ) {
    this.produtoVendaSelecionada = Object.assign({}, produtoVenda);
    if (this.produtoVendaSelecionada.produto.categoria.obsObrigatotio == true) {
      setTimeout(() => {
        this.modalRef = this.modalService.open(modalObservacaoTouchDeve, {
          size: 'mm',
          backdrop: 'static',
          keyboard: false,
        });
      }, 0);
    } else if (
      this.produtoVendaSelecionada.produto.categoria.obsObrigatotio == false
    ) {
      setTimeout(() => {
        this.modalRef = this.modalService.open(modalObservacao, {
          size: 'mm',
          backdrop: 'static',
          keyboard: false,
        });
      }, 0);
    }
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
  vendaAlterada(): boolean {
    const copiaAtual = { ...this.venda };
    const copiaOriginal = { ...this.vendaOriginal };

    // Remove o campo nomeImpressora antes da comparação
    delete (copiaAtual as any).nomeImpressora;
    delete (copiaOriginal as any).nomeImpressora;

    return JSON.stringify(copiaAtual) !== JSON.stringify(copiaOriginal);
  }
  abrirModalProdutosClick(modalProdutoEditar: any) {
    this.modalRef = this.modalService.open(modalProdutoEditar, {
      size: 'lg',
    });
  }
  abrirModalProdutos(event: KeyboardEvent, modalProdutoEditar: any) {
    if (event.code === 'Space') {
      event.preventDefault();
      this.modalRef = this.modalService.open(modalProdutoEditar, {
        size: 'lg',
      });
    }
  }
  focoCodigoProduto() {
    setTimeout(() => {
      if (this.codigoProduto && this.codigoProduto.nativeElement) {
        this.codigoProduto.nativeElement.focus();
        this.codigoProduto.nativeElement.select();
      }
    }, 0);
  }
  focoQuantedadePessoas() {
    setTimeout(() => {
      if (this.quantedadePessoas && this.quantedadePessoas.nativeElement) {
        this.quantedadePessoas.nativeElement.value = '1';
        this.quantedadePessoas.nativeElement.focus();
        this.quantedadePessoas.nativeElement.select();
      }
    }, 0);
  }
  focoQuantedadeProduto() {
    setTimeout(() => {
      if (this.quantidadeProduto && this.quantidadeProduto.nativeElement) {
        this.quantidadeProduto.nativeElement.value = '1';
        this.quantidadeProduto.nativeElement.focus();
        this.quantidadeProduto.nativeElement.select();
        this.cancelarProdutoSelecionado();
      }
    }, 0);
  }
  focoQuantedadeProdutoPeso() {
    setTimeout(() => {
      if (
        this.quantidadeProdutoPeso &&
        this.quantidadeProdutoPeso.nativeElement
      ) {
        this.quantidadeProdutoPeso.nativeElement.value = '';
        this.quantidadeProdutoPeso.nativeElement.focus();
        this.quantidadeProdutoPeso.nativeElement.select();
        this.cancelarProdutoSelecionado();
      }
    }, 0);
  }
  focoNumeroVenda() {
    setTimeout(() => {
      if (this.numeroVenda && this.numeroVenda.nativeElement) {
        this.numeroVenda.nativeElement.focus();
        this.numeroVenda.nativeElement.value = '';
      }
    }, 0);
  }
  cancelarProdutoSelecionado() {
    if (this.modoQuantidade) {
      this.quantidadeProdutoPeso.nativeElement.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            this.produtoSelecionado = null;
            this.mostrarBotaoObservacoes = true;
            this.focoCodigoProduto();
          }
        }
      );
    } else {
      this.quantidadeProduto.nativeElement.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            this.produtoSelecionado = null;
            this.mostrarBotaoObservacoes = true;
            this.focoCodigoProduto();
          }
        }
      );
    }
  }
  cancelarTransferir() {
    if (!this.modoTouch) {
      this.transferir = false;
      this.focoCodigoProduto();
    }
    this.venda = JSON.parse(JSON.stringify(this.vendaOriginal));
    if (this.vendaTransferir && this.vendaTransferidaAssumida) {
      if (this.vendaTransferir.deletado) {
        this.deletarVendaInativa(this.vendaTransferir);
      } else {
        this.liberarVenda(this.vendaTransferir.id);
      }
    }
    this.vendaTransferir = new Venda();
    this.vendaTransferidaAssumida = false;
  }
  valorTotal() {
    let valorTotal = 0;
    let taxa = 0;

    if (this.venda.produtoVendas && this.venda.produtoVendas.length > 0) {
      for (const produtoVenda of this.venda.produtoVendas) {
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
    this.venda.valorBruto = valorTotal;
    valorTotal += this.venda.taxaEntrega ?? 0;
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

    this.venda.valorServico = taxa;
    this.venda.valorTotal = valorTotal;
  }
  tipoVenda() {
    if (this.tipoCaixa === 'mesa') {
      this.vendaMesa();
    } else if (this.tipoCaixa === 'entrega') {
      this.vendaEntrega();
    } else if (this.tipoCaixa === 'retirada') {
      this.vendaRetirada();
    } else if (this.tipoCaixa === 'balcao') {
      this.vendaBalcao();
    }
  }
  vendaBalcao() {
    if (this.matriz.configuracaoImpressao.usarImpressora == false) {
      this.venda.retirada = false;
      this.venda.entrega = false;
      this.venda.balcao = true;
      this.venda.nomeImpressora = null;
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.imprimirNotaFiscal = false;
    } else {
      this.venda.retirada = false;
      this.venda.entrega = false;
      this.venda.balcao = true;
      this.venda.nomeImpressora = this.getNomeImpressora();
    }
  }
  vendaMesa() {
    if (this.matriz.configuracaoImpressao.usarImpressora == false) {
      this.venda.mesa == this.venda.mesa;
      this.venda.retirada = false;
      this.venda.entrega = false;
      this.venda.balcao = false;
      this.venda.statusEmAberto = false;
      this.venda.ativo = true;
      this.venda.nomeImpressora = null;
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.imprimirNotaFiscal = false;
    } else {
      this.venda.mesa == this.venda.mesa;
      this.venda.retirada = false;
      this.venda.entrega = false;
      this.venda.balcao = false;
      this.venda.statusEmAberto = false;
      this.venda.ativo = true;
      this.venda.nomeImpressora = this.getNomeImpressora();
    }
  }
  vendaEntrega() {
    if (this.matriz.configuracaoImpressao.usarImpressora == false) {
      this.venda.retirada = false;
      this.venda.entrega = true;
      this.venda.balcao = false;
      this.venda.statusEmAberto = false;
      this.venda.statusEmPagamento = false;
      this.venda.nomeImpressora = null;
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.imprimirNotaFiscal = false;
    } else {
      this.venda.retirada = false;
      this.venda.entrega = true;
      this.venda.balcao = false;
      this.venda.statusEmAberto = false;
      this.venda.statusEmPagamento = false;
      this.venda.nomeImpressora = this.getNomeImpressora();
    }
  }
  vendaRetirada() {
    if (this.matriz.configuracaoImpressao.usarImpressora == false) {
      this.venda.retirada = true;
      this.venda.entrega = false;
      this.venda.balcao = false;
      this.venda.statusEmAberto = false;
      this.venda.statusEmPagamento = false;
      this.venda.nomeImpressora = null;
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.imprimirNotaFiscal = false;
    } else {
      this.venda.retirada = true;
      this.venda.entrega = false;
      this.venda.balcao = false;
      this.venda.statusEmAberto = false;
      this.venda.statusEmPagamento = false;
      this.venda.nomeImpressora = this.getNomeImpressora();
    }
  }
  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }
  atualizarEstadoCaixa() {
    if (this.tipoCaixa === 'mesa') {
      this.estadoMesa();
    } else if (this.tipoCaixa === 'entrega') {
      this.estadoEntrega();
    } else if (this.tipoCaixa === 'retirada') {
      this.estadoRetirada();
    } else if (this.tipoCaixa === 'balcao') {
      this.estadoBalcao();
    }
    this.modalService.dismissAll();
  }
  estadoMesa() {
    setTimeout(() => {
      if (this.vendasListagem) {
        this.vendasListagem.limparVendaSelecionada();
      }
    }, 0);
    this.focoNumeroVenda();
    this.venda = new Venda();
    this.vendaOriginal = new Venda();
    this.vendaTransferir = new Venda();
    this.produtoVendaSelecionada = new ProdutoVenda();
    this.cupomSelecionado = new GestaoCaixa();
    this.produtoSelecionado = null;
    this.transferir = false;
    this.numeroMesaTransferir == null;
    this.codigoNomeProduto = null;
    this.nomeProduto = null;
    this.modoQuantidade = false;
    this.modoRetirada = false;
    this.modoPagar = false;
    this.tituloInput = 'Digite o numero de mesa';
    this.tituloModal = '';
  }
  estadoEntrega() {
    this.focoNumeroVenda();
    this.venda = new Venda();
    this.vendaOriginal = new Venda();
    this.vendaTransferir = new Venda();
    this.produtoVendaSelecionada = new ProdutoVenda();
    this.cupomSelecionado = new GestaoCaixa();
    this.produtoSelecionado = null;
    this.transferir = false;
    this.numeroMesaTransferir == null;
    this.codigoNomeProduto = null;
    this.nomeProduto = null;
    this.modoQuantidade = false;
    this.modoRetirada = false;
    this.modoPagar = false;
    this.tituloInput = 'Digite o numero de cupom entrega';
    this.tituloModal = '';
  }
  estadoRetirada() {
    this.focoNumeroVenda();
    this.venda = new Venda();
    this.vendaOriginal = new Venda();
    this.vendaTransferir = new Venda();
    this.produtoVendaSelecionada = new ProdutoVenda();
    this.cupomSelecionado = new GestaoCaixa();
    this.produtoSelecionado = null;
    this.transferir = false;
    this.numeroMesaTransferir == null;
    this.codigoNomeProduto = null;
    this.nomeProduto = null;
    this.modoQuantidade = false;
    this.modoRetirada = false;
    this.modoPagar = false;
    this.tituloInput = 'Digite o numero de cupom retirada';
    this.tituloModal = '';
  }
  estadoBalcao() {
    this.focoCodigoProduto();
    this.venda = new Venda();
    this.vendaOriginal = new Venda();
    this.vendaTransferir = new Venda();
    this.produtoVendaSelecionada = new ProdutoVenda();
    this.cupomSelecionado = new GestaoCaixa();
    this.produtoSelecionado = null;
    this.transferir = false;
    this.numeroMesaTransferir == null;
    this.codigoNomeProduto = null;
    this.nomeProduto = null;
    this.modoQuantidade = false;
    this.modoRetirada = false;
    this.modoPagar = false;
    this.quantidadesProdutosVenda = {}; // <<< LIMPAR o Map de quantidades
    this.listaProdutosNovos = [];
    this.tituloModal = '';
  }
  marcarVendaEmUso(vendaId: number) {
    this.vendaService.marcarVendaEmUso(vendaId).subscribe({
      next: () => {
        if (this.tipoCaixa === 'mesa') {
          this.vendaService
            .buscarMesaAtivaByMatrizId(this.venda.mesa)
            .subscribe({
              next: (venda) => {
                this.chaveUnico = venda.chaveUnico; // Salva a chave única no front
                this.venda = venda;
                this.valorTotal();
                this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
                if (!this.modoTouch) {
                  this.focoCodigoProduto();
                }
              },
              error: () => {
                this.toastr.error(
                  'Erro ao buscar a venda após marcar como em uso.'
                );
              },
            });
        } else if (this.tipoCaixa === 'retirada') {
          this.gestaoCaixaService
            .findByCupomAndAtivoAndRetiradaAndMatrizId(
              this.cupomSelecionado.cupom
            )
            .subscribe((cupom: GestaoCaixa) => {
              this.chaveUnico = cupom.venda.chaveUnico;
              this.venda = cupom.venda;
              this.valorTotal();
              this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
              if (!this.modoTouch) {
                this.focoCodigoProduto();
              }
            });
        } else if (this.tipoCaixa === 'entrega') {
          this.gestaoCaixaService
            .findByCupomAndAtivoAndEntregaAndMatrizId(
              this.cupomSelecionado.cupom
            )
            .subscribe((cupom: GestaoCaixa) => {
              this.chaveUnico = cupom.venda.chaveUnico;
              this.venda = cupom.venda;
              this.valorTotal();
              this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
              if (!this.modoTouch) {
                this.focoCodigoProduto();
              }
            });
        }
      },
    });
  }
  liberarVenda(vendaId: number) {
    this.vendaService.liberarVenda(vendaId).subscribe({
      next: () => {},
    });
  }
  cadastrarMesa(mesa: number) {
    this.vendaMesa();
    this.venda.deletado = true;
    this.venda.mesa = mesa;
    this.venda.balcao = false;
    this.venda.entrega = false;
    this.venda.retirada = false;
    this.venda.produtoVendas = [];
    this.venda.funcionario = this.funcionario;
    this.venda.imprimirCadastrar = false;
    this.venda.imprimirDeletar = false;
    this.venda.imprimirNotaFiscal = false;

    this.vendaService.saveSimples(this.venda).subscribe({
      next: (venda) => {
        this.chaveUnico = venda.chaveUnico; // Salva a chave única no front
        this.venda = venda;
        this.valorTotal();
        this.vendaOriginal = JSON.parse(JSON.stringify(this.venda));
        if (!this.modoTouch) {
          this.focoCodigoProduto();
        }
      },
      error: (erro) => {
        this.toastr.error('Erro ao cadastrar a mesa: ' + erro.error.mensagem);
      },
    });
  }
  deletarVendaInativa(venda: Venda) {
    this.vendaService.deletarMesa(venda.id).subscribe({
      next: (mensagem) => {},
      error: (erro) => {},
    });
  }
  imprimirProdutos(venda: Venda, modalProdutos: any) {
    this.venda = Object.assign({}, venda);
    this.modalRef = this.modalService.open(modalProdutos, { size: 'xl' });
  }
  abrirModalImprimirConta(modalQuantedade: any) {
    this.modalRef = this.modalService.open(modalQuantedade, { size: 'md' });
    this.tituloModal = 'Conta pra mesa ' + this.venda.mesa;
    this.focoQuantedadePessoas();
  }
  imprimirConta() {
    const quantedade = Number(this.quantedadePessoas.nativeElement.value);
    this.impressaoService
      .imprimirConta({ venda: this.venda, quantedade: quantedade })
      .subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.modalService.dismissAll();
          this.vendaService.marcarVendaEmPagamento(this.venda.id).subscribe({
            next: (mensagem) => {
              this.atualizarEstadoCaixa();
            },
          });
        },
      });
  }
  imprimirConferencia() {
    this.impressaoService.imprimirConferencia(this.venda).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalRef.close();
      },
    });
  }

  //// modo touch

  quantidadesProdutosVenda: { [idProduto: number]: number } = {};
  categoriaService = inject(CategoriaService);
  categoriaSelecionada!: Categoria;
  listaCategorias: Categoria[] = [];
  listaProdutosFiltrada: Produto[] = [];
  listaProdutosOrginal: Produto[] = [];
  listaProdutosNovos: ProdutoVenda[] = [];
  nomeProdutoPesquisa?: string = '';
  categoriaNome?: string = '';
  produtosVendaSelecionados: ProdutoVenda[] = [];
  produtosAntigos: ProdutoVenda[] = [];
  produtosNovos: ProdutoVenda[] = [];
  deveAdicionarComObservacao = false;

  separarProdutos() {
    this.produtosAntigos =
      this.venda.produtoVendas?.filter((pv) => pv.id != null) || [];
    this.produtosNovos =
      this.venda.produtoVendas?.filter((pv) => pv.id == null) || [];
  }

  prepararListaProdutosNovos() {
    this.listaProdutosNovos = this.venda.produtoVendas.filter(
      (pv) => pv.id == null
    );
  }

  podeSalvarVenda(): boolean {
    const produtosNovos = this.venda.produtoVendas?.some((pv) => pv.id == null);
    return this.vendaAlterada() && produtosNovos;
  }

  carregarCategorias() {
    this.categoriaService.listarCategorias('true', '').subscribe({
      next: (lista) => {
        this.listaCategorias = lista;
        if (this.listaCategorias.length > 0) {
          this.filtrarPorCategoria(this.listaCategorias[0]);
        }
      },
      error: () => {
        this.toastr.error('Erro ao listar categorias.');
      },
    });
  }
  filtrarPorCategoria(categoria: Categoria) {
    this.categoriaSelecionada = categoria;
    this.categoriaNome = categoria.nome;
    this.filtrarProdutos();
  }
  filtrarProdutos() {
    this.produtoService
      .listarProdutos('true', 'true', '', '', this.categoriaNome, '')
      .subscribe({
        next: (lista) => {
          this.listaProdutosOrginal = lista;
          this.listaProdutosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar produtos.');
        },
      });
  }
  buscarTodosProdutos() {
    this.nomeProdutoPesquisa = this.nomeProdutoPesquisa?.toLocaleUpperCase();
    this.produtoService
      .listarProdutos('true', 'true', '', '', '', this.nomeProdutoPesquisa)
      .subscribe({
        next: (lista) => {
          this.listaProdutosOrginal = lista;
          this.listaProdutosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar produtos.');
        },
      });
  }
  adicionarProduto(modalObservacaoTouchDeve: any, produto: Produto) {
    if (!this.venda.produtoVendas) {
      this.venda.produtoVendas = [];
    }

    const novoProdutoVenda = new ProdutoVenda();
    novoProdutoVenda.produto = produto;
    novoProdutoVenda.quantidade = 1;
    novoProdutoVenda.funcionario = this.funcionario;

    if (produto.categoria.obsObrigatotio == true) {
      this.produtoVendaSelecionada = novoProdutoVenda;
      this.deveAdicionarComObservacao = true;

      this.abrirModalObservacaoDeve(modalObservacaoTouchDeve, novoProdutoVenda);
    } else {
      this.venda.produtoVendas.push(novoProdutoVenda);
      this.atualizarQuantidades();
      this.separarProdutos();
    }
  }
  abrirModalObservacaoDeve(
    modalObservacaoTouchDeve: any,
    produtoVenda: ProdutoVenda
  ) {
    this.produtoVendaSelecionada = Object.assign({}, produtoVenda);
    this.modalRef = this.modalService.open(modalObservacaoTouchDeve, {
      size: 'lg',
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });

    this.tituloModal = 'Observações';
  }
  retornoObservacaoDeve(produtoVenda: ProdutoVenda) {
    if (this.deveAdicionarComObservacao) {
      this.venda.produtoVendas.push(produtoVenda);
    }
    this.produtoVendaSelecionada = produtoVenda;
    this.valorTotal();
    this.modalRef?.close();
    this.deveAdicionarComObservacao = false;
    this.atualizarQuantidades();
    this.separarProdutos();
    this.focoQuantedadeProduto();
  }
  // Abrir Modal de Observação
  abrirModalObservacao(modalObservacaoTouch: any, produto: Produto) {
    this.produtosVendaSelecionados =
      this.venda.produtoVendas?.filter(
        (pv) => pv.id == null && pv.produto.id === produto.id
      ) || [];

    if (this.produtosVendaSelecionados.length === 0) {
      this.toastr.error('Nenhum produto adicionado para observação.');
      return;
    }

    this.modalRef = this.modalService.open(modalObservacaoTouch, {
      size: 'lg',
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });

    this.tituloModal = 'Observações';
  }
  atualizarQuantidades() {
    // Limpa
    this.quantidadesProdutosVenda = {};

    if (this.venda.produtoVendas) {
      for (const pv of this.venda.produtoVendas) {
        const idProduto = pv.produto.id;
        this.quantidadesProdutosVenda[idProduto] =
          (this.quantidadesProdutosVenda[idProduto] || 0) + 1;
      }
    }
    this.valorTotal();
  }
  removerProdutoVenda(produtoVenda: ProdutoVenda) {
    const index = this.venda.produtoVendas.indexOf(produtoVenda);
    if (index !== -1) {
      this.venda.produtoVendas.splice(index, 1);
      this.atualizarQuantidades();
      this.separarProdutos();
    }
  }
  abrirModalConferencia(modalConferencia: any) {
    if (!this.venda.produtoVendas) {
      this.toastr.error('Nenhum produto adicionado.');
      return;
    }

    const agrupadosMap = new Map<string, ProdutoVenda>();

    for (const pv of this.venda.produtoVendas) {
      if (pv.id == null) {
        const chave = this.gerarChaveAgrupamento(pv);

        if (agrupadosMap.has(chave)) {
          const existente = agrupadosMap.get(chave)!;
          existente.quantidade += pv.quantidade;

          // 🔥 Atualiza o valor baseado na nova quantidade
          existente.valor = existente.produto.valor * existente.quantidade;
        } else {
          const novo = { ...pv };
          novo.valor = novo.produto.valor * novo.quantidade;
          agrupadosMap.set(chave, novo);
        }
      }
    }

    this.listaProdutosNovos = Array.from(agrupadosMap.values());

    // 🔥 Atualiza o valor total da venda
    this.valorTotal();

    this.modalRef = this.modalService.open(modalConferencia, {
      size: 'fullscreen',
    });
  }
  gerarChaveAgrupamento(pv: ProdutoVenda): string {
    const idProduto = pv.produto.id;

    const obsManual = pv.observacaoProdutoVenda?.trim() || '';

    const obsLista = (pv.observacoesProdutoVenda ?? [])
      .map((o) => o.observacao.trim())
      .sort()
      .join('|'); // Ordena e junta pra garantir que a ordem não influencie

    return `${idProduto}#${obsManual}#${obsLista}`;
  }

  retornoObservacaoTouch(event: any) {
    const { observacoesSelecionadas, observacaoManual, produtosSelecionados } =
      event;

    for (const produtoVenda of produtosSelecionados) {
      if (!produtoVenda.observacoesProdutoVenda) {
        produtoVenda.observacoesProdutoVenda = [];
      }

      for (const nova of observacoesSelecionadas) {
        const jaExiste = produtoVenda.observacoesProdutoVenda.some(
          (antiga: Observacoes) => antiga.id === nova.id
        );
        if (!jaExiste) {
          produtoVenda.observacoesProdutoVenda.push(nova);
        }
      }

      if (observacaoManual?.trim()) {
        if (produtoVenda.observacaoProdutoVenda) {
          produtoVenda.observacaoProdutoVenda += ' / ' + observacaoManual;
        } else {
          produtoVenda.observacaoProdutoVenda = observacaoManual;
        }
      }
    }
    this.valorTotal();
    this.modalRef?.close();
    this.deveAdicionarComObservacao = false;
  }

  editarObservacaoProdutoVenda(
    modalObservacaoTouch: any,
    produtoVenda: ProdutoVenda
  ) {
    this.produtosVendaSelecionados = [produtoVenda]; // agora o modal recebe só esse ProdutoVenda
    this.modalRef = this.modalService.open(modalObservacaoTouch, {
      size: 'lg',
      scrollable: true,
    });
  }
  editarObservacaoProdutoVendaDeve(
    modalObservacaoTouchDeve: any,
    produtoVenda: ProdutoVenda
  ) {
    this.produtoVendaSelecionada = produtoVenda;
    this.modalRef = this.modalService.open(modalObservacaoTouchDeve, {
      size: 'lg',
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
  }
  getProdutoVendasDoProduto(idProduto: number): ProdutoVenda[] {
    return (
      this.venda.produtoVendas?.filter(
        (pv) => pv.produto.id === idProduto && pv.id == null
      ) || []
    );
  }

  salvarVendaModoToch(modalPagamentos: any) {
    if (this.tipoCaixa === 'balcao') {
      this.pagar(this.chaveUnico, modalPagamentos);
    }
  }
  abrirModalVendaSelecionada(modalVendaSelecionada: any) {
    this.modalRef = this.modalService.open(modalVendaSelecionada, {
      size: 'fullscreen',
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
    if (this.tipoCaixa === 'entrega' || this.tipoCaixa === 'retirada') {
      this.modoPagar = true;
    }
  }
}
