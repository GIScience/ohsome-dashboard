import {Component, ComponentRef, computed, inject, input, OnDestroy} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ExtractionFormData} from '../query-form/types';
import {paths} from '../../shared/ohsome-api-v2-types';
import {OqtApiMetadataProviderService} from '../../oqapi/oqt-api-metadata-provider.service';

@Component({
  selector: 'app-extraction-result',
  imports: [],
  templateUrl: './extraction-result.component.html',
  styleUrl: './extraction-result.component.css',
})
export class ExtractionResultComponent implements OnDestroy {
  oqtApiMetadataProviderService = inject(OqtApiMetadataProviderService);
  topics = this.oqtApiMetadataProviderService.getOqtApiMetadata().result.topics;

  componentRef: ComponentRef<ExtractionResultComponent>;
  formValues = input.required<ExtractionFormData>();

  private downloadParams = computed(()=>{
    return this.buildDownloadParams(this.formValues());
  })

  getDownloadUrl(format: 'parquet' | 'arrow') {
    // normalize trailing slash
    const ohsomeApiRootUrl = environment.ohsomeApiRootUrl.endsWith('/') ? environment.ohsomeApiRootUrl : `${environment.ohsomeApiRootUrl}/`

    const pathUrl = new URL(`extraction/features.${format}`, ohsomeApiRootUrl);
    this.downloadParams().forEach((value, key) => {
      pathUrl.searchParams.set(key, value);
    })
    return new URL(pathUrl).toString();
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }

  buildDownloadParams(formValues: ExtractionFormData) {
    type ExtractionQueryParams = paths['/extraction/features.parquet']['get']['parameters']['query'];
    const params:ExtractionQueryParams = {
      aoi: formValues.aoi as string,
      clip: formValues.clip,
      timestamp: formValues.timestamp,
      filter: this.getFilterFromFormVaulues(formValues),
    }
    // @ts-ignore
    return new URLSearchParams(params);

  }

  getFilterFromFormVaulues(formValues: ExtractionFormData) {
    if (formValues.topic === 'custom-topic') {
      return formValues['topic-filter']
    }

    return this.oqtApiMetadataProviderService.getOqtApiMetadata().result.topics[formValues.topic].filter ?? '';
  }

  protected readonly environment = environment;
}
