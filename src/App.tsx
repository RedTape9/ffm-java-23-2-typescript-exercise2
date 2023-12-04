import { useEffect, useState, useMemo } from 'react';
import './App.css';

interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
}

function App() {
    const numbers = useMemo(() => [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], []);
    const doubleNumbers = useMemo(() => numbers.map(number => number * 2), [numbers]);
    const newWords = useMemo(() => ['hello', 'world', 'foo', 'bar', 'foobar', 'fizz', 'buzz', 'fizzbuzz'].filter(word => word.length > 5), []);
    const sumOfNumbers = useMemo(() => numbers.reduce((acc, curr) => acc + curr, 0), [numbers]);
    const firstNumberGreaterThenTen = useMemo(() => numbers.find(number => number > 10), [numbers]);

    const [rickAndMortyResponse, setRickAndMortyResponse] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [totalCharacters, setTotalCharacters] = useState(0);
    const [aliveCharacters, setAliveCharacters] = useState(0);

    useEffect(() => {
        fetchAllCharacters()
            .then(characters => {
                setRickAndMortyResponse(characters);
                setTotalCharacters(characters.length);
                setAliveCharacters(characters.filter(character => character.status === 'Alive').length);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err);
                setIsLoading(false);
            });
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>{doubleNumbers}</h1>
            <h1>{newWords}</h1>
            <h1>{sumOfNumbers}</h1>
            <h1>{firstNumberGreaterThenTen}</h1>
            <h1>Total Characters: {totalCharacters}</h1>
            <h1>Alive Characters: {aliveCharacters}</h1>
            <CharacterTable characters={rickAndMortyResponse.filter(character => character.status === 'Alive')} />
        </>
    );
}

function CharacterTable({ characters }: { characters: Character[] }) {
    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Species</th>
            </tr>
            </thead>
            <tbody>
            {characters.map(character => (
                <tr key={character.id}>
                    <td>{character.name}</td>
                    <td>{character.status}</td>
                    <td>{character.species}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

async function fetchAllCharacters() {
    try {
        const firstPageResponse = await fetch('https://rickandmortyapi.com/api/character');
        if (!firstPageResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const firstPageData = await firstPageResponse.json();
        const totalPages = firstPageData.info.pages;

        const promises = [];
        for (let i = 2; i <= totalPages; i++) {
            promises.push(fetch(`https://rickandmortyapi.com/api/character/?page=${i}`).then(res => res.json()));
        }

        const pages = await Promise.all(promises);
        const allCharacters = [firstPageData.results, ...pages.map(page => page.results)].flat();

        return allCharacters;
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
}

export default App;