import { useEffect, useRef, useState } from "react";
import "./App.css";
import useFetch from "./hooks/useFetch";
import getRandomNumber from "./helpers/getRandomNumber";
import LocationInfo from "./components/LocationInfo";
import ResidentCard from "./components/ResidentCard";
import getNumbers from "./helpers/getNumbers";
import parallax from "./helpers/parallax";

function App() {
  const [locationID, setLocationID] = useState(getRandomNumber(126));
  const [errorMessage, setErrorMessage] = useState("");
  const url = `https://rickandmortyapi.com/api/location/${locationID}`;
  const [location, getLocation, hasError, isLoading] = useFetch(url);
  const [locations, getLocations, hasErrorLocations, isLoadingLocations] =
    useFetch(`https://rickandmortyapi.com/api/location/${getNumbers()}`);
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [originFilter, setOriginFilter] = useState("");

  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);

  useEffect(() => {
    getLocation();
  }, [locationID]);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    const cleanup = parallax(".app__moveimg", "app");
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    if (location?.residents?.length) {
      Promise.all(
        location.residents.map((url) => fetch(url).then((res) => res.json()))
      ).then(setResidents);
    } else {
      setResidents([]);
    }
  }, [location]);

  useEffect(() => {
    const filtered = residents.filter((resident) => {
      return (
        (statusFilter === "" || resident.status === statusFilter) &&
        (genderFilter === "" || resident.gender === genderFilter) &&
        (originFilter === "" || resident.origin === originFilter)
      );
    });
    setFilteredResidents(filtered);
  }, [residents, statusFilter, genderFilter, originFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = inputName.current.value.trim();
    setGenderFilter("");
    setOriginFilter("");
    setStatusFilter("");
    const selectedLocation = locations.find(
      (location) => location.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (inputValue) {
      setLocationID(selectedLocation ? selectedLocation.id : null);
      setErrorMessage(
        selectedLocation ? "" : "No location found with that name!"
      );
    } else {
      setErrorMessage(inputValue ? "" : "You must put a location name");
    }
  };

  const inputName = useRef();
  return (
    <div className="app flex-container" id="app">
      <header className="app__hero">
        <img className="hero__image" src="/img/hero.png" alt="Hero Image" />
      </header>
      <img
        className="app__moveimg app__moveimg--1"
        src="/img/rick-and-morty-nave-unscreen.gif"
        alt="nave1"
        data-speed="1"
      />
      <img
        className="app__moveimg app__moveimg--2"
        src="/img/rick-and-morty-nave-unscreen.gif"
        alt="nave2"
        data-speed="2"
      />
      <img
        className="app__moveimg app__moveimg--3"
        src="/img/GORRA_NAVE_ESPACIAL_RICK___MORTY_2-removebg-preview.png"
        alt="nave2"
        data-speed="3"
      />
      <img
        className="app__moveimg app__moveimg--4"
        src="/img/GORRA_NAVE_ESPACIAL_RICK___MORTY_2-removebg-preview.png"
        alt="nave2"
        data-speed="4"
      />
      <img
        className="app__moveimg app__moveimg--5"
        src="/img/nave-3.png"
        alt="nave2"
        data-speed="5"
      />
      <section className="app__body">
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="form__input"
            type="text"
            placeholder="Search location name"
            ref={inputName}
            list="locations"
          />
          <datalist id="locations">
            {isLoadingLocations ? (
              <option>Loading...</option>
            ) : (
              locations?.map((location) => (
                <option value={location.name} key={location.id}></option>
              ))
            )}
          </datalist>
          <button className="form__btn">Search</button>
        </form>
        <div className="filters">
          <h3>Filter by:</h3>
          <button onClick={() => setStatusFilter("Alive")}>Alive</button>
          <button onClick={() => setStatusFilter("Dead")}>Dead</button>
          <button onClick={() => setStatusFilter("")}>All Statuses</button>
          <button onClick={() => setGenderFilter("Male")}>Male</button>
          <button onClick={() => setGenderFilter("Female")}>Female</button>
          <button onClick={() => setGenderFilter("")}>All Genders</button>
          <button onClick={() => setOriginFilter("")}>All Origins</button>
        </div>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : errorMessage ? (
          <h1>:x:{errorMessage}</h1>
        ) : (
          <>
            <LocationInfo location={location} />
            <section className="cards__container flex-container">
              {filteredResidents.map((resident) => (
                <ResidentCard key={resident.id} resident={resident} />
              ))}
            </section>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
