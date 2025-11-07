import { TestBed } from '@angular/core/testing';

import { UrlHashParamsProviderService } from './url-hash-params-provider.service';

describe('UrlHashParamsProviderService', () => {
  let service: UrlHashParamsProviderService;
  let originalHash: string;

  beforeEach(() => {
    originalHash = window.location.hash; // save before test
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlHashParamsProviderService);
    window.location.hash = ''; // clean start
  });

  afterEach(() => {
    window.location.hash = originalHash; // restore
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update internal signal based on window.location.hash', () => {
    window.location.hash = 'foo=bar&baz=qux';

    service.updateHashParamsStoreFromUrl();

    const params = service.currentHashParams();
    expect(params.get('foo')).toBe('bar');
    expect(params.get('baz')).toBe('qux');
  });

  it('should return URLSearchParams, updating from URL if needed', () => {
    window.location.hash = 'alpha=beta';

    const params = service.getHashURLSearchParams();

    expect(params.get('alpha')).toBe('beta');
  });

  it('should completely exchange params: update currentHashParams signal and window.location.hash', () => {
    window.location.hash = 'alpha=beta';
    service.updateHashParamsStoreFromUrl();

    service.setHashParams({ foo: 'bar', baz: 'qux' });

    const params = service.currentHashParams();
    expect(params.get('foo')).toBe('bar');
    expect(params.get('baz')).toBe('qux');
    expect(params.get('alpha')).toBeNull();

    expect(window.location.hash).toContain('foo=bar');
    expect(window.location.hash).toContain('baz=qux');
    expect(window.location.hash).not.toContain('alpha=beta');
  });

  it('should merge new params into existing ones', () => {
    service.setHashParams({ foo: 'bar', baz: 'qux' });
    service.updateHashParams({ baz: 'updated', extra: '1' });

    const params = service.currentHashParams();
    expect(params.get('foo')).toBe('bar');          // old preserved
    expect(params.get('baz')).toBe('updated');      // updated
    expect(params.get('extra')).toBe('1');          // new added
  });

  it('should update a single hash param', () => {
    service.setHashParams({ a: '1', b: '2' });
    service.updateHashParam('b', '99');

    const params = service.currentHashParams();
    expect(params.get('a')).toBe('1');
    expect(params.get('b')).toBe('99');
  });
});
