import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';
import { httpinterceptorInterceptor } from './interceptors/httpinterceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpinterceptorInterceptor])),
    provideToastr(),
    importProvidersFrom(BrowserAnimationsModule),
    provideEnvironmentNgxMask(),
    provideNgxMask()
  ],
};