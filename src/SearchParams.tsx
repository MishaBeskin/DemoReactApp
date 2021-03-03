import React, { useState, useEffect, FunctionComponent } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "@reach/router";
import pet, { ANIMALS, Animal } from "@frontendmasters/pet";
import useDropdown from "./useDropdown";
import Results from "./Results";
import changeLocation from "./actionCreators/changeLocation";
import changeTheme from "./actionCreators/changeTheme";


interface Props {
    theme: string,
    location: string,
    setTheme: React.Dispatch<string>,
    setLocation: React.Dispatch<string>
}

const SearchParams: FunctionComponent<Props> = ({ theme, location, setTheme, setLocation }) => {
    const [breeds, updateBreeds] = useState([] as string[]);
    const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
    const [breed, BreedDropdown, updateBreed] = useDropdown("Breed", "", breeds);
    const [pets, setPets] = useState([] as Animal[]);

    async function requestPets() {
        const { animals } = await pet.animals({
            location: location,
            breed: breed,
            type: animal
        });

        setPets(animals || []);
    }



    useEffect(() => {
        updateBreeds([]);
        updateBreed("");
        pet.breeds(animal).then(({ breeds }) => {
            const breedStrings = breeds.map(({ name }) => name);
            updateBreeds(breedStrings);
        }, console.error);
    }, [animal, updateBreed, updateBreeds]);


    return (
        <div className="search-params">
            <form
                onSubmit={e => {
                    e.preventDefault();
                    requestPets();
                }}
            >
                <label htmlFor="location">
                    Location
                <input id="location"
                        value={location}
                        placeholder="Location"
                        onChange={event => setLocation(event.target.value)}
                    />
                </label>
                <AnimalDropdown />
                <BreedDropdown />
                <label htmlFor="location">
                    Theme
                    <select
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                        onBlur={e => setTheme(e.target.value)}
                    >
                        <option value="peru">Peru</option>
                        <option value="darkblue">Dark Blue</option>
                        <option value="chartreuse">Chartreuse</option>
                        <option value="mediumorchid">Medium Orchid</option>
                    </select>
                </label>
                <button style={{ backgroundColor: theme }}>Submit</button>
            </form>
            <Results pets={pets} />
        </div>
    );
};

const mapStateToProps = ({ theme, location }) => ({
    theme,
    location
});

const mapDispatchToProps = (dispatch: (arg0: { type: string; payload: string; }) => void) => ({
    setLocation(location: string) {
        dispatch(changeLocation(location));
    },
    setTheme(theme: string) {
        dispatch(changeTheme(theme));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchParams);