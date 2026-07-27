import { vi } from 'vitest';

const UrlHashParamsProviderServiceMock = {
  "updateHashParamsStoreFromUrl": vi.fn(),
  "getHashURLSearchParams": vi.fn(),
  "setHashParams": vi.fn(),
  "updateHashParams": vi.fn(),
  "updateHashParam" : vi.fn(),
  "currentHashParams": vi.fn(()=>new URLSearchParams()),
};

UrlHashParamsProviderServiceMock.getHashURLSearchParams.mockReturnValue(new URLSearchParams({backend: "ohsomeApi"}));

export default UrlHashParamsProviderServiceMock;
