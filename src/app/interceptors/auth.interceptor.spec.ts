import {TestBed} from '@angular/core/testing';
import {HttpContext, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';

import {authInterceptor} from './auth.interceptor';

import {AuthService} from '../singelton-services/auth.service';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {SKIP_AUTH} from './skip-auth.token';

const mockAuthService = {
  key: () => ({key: 'test-token'})
};

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: mockAuthService},
      ]
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it.each([
    {
      name: 'should add Authorization header when SKIP_AUTH is false',
      skipAuth: false,
      expectAuthHeader: true
    },
    {
      name: 'should NOT add Authorization header when SKIP_AUTH is true',
      skipAuth: true,
      expectAuthHeader: false
    }
  ])('$name', ({ skipAuth, expectAuthHeader }) => {

    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpContext().set(SKIP_AUTH, skipAuth)
    });

    const next = vi.fn((r: HttpRequest<any>) => ({
      subscribe: (fn: any) => fn(r)
    }));

    TestBed.runInInjectionContext(() =>
      authInterceptor(req, next as any)
    );

    const passedReq = next.mock.calls[0][0] as HttpRequest<any>;
    const authHeader = passedReq.headers.get('Authorization');

    if (expectAuthHeader) {
      expect(authHeader).toBe('test-token');
    } else {
      expect(authHeader).toBeNull();
    }
  });

});
