import {Data} from 'plotly.js-dist-min';


export const gaugeData: Data[] = [
  {
    // domain: { x: [0, 0.5], y: [0, 1]},
    // domain: {row:0,column:0},
    value: 88.6 / 100,
    number: {valueformat: '0.1%'},
    // title: {text: 'Mapping Saturation'},
    type: 'indicator',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mode: 'gauge+number+percent',
    gauge: {
      'bar': {'color': 'transparent'},
      threshold: {
        value: 87,
        'thickness': 1.5,
        line: {width: 3, color: 'blue'}
      }
      ,
      axis: {
        ticksuffix: '%',
        range: [null, 100]
      },
      steps: [
        {range: [0, 33.3], color: 'tomato'},
        {range: [33.3, 97], color: 'gold'},
        {range: [97, 100], color: 'darkseagreen'}
      ]
    }
  }
];
