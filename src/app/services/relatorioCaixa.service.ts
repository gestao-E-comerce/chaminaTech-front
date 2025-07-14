import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { Caixa } from '../models/caixa';

@Injectable({
  providedIn: 'root',
})
export class RelatorioCaixaService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/caixa`;
  http = inject(HttpClient);

  gerarRelatorioCaixa(relatorio: Relatorio): Observable<Pagina<Caixa>> {
    return this.http.post<Pagina<Caixa>>(
      `${this.API}/gerarRelatorioCaixa`,
      relatorio
    );
  }
  gerarGraficoResumoCaixa(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoResumoCaixa`, relatorio);
  }
  gerarGraficoComposicaoSaldoCaixa(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoComposicaoSaldoCaixa`, relatorio);
  }
}
