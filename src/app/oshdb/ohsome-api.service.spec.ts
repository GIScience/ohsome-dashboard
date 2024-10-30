import {TestBed} from '@angular/core/testing';

import {OhsomeApiService} from './ohsome-api.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {environment} from '../../environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: OhsomeApiService;
let httpMock: HttpTestingController;

describe('OhsomeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [OhsomeApiService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(OhsomeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request to ohsome API to a specified endpoint', () => {
    service.get('test').subscribe(() => {
    });
    const req = httpMock.expectOne(`${environment.oshdbRestApiRootUrl}/test`);
    expect(req.request.method).toEqual('GET');
  });

  it('should perform a GET request to ohsome API with query params', () => {
    service.get('test2', 'param=value&param2=value2').subscribe(() => {
    });
    const req = httpMock.expectOne(`${environment.oshdbRestApiRootUrl}/test2?param=value&param2=value2`);
    expect(req.request.method).toEqual('GET');
  });

  it('should perform a POST request to ohsome API', () => {
    service.post('test', 'param=value').subscribe(() => {
    });
    const req = httpMock.expectOne(`${environment.oshdbRestApiRootUrl}/test`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual('param=value');
  });

  it('should perform a GET request to the ohsome dashboard status page', () => {
    service.getOhsomeApiAnnouncement().subscribe(() => {
    });
    const req = httpMock.expectOne(environment.announcementUrl);
    expect(req.request.method).toEqual('GET');
  });

});
