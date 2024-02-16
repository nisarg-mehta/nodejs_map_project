const fs = require('fs');
fs.readFile('gps_data.json', 'utf8', (err, originalData) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const parsedData = JSON.parse(originalData);

  const parsedGpsData = parsedData.map(packet => ({
    id: packet._id,
    longitude: packet.loc.coordinates[0],
    latitude: packet.loc.coordinates[1],
    speed: packet.sp,
    direction: packet.hd
  }));

  fs.writeFile('parsed_gps_data.json', JSON.stringify(parsedGpsData), err => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Parsed GPS data written to parsed_gps_data.json');
    }
  });
});