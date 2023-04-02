async function fetchData(spec) {
    try {
        let country,
            classificationName,
            page = 0,
            keyword,
            count;
        if (Object.keys(spec).length >= 3) {
            classificationName = spec.classificationName;
            if (spec.page) page = spec.page;
            country = spec.countryCode;
            keyword = spec.keyword;
        } else {
            keyword = spec.target.keyword.value;
            classificationName = spec.target.classificationName.value;
            country = spec.target.country.value;
        }
        let parameters = {
            apikey: "Feg3lAzz6HBfFON8Wy4mWOMbuVnBVerw",
            countryCode: country,
            classificationName: classificationName,
            keyword: keyword,
            page: page,
            sort: "date,name,asc",
        };
        let myurl = "https://app.ticketmaster.com/discovery/v2/events.josn?";
        count = 1;
        let addon = "",
            link = "";
        for (const property in parameters) {
            if (property === "page") {
                addon += property + "=" + parameters[property];
            } else {
                link += property + "=" + parameters[property];
                addon += property + "=" + parameters[property];
            }
            if (count != Object.keys(parameters).length) {
                if (property === "page") {
                    addon += "&";
                } else {
                    link += "&";
                    addon += "&";
                }
            }
            count++;
        }
        myurl = myurl + addon;
        response = await fetch(myurl);
        data = await response.json();

        let fSection = select("#search");
        if (fSection) {
            fSection.remove();
        }
        let fHead = select("#shead");
        if (fHead) {
            fHead.remove();
        }
        let fPages = select("#pages");
        if (fPages) {
            fPages.remove();
        }
        let fError = select("#error");
        if (fError) {
            fError.remove();
        }
        if (data.page.totalElements === 0) {
            throw "Sorry, there are no results for your search. Please try again.";
        }
        let form = select("form");
        let newS = makeElement("section");
        newS.setAttribute("id", "search");
        let resultWord;
        if (data.page.totalElements === 1) {
            resultWord = "result";
        } else {
            resultWord = "results";
        }
        let h2 = makeElement(
            "h2",
            "Event " + data.page.totalElements + " " + resultWord
        );
        h2.setAttribute("id", "shead");
        let pages = makeElement("span", "Pages: ");
        pages.setAttribute("id", "pages");
        let pagecount = data.page.totalPages;
        let pageLimit = 50;
        if (pagecount > pageLimit) {
            pagecount = pageLimit;
        }
        for (let i = 0; i < pagecount; i++) {
            pages.innerHTML +=
                "<a href='index2.html?" +
                link +
                "&page=" +
                i +
                "'>" +
                (i + 1) +
                "</a> ";
        }
        form.after(h2);
        h2.after(pages);
        pages.after(newS);
        // Attractions: event["_embedded"].attractions
        data["_embedded"].events.forEach(function (event, idx, arr) {
            let image = event.images.filter((element) => {
                return element.height === 115;
            });
            let venue = event["_embedded"].venues[0].name;
            let cityState =
                event["_embedded"].venues[0].city.name +
                ", " +
                event["_embedded"].venues[0].state.stateCode;

            let strongE = makeElement("strong", event.name);
            let span = makeElement("span");
            let span2 = makeElement("span", venue);
            let span3 = makeElement("span", cityState);
            let div = makeElement("div");
            div.setAttribute("id", "desc");
            span.setAttribute("style", "width: 250px");
            let articles = makeElement("article");
            articles.append(div);
            span.append(strongE);
            div.prepend(span);
            span.after(span2);
            span2.after(span3);
            if (data["_embedded"].events.length % 2 == 0) {
                if (idx !== arr.length - 1 && idx !== arr.length - 2) {
                    articles.setAttribute(
                        "style",
                        "border-bottom: 1px solid red;"
                    );
                }
            } else {
                if (idx !== arr.length - 1) {
                    articles.setAttribute(
                        "style",
                        "border-bottom: 1px solid red;"
                    );
                }
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
                dateF =
                    event.dates.timezone + " " + event.dates.start.localDate;
            } else {
                dateF =
                    event.dates.timezone +
                    " " +
                    event.dates.start.localDate +
                    " " +
                    event.dates.start.localTime;
            }
            let date = new Date(dateF);
            const option = { weekday: "long" };
            const hours = date.getHours();
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
        let form = select("form");
        let div = makeElement("div", e);
        div.setAttribute("id", "error");
        form.after(div);
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

function loadSearch() {
    var params = new URLSearchParams(window.location.search);
    let vars = {};
    for (let p of params) {
        vars[p[0]] = p[1];
    }
    //console.log(vars);
    fetchData(vars);
}
const form = select("form");
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        fetchData(event);
    });
}
const sform = select("#sform");
if (sform) {
    sform.addEventListener("submit", (event) => {
        event.preventDefault();
        fetchData(event);
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
