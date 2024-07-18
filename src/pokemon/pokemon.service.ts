import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit : number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){
    // console.log("CTM",process.env.DEFAULT_LIMIT);

    this.defaultLimit = this.configService.get<number>('default_limit');

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);  
      return pokemon;      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll( paginationDto: PaginationDto ) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({
      no : 1
    })
    .select('-__v');
  }

  async findOne(term: string) {
    
    let pokemon: Pokemon;
    //si el termino es un numero
    if( !isNaN(+term) ){
      pokemon= await this.pokemonModel.findOne({ no: term })
    }

    //si el term es un MONGO id
    if(!pokemon && isValidObjectId(term) ){
      pokemon = await this.pokemonModel.findById(term);
    }

    //si el pokemon no es encontrado lo busca por el nombre
    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({ name : term.toLowerCase().trim()})
    }
    //no encontro la cosa
    if(!pokemon) {
      throw new NotFoundException(`POkemon no encontrado, ${ term }`);
    }

   
    
    return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if( updatePokemonDto.name ){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    } 
    try {
       //flag new para retornar el valor actualizado
      await pokemon.updateOne( updatePokemonDto, { new: true });
      //al hacer el spread primero revisa el valor de pokemon yluego compara con el segundo campo del update
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
     this.handleExceptions(error);
    }
   
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(
    //   id
    // );
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id : id
    });
    if( deletedCount === 0 ){
      throw new BadRequestException(`pokmeon con id "${id }", not ENCONTRADOU`);
    }
    return "BIEN MUERTO EL PERRO!";

    //this.pokemonModel.findByIdAndDelete( id );



  }

  private handleExceptions( error: any ){
    if( error.code === 11000 ){
      throw new BadRequestException(`pokemon ya existe en los registros ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`ni idea que guea, revisa los logs del servidor`);
  }

}
