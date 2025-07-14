import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { Suprimento } from '../models/suprimento';

@Injectable({
  providedIn: 'root',
})
export class RelatorioSuprimentoService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/suprimento`;
  http = inject(HttpClient);

  gerarRelatorioSuprimento(relatorio: Relatorio): Observable<Pagina<Suprimento>> {
    return this.http.post<Pagina<Suprimento>>(
      `${this.API}/gerarRelatorioSuprimento`,
      relatorio
    );
  }
  gerarGraficoTotalSuprimento(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoTotalSuprimento`, relatorio);
  }
}
