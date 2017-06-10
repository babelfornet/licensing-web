import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { HttpModule } from '@angular/http';

import 'hammerjs';
import { LicenseService } from './services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HighlightCodeDirective } from './highlightCode.directive';

@NgModule({
    declarations: [
        AppComponent,
        HighlightCodeDirective
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        MaterialModule,
        MdNativeDateModule,
        AppRoutingModule
    ],
    providers: [LicenseService],    
    bootstrap: [AppComponent]
})
export class AppModule { }
