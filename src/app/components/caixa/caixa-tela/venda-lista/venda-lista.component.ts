import { ActivatedRoute, Router } from '@angular/router';
import { VendaService } from '../../../../services/venda.service';
import { GestaoCaixaService } from '../../../../services/gestao-caixa.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Venda } from '../../../../models/venda';
import { GestaoCaixa } from '../../../../models/gestao-caixa';
import { GlobalService } from '../../../../services/global.service';
import { SocketService } from '../../../../services/socket.service';
import { take } from 'rxjs';
import { Matriz } from '../../../../models/matriz';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-venda-lista',
  standalone: true,
  imports: [NgClass, CurrencyPipe],
  templateUrl: './venda-lista.component.html',
  styleUrl: './venda-lista.component.scss',
})
export class VendaListaComponent implements OnInit {
  @Output() vendaDuploClique = new EventEmitter<{
    venda?: Venda;
    gestaoCaixa?: GestaoCaixa;
  }>();

  gestaoCaixaService = inject(GestaoCaixaService);
  globalService = inject(GlobalService);
  socketService = inject(SocketService);
  vendaService = inject(VendaService);
  rota = inject(ActivatedRoute);
  router = inject(Router);

  listaVendas: {
    numero: number;
    statusEmAberto: boolean;
    statusEmPagamento: boolean;
  }[] = [];
  listaVendasCliente: {
    numero: number;
    statusEmAberto: boolean;
    statusEmPagamento: boolean;
    cliente: string;
    id: number;
    dataVenda: string;
    tempoPrevisto: number;
    atrasada?: boolean;
  }[] = [];

  matriz: Matriz = new Matriz();
  urlString!: string;
  tipoCaixa!: string;
  tituloTotal!: string;
  intervalId: any;
  totalVendasNumer: number = 0;
  totalVenda: number = 0;
  tempo!: string;
  exibirTotal: boolean = false;

  toggleTotalVisibility(): void {
    this.exibirTotal = !this.exibirTotal;
  }
  ngOnInit() {
    this.urlString = this.router.url.split('/')[1] ?? '';

    this.rota.params.subscribe((params) => {
      this.tipoCaixa = params['tipoCaixa'];
      this.tituloTotal =
        this.tipoCaixa === 'mesa'
          ? 'Total Mesas'
          : this.tipoCaixa === 'entrega'
          ? 'Total Entregas'
          : 'Total Retiradas';

      this.globalService
        .getMatrizAsync()
        .pipe(take(1))
        .subscribe({
          next: (matriz) => {
            this.matriz = matriz;

            // ✅ LISTAR VENDAS IMEDIATAMENTE
            switch (this.tipoCaixa) {
              case 'mesa':
                this.listarNumerosMesas();
                break;
              case 'entrega':
                this.listarCuponsEntrega();
                break;
              case 'retirada':
                this.listarCuponsRetirada();
                break;
            }

            // ✅ ASSINAR O SOCKET APÓS LISTAGEM INICIAL
            this.socketService.subscribe(
              `/topic/venda/${matriz.id}`,
              (notificacao: any) => {
                if (notificacao.tipo === this.tipoCaixa) {
                  if (notificacao.acao === 'atrasada') {
                    this.marcarVendaComoAtrasada(notificacao.venda?.id);
                    return;
                  }
                  switch (this.tipoCaixa) {
                    case 'mesa':
                      this.listarNumerosMesas();
                      break;
                    case 'entrega':
                      this.listarCuponsEntrega();
                      break;
                    case 'retirada':
                      this.listarCuponsRetirada();
                      break;
                  }
                }
              }
            );
          },
        });
    });
  }

