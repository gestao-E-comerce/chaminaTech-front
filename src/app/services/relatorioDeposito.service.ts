import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { Deposito } from '../models/deposito';

@Injectable({
  providedIn: 'root',
})
export class RelatorioDepositoService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/deposito`;
  http = inject(HttpClient);

  gerarRelatorioDeposito(relatorio: Relatorio): Observable<Pagina<Deposito>> {
    return this.http.post<Pagina<Deposito>>(
      `${this.API}/gerarRelatorioDeposito`,
      relatorio
    );
  }
  gerarGraficoResumoDeposito(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoResumoDeposito`, relatorio);
  }
}
