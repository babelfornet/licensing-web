import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { License } from '../shared';

@Injectable()
export class LicenseService {
    baseUrl = 'api/';

    constructor(private http: Http) {
    }

    createLicense(format: string, sign: string, license: License): Observable<License> {
        let url = this.baseUrl + `license/create/${format}/${sign}`;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, license, options)
            .map(res => res.json())
            .catch(err => this.handleError(err));
    }

    validateLicense(format: string, license: License): Observable<License> {
        let url = this.baseUrl + `license/validate/${format}`;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, license, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    createSerial(license: License): Observable<License> {
        let url = this.baseUrl + `serial/create`;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, license, options)
            .map(res => res.json())
            .catch(err => this.handleError(err));
    }

    validateSerial(license: License): Observable<License> {
        let url = this.baseUrl + 'serial/validate';

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(url, license, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    handleError(error: Response | any) {

        let errMsg: string;
        try {
            if (error instanceof Response) {
                errMsg = error.text() || error.statusText;
            } else {
                errMsg = error.message ? error.message : error.toString();
            }
        } catch (ex) {
            errMsg = 'unknown error';
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
