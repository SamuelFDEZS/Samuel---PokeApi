//Para acceder al nombre: res.forms[0].name
//Función para acceder a la API
const get = async () => {
    const pokemons = []
    for (let i = 1; i <= 151; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const res = await response.json()
        //console.log(res["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"])
        pokemons.push(res)
    }
    //console.log(pokemons[0].sprites.versions.generationv.black-white.animated.front_default)
    console.log(pokemons[0].stats)
    return pokemons
}

//Función para mapear las propiedades de los pokemon
const mapper = (pokemons) => {
    //console.log(pokemons)
    return pokemons.map((pokemon) => ({
        //console.log(pokemon.sprites.front_default)
        name: pokemon.forms[0].name,
        types: pokemon.types.map((type) => type.type.name),
        frontPictureDefault: pokemon.sprites.front_default,
        backPictureDefault: pokemon.sprites.back_default,
        frontPictureShiny: pokemon.sprites.front_shiny,
        backPictureShiny: pokemon.sprites.back_shiny,
        frontAnimatedDefault: pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"],
        backAnimatedDefault: pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["back_default"],
        frontAnimatedShiny: pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_shiny"],
        backAnimatedShiny: pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["back_shiny"],
        stats: pokemon.stats
        // attack: pokemon.stats[1].base_stat,
        // defense: pokemon.stats[2].base_stat,
        // special_attack: pokemon.stats[3].base_stat,
        // special_defense: pokemon.stats[4].base_stat,
        // speed: pokemon.stats[5].base_stat
    }));
}
//Función para convertir la primera letra de los pokemon
const convertirPrimeraLetra = (pokemons) => {
    pokemons.map((pokemon) => pokemon.name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1))
}

//Función para dibujar los pokemon
const draw = (pokemons) => {
    let main$$ = document.querySelector(".main")
    main$$.innerHTML = ""
    for (let x of pokemons) {

        let article$$ = document.createElement("article")
        article$$.setAttribute("class", "main_article")
        main$$.appendChild(article$$)

        let img$$ = document.createElement("img")
        img$$.setAttribute("src", x.frontPictureDefault)
        img$$.setAttribute("alt", `Foto de ${x.name}`)
        img$$.setAttribute("class", "main_article_image")
        article$$.appendChild(img$$)


        let p$$ = document.createElement("p")
        p$$.innerText = x.name
        p$$.setAttribute("class", "pokemon_name")
        article$$.appendChild(p$$)

        for (let i = 0; i < x.types.length; i++) {
            p$$ = document.createElement("p")
            p$$.innerText = x.types[i]
            p$$.setAttribute("class", `pokemon_type-${i}`)
            article$$.appendChild(p$$)
        }
        //console.log(x)
    }
}

//Función para buscar
const search = (pokemons) => {
    let input$$ = document.querySelector(".search")
    input$$.addEventListener("input", () => {
        //console.log(pokemons)
        let pokemonFiltered = pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(input$$.value.toLowerCase())
        )




        draw(pokemonFiltered)
        const articleList = Array.from(document.querySelectorAll(".main_article"))
        changeBackground(pokemonFiltered, articleList)
        detectPokemon(pokemonFiltered)
        colorByType()
        //console.log(pokemonFiltered)
    })

}

//Función para detectar Pokemon
const detectPokemon = (pokemonList) => {
    const articleList = Array.from(document.querySelectorAll("article"))
    articleList.map((article) => article.addEventListener("click", () => showInformation(article, pokemonList, articleList)))

}

