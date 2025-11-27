/// <reference types="@angular/localize" />
import { provideZoneChangeDetection } from "@angular/core";
import {AppModule} from './app/app.module';
import {platformBrowser} from '@angular/platform-browser';
import { $localize } from '@angular/localize/init';

platformBrowser().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.error(err));
