import './types.css';
import { POKEMON_TYPES_URL } from '../../api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Types = () => {

    if(!JSON.parse(localStorage.getItem("catchedPokemons"))){
        localStorage.setItem("catchedPokemons", JSON.stringify([]));
    }

    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState();
    const [isWaiting, setIsWaiting] = useState(false);
    const [currentPokemons, setCurrentPokemons] = useState([]);
    const [isChecked, setChecked] = useState(false);
    const setOpt = localStorage.getItem("options");
    const setCurrPoke = localStorage.getItem("currPokemons");
    const catchedPokemons = JSON.parse(localStorage.getItem("catchedPokemons"));

    useEffect(() => {
        if(setOpt){
            setOptions(JSON.parse(setOpt));
        }
        if(setCurrPoke){
            setCurrentPokemons(JSON.parse(setCurrPoke));
        }
    },[setCurrPoke, setOpt])


    useEffect(() => {
        if(!localStorage.getItem("options")){
        setIsWaiting(true);
        const getTypes = async () => {
            try{
                const res = await fetch(POKEMON_TYPES_URL);
                if(!res.ok) {
                    throw new Error('An error occured.');
                }
                const types = await res.json();
                setOptions(types.results);
                localStorage.setItem("options", JSON.stringify(types.results));
            }catch(error) {
                alert(error.message);
            }finally {
                setIsWaiting(false);
            }
        }
        setTimeout(() => {
            (async () => await getTypes())();
        }, 2000)}
    }, [])

    useEffect(() => {
        if(selected){
            setIsWaiting(true);
        const getSelectedPokemons = async () => {
            try{
                const res = await fetch(selected);
                if(!res.ok) {
                    throw new Error('An error occured.');
                }
                const sel = await res.json();
                setCurrentPokemons(sel.pokemon);
                localStorage.setItem("currPokemons", JSON.stringify(sel.pokemon));
            }catch(error) {
                alert(error.message);
            }finally {
                setIsWaiting(false);
            }
        }
        setTimeout(() => {
            (async () => await getSelectedPokemons())();
        }, 2000)}
    }, [selected])

    const setSel = (e) => {
        setSelected(e.target.value);
    }

    const handleInputChange = (e) => {
        if(e.onkeydown === 8){
            this.resetInput();
        }
        setCurrentPokemons((current) => 
        current.filter((poke) => poke.pokemon.name.includes(e.target.value)));
    }

    const resetInput = () => {
        if(setCurrPoke){
            setCurrentPokemons(JSON.parse(setCurrPoke));
        }
        const inp = document.getElementById("searchInput");
        inp.value = "";
    }

    const detectDelete = (e) => {
        if(e.key === "Backspace"){
            resetInput();
        }
    }

    const handleCheck = (e) => {
        setChecked(e.target.checked);
    }

    return (
        <div className="Types">

            {isWaiting && 
            <div className="loader"><p>Loading...</p></div>}

            {!isWaiting &&
            <div className='listDiv'>
                <h2>Poke app</h2>
                
                <select id="typeSelect" value={selected} onChange={setSel}>
                    <option defaultValue={null} hidden>Select type!</option>
                    {options.map( ( {name, url} ) => {
                    return(
                        <option key={url} value={url}>{name}</option>
                        )
                })}
                </select>
            </div>}
            
            {!isWaiting && currentPokemons && 
                    <div className="searchDiv">
                        <div className="searchLabel">
                            <label htmlFor="pokeSearch">Find your pokemon!</label>
                        </div>
                        <div className="searchNames">
                            <input name="pokeSearch" type="text" id="searchInput" placeholder='Search here...' onChange={handleInputChange} onKeyDown={detectDelete}/>
                            <button id="searchButton" onClick={resetInput}>Reset</button>
                        </div>
                        <div className="searchCatched">
                            <input name="catchedCheck" type="checkbox" id="catchedCheck" onChange={handleCheck} />
                            <p>Show only catched</p>
                        </div>
                    </div>}

                    {!isWaiting && currentPokemons.map( ( {pokemon, index} ) => {
                        if(!isChecked){
                            if(!catchedPokemons.includes(pokemon.name)){
                                return(
                                    <div className='singlePokemon'>
                                    <Link to={`/profile/${pokemon.name}`} key={index} value={pokemon.url}>
                                        {pokemon.name}
                                    </Link>
                                    </div>
                                    )
                            }
                            return(
                                <div className='singlePokemon singleCatchedPokemon'>
                                <Link to={`/profile/${pokemon.name}`} key={index} value={pokemon.url}>
                                    {pokemon.name}
                                </Link>
                                </div>
                            )
                        }
                        else{
                            if(catchedPokemons.includes(pokemon.name)){
                                return(
                                    <div className='singlePokemon singleCatchedPokemon'>
                                    <Link to={`/profile/${pokemon.name}`} key={index} value={pokemon.url}>
                                        {pokemon.name}
                                    </Link>
                                    </div>
                                )}
                            return false;
                            }
                        })
                    
                        
                    
                    }

                    
        </div>
        );
}

export default Types;