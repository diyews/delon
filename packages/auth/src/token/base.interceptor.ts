/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable, Injector, Optional } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { AlainAuthConfig, AlainConfigService } from '@delon/util/config';

import { mergeConfig } from '../auth.config';
import { ALLOW_ANONYMOUS } from '../token';
import { ToLogin } from './helper';
import { ITokenModel } from './interface';

class HttpAuthInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }
}

@Injectable()
export abstract class BaseInterceptor implements HttpInterceptor {
  constructor(@Optional() protected injector: Injector) {}

  protected model!: ITokenModel;

  abstract isAuth(options: AlainAuthConfig): boolean;

  abstract setReq(req: HttpRequest<any>, options: AlainAuthConfig): HttpRequest<any>;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.context.get(ALLOW_ANONYMOUS)) return next.handle(req);

    const options = mergeConfig(this.injector.get(AlainConfigService));
    if (Array.isArray(options.ignores)) {
      for (const item of options.ignores) {
        if (item.test(req.url)) return next.handle(req);
      }
    }

    if (this.isAuth(options)) {
      req = this.setReq(req, options);
    } else {
      ToLogin(options, this.injector);
      // Interrupt Http request, so need to generate a new Observable
      const err$ = new Observable((observer: Observer<HttpEvent<any>>) => {
        let statusText = '';
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
          statusText = `来自 @delon/auth 的拦截，所请求URL未授权，若是登录API可加入 [url?_allow_anonymous=true] 来表示忽略校验，更多方法请参考： https://ng-alain.com/auth/getting-started#AlainAuthConfig\nThe interception from @delon/auth, the requested URL is not authorized. If the login API can add [url?_allow_anonymous=true] to ignore the check, please refer to: https://ng-alain.com/auth/getting-started#AlainAuthConfig`;
        }
        const res = new HttpErrorResponse({
          url: req.url,
          headers: req.headers,
          status: 401,
          statusText
        });
        observer.error(res);
      });
      if (options.executeOtherInterceptors) {
        const interceptors = this.injector.get(HTTP_INTERCEPTORS, []);
        const lastInterceptors = interceptors.slice(interceptors.indexOf(this) + 1);
        if (lastInterceptors.length > 0) {
          const chain = lastInterceptors.reduceRight(
            (_next, _interceptor) => new HttpAuthInterceptorHandler(_next, _interceptor),
            {
              handle: (_: HttpRequest<any>) => err$
            }
          );
          return chain.handle(req);
        }
      }
      return err$;
    }
    return next.handle(req);
  }
}
