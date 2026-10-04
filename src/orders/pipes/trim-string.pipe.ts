import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' || !value || typeof value !== 'object') {
      return value;
    }

    const body = value as Record<string, unknown>;

    for (const key of Object.keys(body)) {
      if (typeof body[key] === 'string') {
        body[key] = body[key].trim();
      }
    }

    return body;
  }
}
