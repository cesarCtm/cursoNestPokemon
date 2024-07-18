<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejectuar en desarrollo

1. Clonar el repositorio
2. Ejectuar
```
yarn install
```

3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos (mongo 4.4.6 por ser base x86)

```
docker-compose up -d
```

5. clonar el archivo __.env.template__ y renombrar la cpia a __.env__

6. llenar las variables de entorno definidas en el
```
.env
```

7. ejecutar la aplicacion en dev: con el comando 
```
yarn start:dev
```

8. reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```

## Stack usado
* MongoDB
* Nest