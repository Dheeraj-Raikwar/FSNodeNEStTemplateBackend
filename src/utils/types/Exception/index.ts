import { CallHandler, ExecutionContext, NestInterceptor,} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

export class ExceptionInterceptor implements NestInterceptor {
    // TODO: Implement more generic errro meessage and statusCode
    intercept(context: ExecutionContext, handler: CallHandler): any {
        return handler
        .handle()
        .pipe(catchError((err) => throwError(() =>{return err})));
    }
}