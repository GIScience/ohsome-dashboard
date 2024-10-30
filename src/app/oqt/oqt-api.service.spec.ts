import {TestBed} from '@angular/core/testing';

import {OqtApiService} from './oqt-api.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {environment} from '../../environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('OqtApiServiceService', () => {
  let service: OqtApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(OqtApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request to ohsome quality api', () => {
    service.get('test').subscribe(() => {});
    const req = httpMock.expectOne(`${environment.oqtApiRootUrl}/test`);
    expect(req.request.method).toEqual('GET');
  })

  it('should perform a GET request with params to ohsome quality api', () => {
    service.get('test', 'p1=v1&p2=v2').subscribe(() => {});
    const req = httpMock.expectOne(`${environment.oqtApiRootUrl}/test?p1=v1&p2=v2`);
    expect(req.request.method).toEqual('GET');
  })

  it('should perform a POST request to ohsome quality api', () => {
    service.post('test', 'param=value').subscribe(() => {
    });
    const req = httpMock.expectOne(`${environment.oqtApiRootUrl}/test`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual('param=value');
  });

  it('should perform a GET request to /metadata endpoint with project param', () => {
    service.getMetadata().subscribe(() => {});
    const req = httpMock.expectOne(`${environment.oqtApiRootUrl}/metadata?project=${service.OQT_API_PROJECT}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get("project")).toEqual(service.OQT_API_PROJECT);
  });

  it('should perform a GET request to /metadata/indicators/${indicatorKey}/coverage', () => {
    const indicatorKey = "road-comparison";
    const inverse = false;
    service.getIndicatorCoverage(indicatorKey, inverse).subscribe(() => {
    });
    const req = httpMock.expectOne(`${environment.oqtApiRootUrl}/metadata/indicators/${indicatorKey}/coverage?inverse=${inverse}`);
    expect(req.request.method).toEqual('GET');
  });

  it('should perform a GET request to /metadata/attributes', () => {
    service.getAttributes().subscribe(() => {
    });
    const req = httpMock.expectOne(`${environment.oqtApiRootUrl}/metadata/attributes`);
    expect(req.request.method).toEqual('GET');
  });
});
