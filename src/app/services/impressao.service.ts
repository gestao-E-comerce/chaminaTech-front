import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Venda } from '../models/venda';
import { ProdutoVenda } from '../models/produto-venda';
import { Mensagem } from '../models/mensagem';
import { Observable } from 'rxjs';
import { Sangria } from '../models/sangria';
import { Suprimento } from '../models/suprimento';
import { Caixa } from '../models/caixa';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class ImpressaoService {
  private readonly API = `${Config.BACKEND_URL}/api/impressao`;
  http = inject(HttpClient);

  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }

  imprimirProdutos(impressao: {
    venda: Venda;
    produtos: ProdutoVenda[];
  }): Observable<Mensagem> {
    impressao.venda.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/produtos`, impressao);
  }

  imprimirConta(impressao: {
    venda: Venda;
    quantedade: number;
  }): Observable<Mensagem> {
    impressao.venda.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/conta`, impressao);
  }

  imprimirConferencia(venda: Venda): Observable<Mensagem> {
    venda.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/conferencia`, venda);
  }
  imprimirComprovante(venda: Venda): Observable<Mensagem> {
    venda.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/comprovante`, venda);
  }
  // imprimirNotaFiscal(venda: Venda): Observable<Mensagem> {
  //   return this.http.post<Mensagem>(`${this.API}/notaFiscal`, venda);
  // }
  imprimirSangria(sangria: Sangria): Observable<Mensagem> {
    sangria.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/sangria`, sangria);
  }
  imprimirSuprimento(suprimento: Suprimento): Observable<Mensagem> {
    suprimento.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/suprimento`, suprimento);
  }
  imprimirAbertura(caixa: Caixa): Observable<Mensagem> {
    caixa.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/abertura`, caixa);
  }
  imprimirConferenciaCaixa(caixa: Caixa): Observable<Mensagem> {
    caixa.nomeImpressora = this.getNomeImpressora();
    return this.http.post<Mensagem>(`${this.API}/conferenciaCaixa`, caixa);
  }
}
