import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response, Request } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter
{
    private readonly logger = new Logger(HttpException.name)
    catch(exception: HttpException, host: ArgumentsHost) {
        this.logger.log(`Exception captured`)
        console.log(exception)
        const context = host.switchToHttp()
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = exception.getStatus();
        response.json(exception.getResponse())
    }
}