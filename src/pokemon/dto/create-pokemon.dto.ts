import { IsInt, IsPositive, IsString, Min, MinLength, isString } from "class-validator";

export class CreatePokemonDto {

    //isINt, isPositivo, Min
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    //isString, MinLength 1
    @IsString()
    @MinLength(1)
    name: string;

}