//Función para mostrar información
const showInformation = (clickedArticle, pokemonList, articleList) => {
    // console.log(articleList.indexOf(clickedArticle))
    //Variable para devolver la posición del objeto clickado en el array pej si se hace click a Bulbasaur, este será 0

    let main$$ = document.querySelector(".main")
    //Condicional para comprobar la existencia del hijo div
    if (document.querySelector(".extra_information")) {
        main$$.removeChild(document.querySelector(".extra_information"))
    } else {
        let posicionArray = articleList.indexOf(clickedArticle)
        //Variable para sacar las coordenadas del artículo clickado
        let coords = clickedArticle.getBoundingClientRect();
        let body = document.body.getBoundingClientRect()
        console.log(coords)
        //console.log(coords)
        let div$$ = document.createElement("div")
        div$$.setAttribute("class", "extra_information")

        //Condicional para posicionar la caja según la posición del elemento clickeado
        if ((posicionArray + 1) % 3 == 0) {
            div$$.style.left = ((coords.left - body.left) - 300).toString() + "px"

        } else {
            div$$.style.left = ((coords.left - body.left) + 300).toString() + "px"
        }

        div$$.style.top = ((coords.top - body.top) - 100).toString() + "px"
        div$$.style.backgroundColor = clickedArticle.style.backgroundColor
        main$$.appendChild(div$$)

        let contadorImagen = 0

        let section$$ = document.createElement("section")
        section$$.setAttribute("class", "inside_section")
        div$$.appendChild(section$$)

        let button$$ = document.createElement("button")
        button$$.setAttribute("class", "previous_image")
        button$$.innerText = "<"

        section$$.appendChild(button$$)

        let inDiv$$ = document.createElement("div")
        inDiv$$.setAttribute("class", "inside_div")
        section$$.appendChild(inDiv$$)

        let img$$ = document.createElement("img")
        img$$.setAttribute("class", "inf_image")
        img$$.setAttribute("alt", "Imagen del pokemon")
        img$$.setAttribute("src", pokemonList[posicionArray].frontAnimatedDefault)
        inDiv$$.appendChild(img$$)

        button$$ = document.createElement("button")
        button$$.setAttribute("class", "next_image")
        button$$.innerText = ">"
        section$$.appendChild(button$$)

        let boton1 = document.querySelector(".previous_image")
        boton1.addEventListener("click", () => {
            if (contadorImagen > 0) { contadorImagen-- }
            changeImage(contadorImagen, img$$, pokemonList, posicionArray)
        })

        let boton2 = document.querySelector(".next_image")
        boton2.addEventListener("click", () => {
            if (contadorImagen < 3) { contadorImagen++ }
            changeImage(contadorImagen, img$$, pokemonList, posicionArray)
        })

        //Falta poner el nombre del pokémon, poner el color del fondo según el tipo
        //Y poner los stats de los pokémon, además de corregir la creación del DIV

        let p$$ = document.createElement("p")
        p$$.innerText = pokemonList[posicionArray].name
        p$$.setAttribute("class", "inner_pokemon_name")
        div$$.appendChild(p$$)

        section$$ = document.createElement("section")
        section$$.setAttribute("class", "inside_section-2")
        div$$.appendChild(section$$)
        for (let i = 0; i < pokemonList[posicionArray].types.length; i++) {
            p$$ = document.createElement("p")
            p$$.innerText = pokemonList[posicionArray].types[i]
            p$$.setAttribute("class", `inner_pokemon_type-${i}`)
            section$$.appendChild(p$$)
        }
        const firstType = Array.from(document.querySelectorAll(".inner_pokemon_type-0"))
        console.log(firstType)

        const secondType = Array.from(document.querySelectorAll(".inner_pokemon_type-1"))
        detectType(firstType)
        detectType(secondType)

        for (let i = 0; i < pokemonList[posicionArray].stats.length; i++) {
        p$$ = document.createElement("p")
        p$$.setAttribute("class", "pokemon_information")
        p$$.innerText = pokemonList[posicionArray].stats[i].stat.name + ": ...................." + pokemonList[posicionArray].stats[i].base_stat
        div$$.appendChild(p$$)
        }
    }
}

//Función para cambiar la imagen al hacer click en los botones
const changeImage = (contadorImagen, image, pokemonList, posicion) => {
    if (contadorImagen == 0) {
        image.setAttribute("src", pokemonList[posicion].frontAnimatedDefault)
    } else if (contadorImagen == 1) {
        image.setAttribute("src", pokemonList[posicion].backAnimatedDefault)
    } else if (contadorImagen == 2) {
        image.setAttribute("src", pokemonList[posicion].frontAnimatedShiny)
    } else if (contadorImagen == 3) {
        image.setAttribute("src", pokemonList[posicion].backAnimatedShiny)
    }
}

