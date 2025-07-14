import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Pagina } from '../models/pagina';
import { Relatorio } from '../models/relatorio';
import { Sangria } from '../models/sangria';

@Injectable({
  providedIn: 'root',
})
export class RelatorioSangriaService {
  private readonly API = `${Config.BACKEND_URL}/relatorio/sangria`;
  http = inject(HttpClient);

  gerarRelatorioSangria(relatorio: Relatorio): Observable<Pagina<Sangria>> {
    return this.http.post<Pagina<Sangria>>(
      `${this.API}/gerarRelatorioSangria`,
      relatorio
    );
  }
  gerarGraficoTipoSangria(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoTipoSangria`, relatorio);
  }
  gerarGraficoTotalSangria(relatorio: Relatorio): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/graficoTotalSangria`, relatorio);
  }
}
