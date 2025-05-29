import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TaxaEntregaKm } from '../models/taxaEntregaKm';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Matriz } from '../models/matriz';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class TaxaEntregaKmService {
  API: string = 'http://localhost:8080/api/taxasKm';
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarTaxasKm(): Observable<TaxaEntregaKm[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<TaxaEntregaKm[]>(
          `${this.API}/lista/${matriz.id}`
        );
      })
    );
  }

  salvarLista(lista: TaxaEntregaKm[], matriz: Matriz): Observable<Mensagem> {
    return this.http.post<Mensagem>(
      `${this.API}/salvarLista/${matriz.id}`,
      lista
    );
  }
}
