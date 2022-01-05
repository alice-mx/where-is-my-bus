import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, useSearchParams } from 'react-router-dom';
import { Bus } from './Bus';
import { Card } from './Card';
import { Search } from './Search';

const useTrips = (): [(s: string) => Promise<void>, any] => {
  const [trips, setTrips] = React.useState<any[]>([]);
  const [stop, setStop] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const getTrips = async (stop: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://9vh1ux3xq3.execute-api.ap-southeast-2.amazonaws.com/timetable?stop=${stop}`,
      );
      console.log(response);
      if (response?.ok) {
        const json = await response.json();
        setStop(json.stop);
        setTrips(
          json.trips?.sort(
            (a: { DepartTime: string }, b: { DepartTime: string }) =>
              new Date(a.DepartTime).getTime() -
              new Date(b.DepartTime).getTime(),
          ),
        );
      } else {
        setError('Unable to get trips for stop');
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong :(');
    } finally {
      setLoading(false);
    }
  };

  return [getTrips, { loading, error, trips, stop }];
};

function App() {
  const input = React.useRef<HTMLInputElement>(null);

  const [params, setParams] = useSearchParams();

  useEffect(() => {
    const search = params.get('search');
    if (search) {
      getTrips(search);
    }
  }, [params]);

  const [getTrips, { loading, error, stop, trips }] = useTrips();

  const handleGetTrips = async (e: React.FormEvent<HTMLFormElement>) => {
    setParams(`search=${input?.current?.value}`);
    e.preventDefault();
  };

  return (
    <>
      <div className="background" />

      <header>
        <h1>Where the fuck is my bus?</h1>
      </header>
      <div className="App">
        <div className="App-content">
          <form onSubmit={handleGetTrips}>
            <fieldset>
              <label>Stop number</label>

              <input
                type="text"
                ref={input}
                defaultValue={params.get('search') ?? undefined}
                required
                placeholder="12902"
              />
              <button>
                <Search />
              </button>
            </fieldset>
          </form>
          {!!params.get('search') && (
            <>
              {error}

              {loading && (
                <>
                  <div className="skeleton skeleton-location-card" />{' '}
                  <div className="skeleton" /> <div className="skeleton" />{' '}
                  <div className="skeleton" />
                </>
              )}

              {stop ? (
                <div className="location-card">
                  <Bus />
                  <div>
                    {stop.Description}
                    <br />
                    <a href={window.location.href}>Save this stop</a>
                  </div>
                </div>
              ) : (
                <div className="location-card">
                  <Bus />
                  <span>Can't find stop.</span>
                </div>
              )}
              {trips.map((trip: any) => (
                <Card trip={trip} />
              ))}
              {stop && trips.length === 0 && (
                <div className="location-card">
                  {' '}
                  <Bus /> No trips found.
                </div>
              )}
            </>
          )}

          <div className="disclaimer">
            By using this app, you agree that it's not my fault if something
            goes wrong and you miss your bus.
          </div>
        </div>
      </div>
      <div className="banner">Enjoying the app?</div>
    </>
  );
}

export default () => {
  return (
    <Router>
      <App />
    </Router>
  );
};
