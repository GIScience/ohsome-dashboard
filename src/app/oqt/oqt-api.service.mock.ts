import {OqtApiService} from './oqt-api.service';
import createSpyObj = jasmine.createSpyObj;

const OqtApiServiceMock: jasmine.SpyObj<OqtApiService> = createSpyObj(
  'OqtApiService',
  [
    'get',
    'post',
    'getMetadata',
    'getIndicator',
    'getIndicatorCoverage',
    'getAttributes',
  ]);

export default OqtApiServiceMock;
