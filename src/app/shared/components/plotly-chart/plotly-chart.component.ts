import {afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, input, viewChild} from '@angular/core';
import Plotly from 'plotly.js-dist-min';
import Utils from '../../../../utils';

@Component({
  selector: 'app-plotly-chart',
  templateUrl: './plotly-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./plotly-chart.component.css']
})
export class PlotlyChartComponent {

  // 👇 signal-based input
  plotlyDataLayoutConfig = input.required<Plotly.PlotlyDataLayoutConfig>();
  chartDiv = viewChild.required<ElementRef<HTMLDivElement>>('chart');

  constructor() {
    afterRenderEffect(() => {
      const cfg = this.plotlyDataLayoutConfig();

      // make chart responsive
      Utils.setObjectProperty(cfg, 'config.responsive', true);
      Utils.setObjectProperty(cfg, 'layout.autosize', true);

      // make sure the title of yaxis has enough space
      Utils.setObjectProperty(cfg, 'layout.yaxis.automargin', true);

      if (!cfg || !this.chartDiv().nativeElement) return;

      const {data, layout, config} = cfg;

      Plotly.react(
        this.chartDiv().nativeElement,
        data,
        layout,
        config
      );

    });
  }
}
