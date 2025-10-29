import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component({
    selector: 'app-plotly-chart',
    templateUrl: './plotly-chart.component.html',
    styleUrls: ['./plotly-chart.component.css'],
    standalone: false
})
export class PlotlyChartComponent implements AfterViewInit{
@Input() plotlyDataLayoutConfig: Plotly.PlotlyDataLayoutConfig;
@ViewChild('chart', {static: false}) chartDiv: ElementRef<HTMLDivElement>;

  async ngAfterViewInit(): Promise<void> {
    if (!this.plotlyDataLayoutConfig) return;
    const locale = localStorage.getItem('locale') || 'en';

    if (locale && locale !== 'en') {
      try {
        const localeModule = await import(
          `plotly.js-locales/${locale}`
          );
        (Plotly as any).register(localeModule);
      } catch (err) {
        console.warn(`Locale ${locale} not found, falling back to 'en'`, err);
      }
    }

    const {data, layout, config} = this.plotlyDataLayoutConfig;

    const plotConfig = { ...(config || {}), locale: locale};

    console.log(locale);

    Plotly.newPlot(this.chartDiv.nativeElement,data, layout, plotConfig);
  }
}
