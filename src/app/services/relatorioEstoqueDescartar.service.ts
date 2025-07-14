import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { EstoqueDescartar } from '../models/estoque-descartar';

@Injectable({
  providedIn: 'root',
})
export class RelatorioEstoqueDescartarService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/estoqueDescartar`;
  http = inject(HttpClient);

  gerarRelatorioEstoqueDescartar(relatorio: Relatorio): Observable<Pagina<EstoqueDescartar>> {
    return this.http.post<Pagina<EstoqueDescartar>>(
      `${this.API}/gerarRelatorioEstoqueDescartar`,
      relatorio
    );
  }
  gerarGraficoResumoEstoqueDescartar(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoResumoEstoqueDescartar`, relatorio);
  }
}
