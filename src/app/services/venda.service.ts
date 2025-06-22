import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Venda } from '../models/venda';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private readonly API = `${Config.BACKEND_URL}/venda`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarPorId(id: number): Observable<Venda> {
    return this.http.get<Venda>(this.API + '/' + `${id}`);
  }

  buscarMesaAtivaByMatrizId(mesa: number): Observable<Venda> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Venda>(
          `${this.API}/mesa/${mesa}/matriz/${matriz.id}`
        );
      })
    );
  }

  buscarNumeroMesasByMatrizId(): Observable<
    { numero: number; statusEmAberto: boolean; statusEmPagamento: boolean }[]
  > {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<
          {
            numero: number;
            statusEmAberto: boolean;
            statusEmPagamento: boolean;
          }[]
        >(`${this.API}/mesasAtivas/${matriz.id}`);
      })
    );
  }

  save(venda: Venda, chaveUnico: string): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        venda.matriz = matriz;
        if (venda.id) {
          const headers = new HttpHeaders().set('chaveUnico', chaveUnico);
          return this.http.put<Mensagem>(`${this.API}/${venda.id}`, venda, {
            headers,
          });
        } else {
          return this.http.post<Mensagem>(this.API, venda);
        }
      })
    );
  }
  saveSimples(venda: Venda): Observable<Venda> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        venda.matriz = matriz;
        return this.http.post<Venda>(`${this.API}/cadastrarSimples`, venda);
      })
    );
  }
  transferir(transferenciaDTO: {
    vendaOriginal: Venda;
    vendaDestino: Venda;
  }): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        transferenciaDTO.vendaOriginal.matriz = matriz;
        transferenciaDTO.vendaDestino.matriz = matriz;

        return this.http.post<Mensagem>(
          `${this.API}/transferir`,
          transferenciaDTO
        );
      })
    );
  }

  pagamentoParcial(parcialDTO: {
    vendaOriginal: Venda;
    vendaParcial: Venda;
    chaveUnico: string;
  }): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        parcialDTO.vendaOriginal.matriz = matriz;
        parcialDTO.vendaParcial.matriz = matriz;

        return this.http.post<Mensagem>(
          `${this.API}/parcial`,
          parcialDTO
        );
      })
    );
  }

  deletar(venda: Venda): Observable<Mensagem> {
    return this.http.put<Mensagem>(`${this.API}/deletar/${venda.id}`, venda);
  }

  marcarVendaEmUso(vendaId: number): Observable<Mensagem> {
    return this.http.put<Mensagem>(
      `${this.API}/${vendaId}/marcar-em-uso`,
      vendaId
    );
  }
  marcarVendaEmPagamento(vendaId: number): Observable<Mensagem> {
    return this.http.put<Mensagem>(
      `${this.API}/${vendaId}/marcar-em-pagamento`,
      vendaId
    );
  }
  liberarVendaPorNumero(numero: number, tipo: string): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let matrizId = matriz.id;
        return this.http.put<Mensagem>(`${this.API}/liberarPorNumero`, {
          numero,
          matrizId,
          tipo,
        });
      })
    );
  }
  liberarVenda(vendaId: number): Observable<Mensagem> {
    return this.http.put<Mensagem>(`${this.API}/${vendaId}/liberar`, vendaId);
  }
  deletarMesa(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/deletarMesa/${id}`);
  }

  buscarTotalVendaPorMatriz(tipoVenda: string): Observable<number> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<number>(
          `${this.API}/totalVenda/${matriz.id}/${tipoVenda}`
        );
      })
    );
  }
}
