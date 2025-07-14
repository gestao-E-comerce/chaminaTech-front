import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { Estoque } from '../models/estoque';

@Injectable({
  providedIn: 'root',
})
export class RelatorioEstoqueService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/estoque`;
  http = inject(HttpClient);

  gerarRelatorioEstoque(relatorio: Relatorio): Observable<Pagina<Estoque>> {
    return this.http.post<Pagina<Estoque>>(
      `${this.API}/gerarRelatorioEstoque`,
      relatorio
    );
  }
  gerarGraficoResumoEstoque(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoResumoEstoque`, relatorio);
  }
}
