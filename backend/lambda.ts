import fetch from 'node-fetch';

export async function handler(e) {
  console.log('Invoking', e);
  const { stop } = e?.queryStringParameters ?? {};

  if (isNaN(Number(stop))) {
    throw new Error('Stop must be a number >:(');
  }

  const result = await fetch(
    'https://www.transperth.wa.gov.au/API/SilverRailRestService/SilverRailService/GetStopTimetable',
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        TabId: '141',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        ModuleId: '5310',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: `StopNumber=${stop}&IsRealTimeChecked=true&MaxTripCount=10`,
    },
  );

  const json = await result.json();
  return json;
}