  marcarVendaComoAtrasada(vendaId: number) {
    const venda = this.listaVendasCliente.find((v) => v.id === vendaId);
    if (venda) {
      venda.atrasada = true;
    }
  }
  listarNumerosMesas() {
    if (this.tipoCaixa !== 'mesa') return;
    this.vendaService.buscarNumeroMesasByMatrizId().subscribe({
      next: (numeros) => {
        this.listaVendas = numeros;
        this.totalVendasNumer = numeros.length;
        this.atualizarTotalVenda();
      },
      error: (err) => {
        console.error('Erro ao listar Mesas', err);
      },
    });
  }
  listarCuponsEntrega() {
    if (this.tipoCaixa !== 'entrega') return;
    this.gestaoCaixaService.buscarCuponsEntregaByMatrizId().subscribe({
      next: (numeros) => {
        const agora = new Date().getTime();
        this.listaVendasCliente = numeros.map((venda) => {
          const dataVenda = new Date(venda.dataVenda).getTime();
          const tempoLimite = dataVenda + venda.tempoPrevisto * 60000;
          return {
            ...venda,
            atrasada: agora > tempoLimite,
          };
        });
        this.totalVendasNumer = this.listaVendasCliente.length;
        this.atualizarTotalVenda();
      },
      error: (err) => {
        console.error('Erro ao listar cupons', err);
      },
    });
  }
  listarCuponsRetirada() {
    if (this.tipoCaixa !== 'retirada') return;
    this.gestaoCaixaService.buscarCuponsRetiradaByMatrizId().subscribe({
      next: (numeros) => {
        const agora = new Date().getTime();
        this.listaVendasCliente = numeros.map((venda) => {
          const dataVenda = new Date(venda.dataVenda).getTime();
          const tempoLimite = dataVenda + venda.tempoPrevisto * 60000;
          return {
            ...venda,
            atrasada: agora > tempoLimite,
          };
        });
        this.totalVendasNumer = numeros.length;
        this.atualizarTotalVenda();
      },
      error: (err) => {
        console.error('Erro ao listar cupons', err);
      },
    });
  }

  atualizarTotalVenda() {
    if (this.urlString === 'caixa' && this.tipoCaixa !== 'balcao') {
      this.vendaService.buscarTotalVendaPorMatriz(this.tipoCaixa).subscribe({
        next: (totalVenda) => {
          this.totalVenda = totalVenda;
        },
        error: (err) => {
          console.error('❌ Erro ao calcular o total de vendas', err);
        },
      });
    }
  }

  abrirVendaSelecionada(venda: number) {
    if (this.tipoCaixa === 'mesa') {
      this.vendaService
        .buscarMesaAtivaByMatrizId(venda)
        .subscribe((vendaEncontrada: Venda) => {
          this.vendaDuploClique.emit({ venda: vendaEncontrada });
          // Calculando o tempo de permanência
          if (vendaEncontrada.dataVenda) {
            const dataVenda = new Date(vendaEncontrada.dataVenda);
            const dataAtual = new Date();
            const tempoEmMs = dataAtual.getTime() - dataVenda.getTime();

            // Verificar se tempoEmMs é um número válido
            if (!isNaN(tempoEmMs)) {
              const horas = Math.floor(tempoEmMs / 3600000);
              const minutos = Math.floor((tempoEmMs % 3600000) / 60000);
              const segundos = Math.floor((tempoEmMs % 60000) / 1000);

              this.tempo = `${horas < 10 ? '0' + horas : horas}:${
                minutos < 10 ? '0' + minutos : minutos
              }:${segundos < 10 ? '0' + segundos : segundos}`;
            } else {
              this.tempo = '00:00:00';
            }
          } else {
            this.tempo = '00:00:00';
          }
        });
    } else if (this.tipoCaixa === 'entrega') {
      this.gestaoCaixaService
        .findByCupomAndAtivoAndEntregaAndMatrizId(venda)
        .subscribe((cupom: GestaoCaixa) => {
          this.vendaDuploClique.emit({ gestaoCaixa: cupom });
        });
    } else if (this.tipoCaixa === 'retirada') {
      this.gestaoCaixaService
        .findByCupomAndAtivoAndRetiradaAndMatrizId(venda)
        .subscribe((cupom: GestaoCaixa) => {
          this.vendaDuploClique.emit({ gestaoCaixa: cupom });
        });
    }
  }
  limparVendaSelecionada() {
    this.tempo = '00:00:00';
  }
}
