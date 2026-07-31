import {afterEach, beforeEach, describe, expect, it, vi, type MockedObject } from "vitest";
import { TestBed } from '@angular/core/testing';

import { OqtApiMetadataProviderService } from './oqt-api-metadata-provider.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AttributeResponseJSON, OqtAttribute } from './types/types';
import { OqtApiService } from './oqt-api.service';
import OqtApiServiceMock from './oqt-api.service.mock';
import { of, throwError } from 'rxjs';
import { oqtApiMetadataResponseMock, oqtAttributesResponseMock } from './oqt-api-metadata.response.mock';
import { MetadataResponseJSON } from './types/MetadataResponseJSON';
import { FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from 'geojson';
import { BaseResponseJSON } from './types/BaseResponseJSON';
import { Userlayer } from '../shared/shared-types';

describe('OqtMetadataProviderService', () => {

    let service: OqtApiMetadataProviderService;
    let oqtApiMock: MockedObject<OqtApiService>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: OqtApiService, useValue: OqtApiServiceMock },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(OqtApiMetadataProviderService);
        oqtApiMock = TestBed.inject(OqtApiService) as MockedObject<OqtApiService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getOqtApiMetadata() should return oqtMetadataResponse', () => {
        service.oqtMetadataResponse = oqtApiMetadataResponseMock;

        const result = service.getOqtApiMetadata();

        expect(result).toEqual(oqtApiMetadataResponseMock);
    });

    it('getAttributes() should return oqtAttributes', () => {
        service.oqtAttributes = oqtAttributesResponseMock;

        const result = service.getAttributes();

        expect(result).toEqual(oqtAttributesResponseMock);
    });

    describe('loadOqtApiMetadata()', () => {
        afterEach(() => {
            oqtApiMock.getMetadata.mockClear();
        });

        it('should handle successful metadata response with result property', () => {

            oqtApiMock.getMetadata.mockReturnValue(of(oqtApiMetadataResponseMock));

            service.loadOqtApiMetadata().subscribe();

            expect(service.oqtMetadataResponse).toEqual(oqtApiMetadataResponseMock);
            expect(service.oqtApiAvailable).toBe(true);
            expect(oqtApiMock.getMetadata).toHaveBeenCalledTimes(1);
        });

        it('should handle successful metadata response without result property', () => {
            const badResponse = {
                "apiVersion": "1.6.1",
                "attribution": {
                    "url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"
                }
            };
            oqtApiMock.getMetadata.mockReturnValue(of(badResponse as MetadataResponseJSON));

            service.loadOqtApiMetadata().subscribe();

            expect(service.oqtMetadataResponse).toBeUndefined();
            expect(service.oqtApiAvailable).toBe(false);
            expect(oqtApiMock.getMetadata).toHaveBeenCalledTimes(1);
        });

        it('should handle client-side/network error', () => {
            const mockError = { status: 0, error: 'Network error' };
            oqtApiMock.getMetadata.mockReturnValue(throwError(() => mockError));
            vi.spyOn(console, 'error').mockReturnValue(undefined);

            service.loadOqtApiMetadata().subscribe({
                error: () => {
                    expect(service.oqtApiAvailable).toBe(false);
                    expect(console.error).toHaveBeenCalledWith('An error occurred:', 'Network error');
                }
            });
        });

        it('should handle server error', () => {
            const mockError = { status: 500, error: 'Server error' };
            oqtApiMock.getMetadata.mockReturnValue(throwError(() => mockError));
            vi.spyOn(console, 'error').mockReturnValue(undefined);

            service.loadOqtApiMetadata().subscribe({
                error: () => {
                    expect(service.oqtApiAvailable).toBe(false);
                    expect(console.error).toHaveBeenCalledWith(`Backend returned code 500, body was: `, 'Server error');
                }
            });
        });
    });

    describe('loadAttributes()', () => {
        afterEach(() => {
            oqtApiMock.getAttributes.mockClear();
        });

        it('should handle successful attributes response with result property', () => {

            oqtApiMock.getAttributes.mockReturnValue(of(oqtAttributesResponseMock));

            service.loadAttributes().subscribe();

            expect(service.oqtAttributes).toEqual(oqtAttributesResponseMock);
            expect(service.oqtApiAvailable).toBe(true);
            expect(oqtApiMock.getAttributes).toHaveBeenCalledTimes(1);
        });

        it('should handle successful attributes response without result property', () => {
            const badResponse = {
                "apiVersion": "1.6.1",
                "attribution": {
                    "url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"
                }
            };
            oqtApiMock.getAttributes.mockReturnValue(of(badResponse as AttributeResponseJSON));

            service.loadAttributes().subscribe();

            expect(service.oqtAttributes).toBeUndefined();
            expect(service.oqtApiAvailable).toBe(false);
            expect(oqtApiMock.getAttributes).toHaveBeenCalledTimes(1);
        });

        it('should handle client-side/network error', () => {
            const mockError = { status: 0, error: 'Network error' };
            oqtApiMock.getAttributes.mockReturnValue(throwError(() => mockError));
            vi.spyOn(console, 'error').mockReturnValue(undefined);

            service.loadAttributes().subscribe({
                error: () => {
                    expect(service.oqtApiAvailable).toBe(false);
                    expect(console.error).toHaveBeenCalledWith('An error occurred:', 'Network error');
                }
            });
        });

        it('should handle server error', () => {
            const mockError = { status: 500, error: 'Server error' };
            oqtApiMock.getAttributes.mockReturnValue(throwError(() => mockError));
            vi.spyOn(console, 'error').mockReturnValue(undefined);

            service.loadAttributes().subscribe({
                error: () => {
                    expect(service.oqtApiAvailable).toBe(false);
                    expect(console.error).toHaveBeenCalledWith(`Backend returned code 500, body was: `, 'Server error');
                }
            });
        });
    });

    describe('getIndicatorCoverage()', () => {
        afterEach(() => {
            oqtApiMock.getIndicatorCoverage.mockClear();
            service.cachedData = {};
        });
        const indicatorKey = 'test-indicator';
        const mockGeoJSON = {
            "apiVersion": "1.6.1",
            "attribution": {
                "url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"
            },
            type: 'FeatureCollection', features: []
        };
        const expectedResult = {
            name: indicatorKey,
            title: `Coverage of reference data`,
            data: mockGeoJSON,
            style: { color: '#000', stroke: false },
        } as Userlayer;

        it('should download and cache indicator coverage when not in cache', async () => {


            // Mock the API response
            oqtApiMock.getIndicatorCoverage.mockReturnValue(of(mockGeoJSON as BaseResponseJSON & FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>));

            const result = service.getIndicatorCoverage(indicatorKey);

            expect(await result).toEqual(expectedResult);

            // Verify an api call for download has been made and the data is cached
            expect(oqtApiMock.getIndicatorCoverage).toHaveBeenCalledTimes(1);
            expect(await service.cachedData[indicatorKey]).toEqual(expectedResult);
        });

        it('should return cached data if it exists', async () => {

            // Simulate data already being cached
            service['cachedData'][indicatorKey] = Promise.resolve(expectedResult);

            const result = await service.getIndicatorCoverage(indicatorKey);

            expect(result).toBe(expectedResult);
            expect(oqtApiMock.getIndicatorCoverage).not.toHaveBeenCalled();
        });

        it('should handle errors during API call', async () => {
            const mockError = new Error('API error');

            // Mock the API error
            oqtApiMock.getIndicatorCoverage.mockReturnValue(throwError(() => mockError));

            await expect(service.getIndicatorCoverage(indicatorKey)).rejects.toEqual(mockError);

            // Ensure the cache was not populated
            expect(service.cachedData[indicatorKey]).toBeUndefined();
            expect(oqtApiMock.getIndicatorCoverage).toHaveBeenCalledTimes(1);
        });

    });


    describe('get attribute detail functions', () => {

        const variants = ['name', 'description', 'filter'];

        variants.forEach(variant => {

            describe(variant, () => {

                const testCases = [
                    {
                        description: `should return the ${variant}, when topic HAS attributes and attribute IS available`,
                        topicKey: 'topic1',
                        attributeKey: 'attributeKey1',
                        expected: {
                            name: 'Attribute 1',
                            description: 'This is attribute one.',
                            filter: 'attr=one'
                        }
                    },
                    {
                        description: "should return undefined, when topic HAS attributes but attribute IS NOT available",
                        topicKey: 'topic1',
                        attributeKey: 'nonAvailableAttrKey',
                        expected: {
                            name: undefined,
                            description: undefined,
                            filter: undefined
                        }
                    },
                    {
                        description: "should return undefined, when topic HAS NO attributes",
                        topicKey: 'topicWhichHasNoAttributes',
                        attributeKey: '',
                        expected: {
                            name: undefined,
                            description: undefined,
                            filter: undefined
                        }
                    },
                ];

                testCases.forEach((testCase) => {
                    it(testCase.description, () => {

                        let testFunction: (topicKey: string, attributeKey: string) => string | undefined;

                        switch (variant) {
                            case 'name': {
                                testFunction = service.getAttributeName.bind(service);
                                break;
                            }
                            case 'description': {
                                testFunction = service.getAttributeDescription.bind(service);
                                break;
                            }
                            case 'filter': {
                                testFunction = service.getAttributeFilter.bind(service);
                                break;
                            }
                            default: {
                                throw new Error(`Unknown variant ${variant}`);
                            }
                        }

                        const testAttributes: Record<string, Record<string, OqtAttribute>> = {
                            topic1: {
                                attributeKey1: {
                                    name: 'Attribute 1',
                                    description: 'This is attribute one.',
                                    filter: 'attr=one'
                                },
                                attributeKey2: {
                                    name: 'Attribute 2',
                                    description: 'This is attribute two.',
                                    filter: 'attr=two'
                                },
                            }
                        };
                        service.oqtAttributes = { result: testAttributes };

                        const result = testFunction(testCase.topicKey, testCase.attributeKey);

                        expect(result).toEqual(testCase.expected[variant]);

                    });
                });
            });

        });

    });

});
