import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {

    //console.log({value, metadata});
    if( !isValidObjectId(value) ){
      throw new BadRequestException(`valor no valido, fordidden coso`);
    }
    return value.toUpperCase();
  }
}
