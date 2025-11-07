import createSpyObj = jasmine.createSpyObj;

const UrlHashParamsProviderServiceMock = createSpyObj(
  "UrlHashParamsProviderService",
  [
    "updateHashParamsStoreFromUrl",
    "getHashURLSearchParams",
    "setHashParams",
    "updateHashParams",
    "updateHashParam"
  ]
);

UrlHashParamsProviderServiceMock.getHashURLSearchParams.and.returnValue(new URLSearchParams({backend: "ohsomeApi"}));

export default UrlHashParamsProviderServiceMock;
