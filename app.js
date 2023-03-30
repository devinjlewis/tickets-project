async function fetchData() {
    try {
        let parameters = {
            countryCode: "",
            apikey: "Feg3lAzz6HBfFON8Wy4mWOMbuVnBVerw",
            classificationName: "music",
            keyword: "",
        };
        let myurl = "https://app.ticketmaster.com/discovery/v2/events.json?";
        count = 1;
        for (const property in parameters) {
            myurl += property + "=" + parameters[property];
            if (count != Object.keys(parameters).length) {
                myurl += "&";
            }
            count++;
        }
        console.log(myurl);
        response = await fetch(myurl);
        data = await response.json();
        //   console.log(data);
        return data;
        //console.log(data.results[0].url);
    } catch (e) {
        console.log(e);
    }
}
data = fetchData();
//console.log(data);

data.then((a) => {
    console.log(data);
});

// const printAddress = () => {
//     data.then((a) => {
//       console.log(a);
//     });
//   };

//  printAddress();
//   console.log(data);
//   data2 = fetchData(data.results[0].url);
//   const printAddress2 = () => {
//     data2.then((a) => {
//       console.log(a);
//     });
//   };

//   printAddress2();
