import {HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '../singelton-services/auth.service';
import {inject} from '@angular/core';
import {SKIP_AUTH} from './skip-auth.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // option to skip the interceptor for specific requests
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.key().key;

  // do not set an undefined Authorization header
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      'Authorization': token
    }
  });

  return next(authReq);
};
