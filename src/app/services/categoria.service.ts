import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Categoria } from '../models/categoria';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly API = `${Config.BACKEND_URL}/api/categoria`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(this.API + '/' + `${id}`);
  }

  listarCategorias(
      ativo?: string,
      nome?: string
    ): Observable<Categoria[]> {
      return this.globalService.getMatrizAsync().pipe(
        switchMap((matriz) => {
          let params = new HttpParams().set('matrizId', matriz.id.toString());
          params = params.set('deletado', false);
  
          if (ativo != null && ativo !== '') {
            params = params.set('ativo', ativo);
          }
          if (nome != null && nome !== '') {
            params = params.set('nome', nome);
          }
          return this.http.get<Categoria[]>(`${this.API}/lista`, {
            params,
          });
        })
      );
    }

  save(categoria: Categoria): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        categoria.matriz = matriz;
        if (categoria.id) {
          return this.http.put<Mensagem>(
            `${this.API}/${categoria.id}`,
            categoria
          );
        } else {
          return this.http.post<Mensagem>(this.API, categoria);
        }
      })
    );
  }

  ativarOuDesativarCategoria(categoria: Categoria): Observable<Mensagem> {
      return this.globalService.getMatrizAsync().pipe(
        switchMap((matriz) => {
          categoria.matriz = matriz;
          return this.http.put<Mensagem>(
            `${this.API}/desativar/${categoria.id}`,
            categoria
          );
        })
      );
    }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
