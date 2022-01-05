import { useState } from 'react';

const getMinutes = (departureTime: string) => {
  const minutes = Math.floor(
    (new Date(departureTime).getTime() - new Date().getTime()) / (1000 * 60),
  );
  if (minutes < 0) {
    return 'Departed';
  }

  if (minutes < 1) {
    return 'Arriving now';
  }

  if (minutes < 2) {
    return `1 minute away`;
  }

  return `${minutes} minutes away`;
};

export function Card({ trip }: { trip: any }) {
  const [details, setDetails] = useState(false);

  return (
    <div className="trip-card" onClick={() => setDetails(!details)}>
      <div className="summary">
        <div className="avatar">
          <small>{trip?.Summary?.RouteName}</small>
          {trip?.Summary?.RouteCode}
        </div>
        <div className="card-content">
          <span className="title">{getMinutes(trip?.DepartTime)}</span>
          <span className="secondary-text">
            {trip?.RealTimeStopStatusDetail}
          </span>
        </div>
      </div>
      <div className={`details ${details ? 'show' : 'hide'}`}>
        <p>{trip?.DisplayTripTitle}</p>
        <p>{trip?.DisplayTripDescription}</p>
      </div>
    </div>
  );
}
