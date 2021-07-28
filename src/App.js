import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
function App() {
  // STATES
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  // Handlers
  const onCountryChange = async (e) => {
    const country_code = e.target.value;
    setCountry(country_code);
    const url =
      country_code === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${country_code}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // setCountry(country_code)
        setCountryInfo(data);
      });
  };
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2, //UK , USA , FR
            id: country.countryInfo._id,
          }));
          setTableData(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, [countries]);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>

          <FormControl className="app__dropdpwn">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value} key={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* Header */}
        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>
          <h3>Worldwide new Cases</h3>
          {/* Graph  */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
