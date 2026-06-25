import { vi } from 'vitest';

const UrlHashParamsProviderServiceMock = {
  "updateHashParamsStoreFromUrl": vi.fn(),
  "getHashURLSearchParams": vi.fn(),
  "setHashParams": vi.fn(),
  "updateHashParams": vi.fn(),
  "updateHashParam" : vi.fn(),
};

UrlHashParamsProviderServiceMock.getHashURLSearchParams.mockReturnValue(new URLSearchParams({backend: "ohsomeApi"}));

export default UrlHashParamsProviderServiceMock;
