import React, { useEffect, useState } from 'react';
import './App.css'

function App() {

    const numbers:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    const doubleNumbers:number[] = numbers.map((number:number):number => number * 2);
    console.log(doubleNumbers);

    const words:string[] = ['hello', 'world', 'foo', 'bar', 'foobar', 'fizz', 'buzz', 'fizzbuzz'];

    const newWords:string[] = words.filter((word:string):boolean => word.length > 5);

    const sumOfNumbers:number = numbers.reduce((acc:number, curr:number):number => acc + curr, 0);

    const firstNumberGreaterThenTen:number | undefined = numbers.find((number:number):boolean => number > 10);

    console.log(firstNumberGreaterThenTen);


    // RickAndMorty API filter who is alive

    interface Character {
        id: number;
        name: string;
        status: string;
        species: string;
        origin: {
            name: string;
        };
    }

    interface RickAndMortyResponse {
        info: {
            count: number;
            pages: number;
            next: string | null;
            prev: string | null;
        };
        results: Character[];
    }

    const [rickAndMortyResponse, setRickAndMortyResponse] = useState<Character[]>([]);

    useEffect(() => {
        fetch('https://rickandmortyapi.com/api/character')
            .then((response) => response.json() as Promise<RickAndMortyResponse>)
            .then((data) => data.results.filter((character) => character.status === 'Alive'))
            .then((aliveCharacters) => setRickAndMortyResponse(aliveCharacters));
    }, []);

    const getLivingHumans = (characters: Character[]): Character[] => {
        return characters.filter((character) => character.status === 'Alive' && character.species === 'Human');
    }

    console.log(getLivingHumans(rickAndMortyResponse));

    const getSpecialObjects = (characters: Character[]): { name: string, origin: string }[] => {
        return characters.map((character) => ({
            name: character.name,
            origin: character.origin.name,
        }));
    }

    console.log(getSpecialObjects(rickAndMortyResponse));


    return (
        <>
            <h1>{doubleNumbers}</h1>
            <h1>{newWords}</h1>
            <h1>{sumOfNumbers}</h1>
            <h1>{firstNumberGreaterThenTen}</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Species</th>
                </tr>
                </thead>
                <tbody>
                {rickAndMortyResponse.map((character:Character) => (
                    <tr key={character.id}>
                        <td>{character.name}</td>
                        <td>{character.status}</td>
                        <td>{character.species}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default App