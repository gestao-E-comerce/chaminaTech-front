import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Matriz } from '../models/matriz';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class MatrizService {
  private readonly API = `${Config.BACKEND_URL}/api/matriz`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarFilhosPorMatrizId(): Observable<Matriz[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Matriz[]>(`${this.API}/lista/${matriz.id}`);
      })
    );
  }

  save(matriz: Matriz): Observable<Mensagem> {
    if (matriz.id) {
      return this.http.put<Mensagem>(`${this.API}/${matriz.id}`, matriz);
    } else {
      return this.http.post<Mensagem>(this.API, matriz);
    }
  }

  ativarOuDesativarMatriz(Matriz: Matriz): Observable<Mensagem> {
    return this.http.put<Mensagem>(
      `${this.API}/desativar/${Matriz.id}`,
      Matriz
    );
  }

  instalar(matrizId: number): Observable<Blob> {
    return this.http.get(
      `http://localhost:8080/installer/download?matrizId=${matrizId}`,
      {
        responseType: 'blob',
      }
    );
  }
}
