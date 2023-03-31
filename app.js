async function fetchData(spec) {
    try {
        let country,
            cat,
            page = 0,
            keywords,
            count;
        if (Object.keys(spec).length >= 3) {
            cat = spec.cat;
            if (spec.page) page = spec.page;
            country = spec.country;
            keywords = spec.keywords;
        } else {
            keywords = spec.target.keywords.value;
            cat = spec.target.cat.value;
            country = spec.target.country.value;
        }
        let parameters = {
            apikey: "Feg3lAzz6HBfFON8Wy4mWOMbuVnBVerw",
            countryCode: country,
            classificationName: cat,
            keyword: keywords,
            page: page,
            sort: "date,name,asc",
        };
        let myurl = "https://app.ticketmaster.com/discovery/v2/events.josn?";
        count = 1;
        for (const property in parameters) {
            myurl += property + "=" + parameters[property];
            if (count != Object.keys(parameters).length) {
                myurl += "&";
            }
            count++;
        }
        response = await fetch(myurl);
        data = await response.json();

        let fSection = select("#search");
        if (fSection) {
            fSection.remove();
        }
        let form = select("form");
        let newS = makeElement("section");
        newS.setAttribute("id", "search");

        form.after(newS);
        data["_embedded"].events.forEach(function (event, idx, arr) {
            let image = event.images.filter((element) => {
                return element.height === 115;
            });
            let span = makeElement("span", event.name);
            span.setAttribute("style", "width: 250px");
            let articles = makeElement("article");
            articles.append(span);
            if (idx !== arr.length - 1) {
                articles.setAttribute("style", "border-bottom: 1px solid red;");
            }
            newS.append(articles);
            image.forEach((element) => {
                let imgE = makeElement("img");
                imgE.setAttribute("src", element.url);
                imgE.setAttribute("alt", event.name);

                articles.prepend(imgE);
            });
            let div1, div2, div3, dateF;

            if (event.dates.start.noSpecificTime) {
                dateF = event.dates.start.localDate;
            } else {
                dateF =
                    event.dates.start.localDate +
                    " " +
                    event.dates.start.localTime;
            }
            let date = new Date(dateF);
            div1 = makeElement("div");
            div1.setAttribute("style", "text-align: center;");
            const options = { month: "long" };
            div2 = makeElement(
                "div",
                new Intl.DateTimeFormat("en-US", options).format(date)
            );
            div3 = makeElement("div", date.getDate());
            articles.append(div1);
            div1.append(div2);
            div2.after(div3);
        });
    } catch (e) {
        console.log(e);
    }
}
function makeElement(type, info = "") {
    let element = document.createElement(type);
    element.innerHTML = info;
    return element;
}
function select(area) {
    return document.querySelector(area);
}
function loadPages(event) {}

function loadSearch() {
    var params = new URLSearchParams(window.location.search);
    let vars = {};
    for (let p of params) {
        vars[p[0]] = p[1];
    }
    //console.log(vars);
    fetchData(vars);
}
const form = document.querySelector("form");
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        fetchData(event);
        loadPages(event);
    });
}
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
