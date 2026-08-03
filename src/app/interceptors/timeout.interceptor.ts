import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TIMEOUT_RULES, DEFAULT_TIMEOUT } from './timeout-config';

function resolveTimeout(url: string): number {
  const rule = TIMEOUT_RULES.find(r =>
    typeof r.pattern === 'string' ? url.includes(r.pattern) : r.pattern.test(url)
  );
  return rule?.timeout ?? DEFAULT_TIMEOUT;
}

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const ms = resolveTimeout(req.url);

  return next(req).pipe(
    timeout(ms),
    catchError(err => {
      if (err.name === 'TimeoutError') {
        return throwError(() => new HttpErrorResponse({
          error: `Request to ${req.url} timed out after ${ms}ms`,
          status: 408,
          statusText: 'Request Timeout',
          url: req.url,
        }));
      }
      return throwError(() => err);
    })
  );
};
