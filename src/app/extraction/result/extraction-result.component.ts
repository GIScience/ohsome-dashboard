import {Component, ComponentRef, OnDestroy} from '@angular/core';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-extraction-result',
  imports: [],
  templateUrl: './extraction-result.component.html',
  styleUrl: './extraction-result.component.css',
})
export class ExtractionResultComponent implements OnDestroy {

  componentRef: ComponentRef<ExtractionResultComponent>;

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }

  protected readonly environment = environment;
}
