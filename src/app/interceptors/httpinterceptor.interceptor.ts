import {
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  catchError,
  from,
  switchMap,
  throwError,
  tap,
  Observable,
  defer,
} from 'rxjs';
import { UsuarioComponent } from '../components/usuario/usuario.component';

let isReauthenticating = false;
let reauthenticationPromise: Promise<string | null> | null = null;

let failedRequests: {
  request: HttpRequest<any>;
  next: HttpHandlerFn;
  observer: {
    next: (value: HttpEvent<any>) => void;
    error: (err: any) => void;
    complete: () => void;
  };
}[] = [];

export const httpinterceptorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const modalService = inject(NgbModal);

  if (request.url.includes('/api/login')) {
    return next(request);
  }

  const token = localStorage.getItem('token');
  if (token) {
    request = request.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }

  return defer(() =>
    next(request).pipe(
      catchError((err: any) => {
        if (err.status === 401 || err.status === 403) {
          return new Observable<HttpEvent<any>>((observer) => {
            failedRequests.push({ request, next, observer });

            if (!isReauthenticating) {
              isReauthenticating = true;
              toastr.error(
                'Sua sessão expirou. Por favor, faça login novamente.'
              );

              const modalRef = modalService.open(UsuarioComponent, {
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
              });

              reauthenticationPromise = modalRef.result
                .then((newToken: string | null) => newToken)
                .catch(() => null)
                .finally(() => {
                  isReauthenticating = false;
                  reauthenticationPromise = null;
                });

              from(reauthenticationPromise).subscribe((newToken) => {
                if (newToken) {
                  localStorage.setItem('token', newToken);

                  // Reenvia todas as requisições pendentes
                  failedRequests.forEach(({ request, next, observer }) => {
                    const retriedRequest = request.clone({
                      setHeaders: { Authorization: 'Bearer ' + newToken },
                    });

                    next(retriedRequest).subscribe({
                      next: (res: HttpEvent<any>) => observer.next(res),
                      error: (err: any) => observer.error(err),
                      complete: () => observer.complete(),
                    });
                  });

                  failedRequests = [];
                } else {
                  failedRequests.forEach(({ observer }) => {
                    observer.error(err);
                  });
                  failedRequests = [];
                  router.navigate(['/login']);
                }
              });
            }
          });
        }

        if (err.status === 500) {
          toastr.error(
            'Falha no servidor. Por favor, tente novamente mais tarde.'
          );
        }
        if (err.status === 412) {
          toastr.error('Usuário desativado');
          router.navigate(['/login']);
        }

        if (err.status === 423) {
          toastr.error("Você não tem permissão para essa funcionalidade.");
        }

        return throwError(() => err);
      }),

      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const newToken = event.headers.get('Authorization');
          if (newToken) {
            localStorage.setItem('token', newToken.replace('Bearer ', ''));
          }
        }
      })
    )
  );
};
