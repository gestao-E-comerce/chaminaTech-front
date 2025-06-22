import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Venda } from '../models/venda';
import { ProdutoVenda } from '../models/produto-venda';
import { Mensagem } from '../models/mensagem';
import { EMPTY, Observable } from 'rxjs';
import { Sangria } from '../models/sangria';
import { Suprimento } from '../models/suprimento';
import { Caixa } from '../models/caixa';
import { Config } from '../../config';
import { Gorjeta } from '../models/gorjeta';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ImpressaoService {
  private readonly API = `${Config.BACKEND_URL}/impressao`;
  http = inject(HttpClient);
  toastr = inject(ToastrService);

  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }

  private verificarImpressora(): string | null {
    const nome = this.getNomeImpressora();
    if (!nome) {
      this.toastr.warning(
        'Nenhuma impressora definida. Configure antes de imprimir.'
      );
    }
    return nome;
  }

  imprimirProdutos(impressao: {
    venda: Venda;
    produtos: ProdutoVenda[];
  }): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    impressao.venda.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/produtos`, impressao);
  }

  imprimirConta(impressao: {
    venda: Venda;
    quantedade: number;
  }): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    impressao.venda.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/conta`, impressao);
  }

  imprimirConferencia(venda: Venda): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    venda.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/conferencia`, venda);
  }
  imprimirComprovante(venda: Venda): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    venda.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/comprovante`, venda);
  }
  // imprimirNotaFiscal(venda: Venda): Observable<Mensagem> {
  //   return this.http.post<Mensagem>(`${this.API}/notaFiscal`, venda);
  // }
  imprimirSangria(sangria: Sangria): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    sangria.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/sangria`, sangria);
  }
  imprimirSuprimento(suprimento: Suprimento): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    suprimento.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/suprimento`, suprimento);
  }
  imprimirGorjeta(gorjeta: Gorjeta): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    gorjeta.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/gorjeta`, gorjeta);
  }
  imprimirAbertura(caixa: Caixa): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    caixa.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/abertura`, caixa);
  }
  imprimirConferenciaCaixa(caixa: Caixa): Observable<Mensagem> {
    const nome = this.verificarImpressora();
    if (!nome) return EMPTY;
    caixa.nomeImpressora = nome;
    return this.http.post<Mensagem>(`${this.API}/conferenciaCaixa`, caixa);
  }
}
