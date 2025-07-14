import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { DepositoDescartar } from '../models/deposito-descartar';

@Injectable({
  providedIn: 'root',
})
export class RelatorioDepositoDescartarService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/depositoDescartar`;
  http = inject(HttpClient);

  gerarRelatorioDepositoDescartar(relatorio: Relatorio): Observable<Pagina<DepositoDescartar>> {
    return this.http.post<Pagina<DepositoDescartar>>(
      `${this.API}/gerarRelatorioDepositoDescartar`,
      relatorio
    );
  }
  gerarGraficoResumoDepositoDescartar(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoResumoDepositoDescartar`, relatorio);
  }
}
