/// <reference types="@angular/localize" />

import {AppModule} from './app/app.module';
import {platformBrowser} from '@angular/platform-browser';
import { $localize } from '@angular/localize/init';

platformBrowser().bootstrapModule(AppModule)
  .catch(err => console.error(err));
