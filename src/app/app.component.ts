import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { License } from './shared';
import { LicenseService } from './services';
import * as hljs from 'highlight.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    @ViewChild('code') code;
    @ViewChild('licenseForm') licenseForm: NgForm;
    @ViewChild('serialForm') serialForm: NgForm;

    license: License;
    selectedTab: number;
    selectedSignature: string;
    selectedFormat: string;
    licenseValidated: boolean;
    licenseValidationError: string;
    creatingLicense: boolean;
    serialValidated: boolean;
    serialValidationError: string;
    creatingSerial: boolean;
    expireDate: Date;
    supportExpireDate: Date;

    signatures = [
        { value: 'rsa', viewValue: 'RSA' },
        { value: 'ecdsa', viewValue: 'ECDSA' }
    ];

    formats = [
        { value: 'xml', viewValue: 'XML' },
        { value: 'base32', viewValue: 'Base32' },
        { value: 'ascii', viewValue: 'ASCII' }
    ];

    constructor(private service: LicenseService) {
        this.selectedTab = 0;
        this.license = new License();
        this.selectedSignature = 'rsa';
        this.selectedFormat = 'xml';
    }

    createLicense() {
    }

    onDownload() {
        window.open("http://babelfor.net/downloads/", "_blank");
    }

    onHelp() {
        window.open("http://babelfor.net/licensing/help/", "_blank");
    }

    onCreateLicense() {
        this.convertUtcDates(this.license);
        this.creatingLicense = true;
        this.service.createLicense(this.selectedFormat, this.selectedSignature, this.license)
            .subscribe(res => {
                this.creatingLicense = false;
                this.license = res;
                this.licenseValidationError = null;
                this.licenseValidated = false;

                this.code.nativeElement.innerText = res.licenseKey;
                if (this.selectedFormat === 'xml') {
                    hljs.highlightBlock(this.code.nativeElement);
                }
            });
    }

    onValidateLicense() {
        this.service.validateLicense(this.selectedFormat, this.license)
            .subscribe(res => {
                this.license = res;
                this.licenseValidated = true;
            }, err => {
                this.licenseValidationError = err;
                this.licenseValidated = true;
            });
    }

    onCreateSerial() {
        this.convertUtcDates(this.license);
        this.creatingSerial = true;
        this.service.createSerial(this.license)
            .subscribe(res => {
                this.creatingSerial = false;
                this.license = res;
                this.serialValidationError = null;
                this.serialValidated = false;
            });
    }

    onValidateSerial() {
        this.service.validateSerial(this.license)
            .subscribe(res => {
                this.license = res;
                this.serialValidationError = null;
                this.serialValidated = true;
            }, err => {
                this.serialValidated = true;
                this.serialValidationError = err;
            });
    }

    convertUtcDates(license: License) {
        if (this.expireDate) {
            license.expireDate = this.toUtc(this.expireDate);
        } else {
            license.expireDate = null;
        }
        if (this.supportExpireDate) {
            license.supportExpireDate = this.toUtc(this.supportExpireDate);
        } else {
            license.supportExpireDate = null;
        }
    }

    toUtc(date: Date): Date {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }
}
