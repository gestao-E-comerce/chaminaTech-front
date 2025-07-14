import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Venda } from '../models/venda';
import { Relatorio } from '../models/relatorio';

@Injectable({
  providedIn: 'root',
})
export class RelatorioConsumoService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/consumo`;
  http = inject(HttpClient);

  gerarRelatorioConsumo(relatorio: Relatorio): Observable<Pagina<Venda>> {
    return this.http.post<Pagina<Venda>>(
      `${this.API}/gerarRelatorioConsumo`,
      relatorio
    );
  }
  gerarGraficoValorTotalConsumo(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.API}/graficoValorTotalConsumo`,
      relatorio
    );
  }

  gerarGraficoTipoVendaConsumo(relatorio: Relatorio): Observable<any> {
    return this.http.post<any>(`${this.API}/graficoTipoVendaConsumo`, relatorio);
  }
}
