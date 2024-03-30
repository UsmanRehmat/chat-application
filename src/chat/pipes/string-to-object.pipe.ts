import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class StringToObjectPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return JSON.parse(value);
  }
}