//Función para sacar los tipos de los pokemon
const getTypes = async () => {
    const types = []
    for (let i = 1; i <= 18; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${i}`);
        const res = await response.json()
        types.push(res)
    }
    return types
}

//Función para cambiar el color según el tipo
const colorByType = () => {
    const firstType = Array.from(document.querySelectorAll(".pokemon_type-0"))
    console.log(firstType)
    const secondType = Array.from(document.querySelectorAll(".pokemon_type-1"))
    detectType(firstType)
    detectType(secondType)
}

//Función para iterar en los tipos de los pokemon y cambiar el color
//de los párrafos según el tipo (colorByType se sirve de esta función)
const detectType = (typeArray) => {
    typeArray.map((type) => {
        console.log(type)
        switch (type.innerText.toLowerCase()) {
            case "normal":
                type.style.backgroundColor = "grey"
                break;
            case "fighting":
                type.style.backgroundColor = "rgb(91, 7, 20)"
                break;
            case "flying":
                type.style.backgroundColor = "rgb(208, 166, 254)"
                break;
            case "poison":
                type.style.backgroundColor = "rgb(167, 103, 178)"
                break;
            case "ground":
                type.style.backgroundColor = "rgb(179, 131, 4)"
                break;
            case "rock":
                type.style.backgroundColor = "rgb(80, 59, 3)"

                break;
            case "bug":
                type.style.backgroundColor = "rgb(36, 73, 3)"
                break;
            case "ghost":
                type.style.backgroundColor = "rgb(76, 16, 133)"

                break;
            case "steel":
                type.style.backgroundColor = "rgb(209, 198, 230)"

                break;
            case "fire":
                type.style.backgroundColor = "rgb(226, 119, 29)"

                break;
            case "water":
                type.style.backgroundColor = "rgb(0, 166, 255)"

                break;
            case "grass":
                type.style.backgroundColor = "rgb(46, 191, 179)"

                break;
            case "electric":
                type.style.backgroundColor = "rgb(251, 255, 0)"

                break;
            case "psychic":
                type.style.backgroundColor = "rgb(216, 7, 210)"

                break;
            case "ice":
                type.style.backgroundColor = "rgb(0, 255, 251)"

                break;
            case "dragon":
                type.style.backgroundColor = "rgb(185, 138, 249)"

                break;

            case "dark":
                type.style.backgroundColor = "rgb(27, 14, 3)"

                break;

            case "fairy":
                type.style.backgroundColor = "rgb(252, 164, 255)"

                break;
        }
    })
}

// Función que se ocupa de cambiar el color de fondo de los articles, es llamado tanto en innit como en search
const changeBackground = (pokemons, arrayList) => {
    let index
    pokemons.map((pokemon) => {
        index = pokemons.indexOf(pokemon)
        switch (pokemon.types[0].toLowerCase()) {
            case "normal":
                arrayList[index].style.backgroundColor = "rgb(227, 227, 227 ) "
                break;
            case "fighting":
                arrayList[index].style.backgroundColor = "rgb(188, 87, 87)"
                break;
            case "flying":
                arrayList[index].style.backgroundColor = "rgb(193, 171, 217)"
                break;
            case "poison":
                arrayList[index].style.backgroundColor = "rgb(193, 65, 215)"
                break;
            case "ground":
                arrayList[index].style.backgroundColor = "rgb(210, 181, 104)"
                break;
            case "rock":
                arrayList[index].style.backgroundColor = "rgb(143, 129, 93)"

                break;
            case "bug":
                arrayList[index].style.backgroundColor = "rgb(105, 141, 74)"
                break;
            case "ghost":
                arrayList[index].style.backgroundColor = "rgb(79, 44, 113)"

                break;
            case "steel":
                arrayList[index].style.backgroundColor = "rgb(232, 223, 249)"

                break;
            case "fire":
                arrayList[index].style.backgroundColor = "rgb(249, 168, 100)"

                break;
            case "water":
                arrayList[index].style.backgroundColor = "rgb(107, 189, 233)"

                break;
            case "grass":
                arrayList[index].style.backgroundColor = "rgb(2, 248, 119)"

                break;
            case "electric":
                arrayList[index].style.backgroundColor = "rgb(244, 246, 140)"

                break;
            case "psychic":
                arrayList[index].style.backgroundColor = "rgb(255, 181, 253)"

                break;
            case "ice":
                arrayList[index].style.backgroundColor = "rgb(196, 251, 250)"

                break;
            case "dragon":
                arrayList[index].style.backgroundColor = "rgb(227, 206, 255)"

                break;

            case "dark":
                arrayList[index].style.backgroundColor = "rgb(58, 50, 44)"

                break;

            case "fairy":
                arrayList[index].style.backgroundColor = "rgb(255, 228, 253)"

                break;
        }
    })
}

//Función principal que ejecuta el resto de funciones
const init = async () => {
    const listaPokemon = await get()
    const mapedArray = mapper(listaPokemon)

    convertirPrimeraLetra(mapedArray)
    //console.log(mapedArray[0].attack)
    draw(mapedArray)

    const articles = Array.from(document.querySelectorAll("article"))
    search(mapedArray)
    detectPokemon(mapedArray)
    //getTypes()
    colorByType()
    const articleList = Array.from(document.querySelectorAll(".main_article"))


    changeBackground(mapedArray, articleList)

}
init()