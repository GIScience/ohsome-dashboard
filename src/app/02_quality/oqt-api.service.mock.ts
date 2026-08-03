import { vi } from 'vitest';

const OqtApiServiceMock =
  {
    'get': vi.fn(),
    'post': vi.fn(),
    'getMetadata': vi.fn(),
    'getIndicator': vi.fn(),
    'getIndicatorCoverage': vi.fn(),
    'getAttributes': vi.fn(),
  };

export default OqtApiServiceMock;
