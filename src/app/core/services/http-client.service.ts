import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpTokenInterceptor } from '../interceptors';

declare module '@angular/common/http/http' {
    export interface HttpClient {
        skipToken(): HttpClient;
    }
}

class HttpInterceptorHandler implements HttpHandler {
    constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}

    handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
        return this.interceptor.intercept(request, this.next);
    }
}

export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');
@Injectable({
    providedIn: 'root',
})
export class HttpService extends HttpClient {
    constructor(
        private httpHandler: HttpHandler,
        private injector: Injector,
        @Optional() @Inject(HTTP_DYNAMIC_INTERCEPTORS) private interceptors: HttpInterceptor[] = [],
    ) {
        super(httpHandler);
        if (!this.interceptors) {
            this.interceptors = [];
        }
    }

    override skipToken(): HttpClient {
        return this.removeInterceptor(HttpTokenInterceptor);
    }

    override request(method?: any, url?: any, options?: any): any {
        const handler = this.interceptors.reduceRight((next, interceptor) => new HttpInterceptorHandler(next, interceptor), this.httpHandler);
        return new HttpClient(handler).request(method as string, url as string, options);
    }

    private removeInterceptor(interceptorType: Function): HttpService {
        return new HttpService(
            this.httpHandler,
            this.injector,
            this.interceptors.filter((i) => !(i instanceof interceptorType)),
        );
    }
}
