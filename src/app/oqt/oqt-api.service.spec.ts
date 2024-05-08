import {TestBed} from '@angular/core/testing';

import {OqtApiService} from './oqt-api.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../environments/environment';


describe('OqtApiServiceService', () => {
  let service: OqtApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
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
});
