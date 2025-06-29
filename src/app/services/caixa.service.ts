import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Caixa } from '../models/caixa';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class CaixaService {
  private readonly API = `${Config.BACKEND_URL}/caixa`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarCaixaAtivaPorFuncionario(
    funcionarioId: number
  ): Observable<Caixa | null> {
    return this.http.get<Caixa | null>(
      `${this.API}/caixa-ativa/${funcionarioId}`
    );
  }

  buscarPorId(id: number): Observable<Caixa> {
    return this.http.get<Caixa>(this.API + '/' + `${id}`);
  }

  listarCaixas(nome?: string, tipo?: string): Observable<Caixa[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        
        if (nome) {
          params = params.set('nome', nome);
        }
        if (tipo) {  // O tipo agora pode ser 'aberto', 'fechado' ou undefined
          params = params.set('tipo', tipo);
        }
  
        return this.http.get<Caixa[]>(`${this.API}/buscarCaixas`, { params });
      })
    );
  }

  abrirCaixa(caixa: Caixa): Observable<Caixa> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        caixa.matriz = matriz;
        return this.http.post<Caixa>(this.API, caixa);
      })
    );
  }
  fecharCaixa(caixa: Caixa): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        caixa.matriz = matriz;
        return this.http.put<Mensagem>(`${this.API}/fechar-caixa/${caixa.id}`, caixa);
      })
    );
  }

  editar(caixa: Caixa): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        caixa.matriz = matriz;
        return this.http.put<Mensagem>(`${this.API}/editar/${caixa.id}`, caixa);
      })
    );
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
  verificarVendaAtiva(): Observable<boolean> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<boolean>(`${this.API}/vendaAtiva/${matriz.id}`);
      })
    );
  }
  getTotalPixByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalPix`);
  }

  getTotalDinheiroByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalDinheiro`);
  }

  getTotalDebitoByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalDebito`);
  }

  getTotalCreditoByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalCredito`);
  }

  getTotalSangriasByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalSangrias`);
  }

  getTotalSuprimentosByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalSuprimentos`);
  }
  getTotalGorjetasByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalGorjetas`);
  }
  getTotalDescontosByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalDescontos`);
  }
  getTotalServicosByCaixaId(caixaId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${caixaId}/totalServicos`);
  }
}
