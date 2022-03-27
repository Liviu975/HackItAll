

//Fetch firme
let companies
fetch("Json/firme.json")
    .then(response => response.json())
    .then(data => {
        companies = data;
    })
    .then(data => {
        for (let [index, company] of companies.entries()) {
            //create row div 
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
            rowDiv.classList.add("little-margin-top");
            rowDiv.classList.add("background-primary");

            //create column div
            const colDiv = document.createElement("div");
            colDiv.classList.add("text-center");
            colDiv.classList.add("company_link");
            colDiv.classList.add("border-radius");

            //create company title button
            const companyName = document.createElement("h1");
            companyName.id = index;
            companyName.textContent = company.Nume_Companie;
            colDiv.appendChild(companyName);
            //apend the collumn to the row
            rowDiv.appendChild(colDiv);

            const companyListContainer = document.querySelector("#companyList");
            companyListContainer.appendChild(rowDiv);
        }

        const allButtons = document.querySelectorAll(".company_link > h1")

        allButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector("#companyList").classList.add("display-none");
                document.querySelector("#ESG_title").classList.remove("display-none");
                document.querySelector("#dashboard").classList.remove("display-none");
                document.querySelector("#back_button").classList.remove("display-none");
                document.querySelector("#from_where").textContent = `${button.innerText}`;

                const titluCompanie = document.querySelector("#company_name > h3").textContent = `${button.innerText}`;
                let EdataForChart = [];
                let SdataForChart = [];
                let GdataForChart = [];
                let nr_pondere = 0;
                let EdataValue = 0;
                let SdataValue = 0;
                let GdataValue = 0;
                for (let [index, company] of companies.entries()) {


                    if (titluCompanie == company.Nume_Companie) {
                        const domain = company.Domeniu;

                        fetch(`Json/domeniu.${domain}.json`)
                            .then(data => data.json())
                            .then(data => {
                                const environment = data[0].Criterii.E;
                                Object.entries(environment).forEach(item => {
                                    if (company.Criterii.E.hasOwnProperty(item[0])) {
                                        EdataForChart.push(company.Criterii.E[`${item[0]}`].valoare * item[1].pondere);
                                        nr_pondere += item[1].pondere;
                                    }
                                })

                                for (let value of EdataForChart) {
                                    EdataValue += value;
                                }
                                EdataValue = Math.round(EdataValue / nr_pondere);
                                nr_pondere = 0;


                                const social = data[0].Criterii.S;
                                Object.entries(social).forEach(item => {
                                    if (company.Criterii.S.hasOwnProperty(item[0])) {
                                        SdataForChart.push(company.Criterii.S[`${item[0]}`].valoare * item[1].pondere);
                                        nr_pondere += item[1].pondere;
                                    }

                                })

                                for (let value of SdataForChart) {
                                    SdataValue += value;
                                }
                                SdataValue = Math.round(SdataValue / nr_pondere);
                                nr_pondere = 0;

                                const guvernance = data[0].Criterii.G;
                                Object.entries(guvernance).forEach(item => {
                                    if (company.Criterii.G.hasOwnProperty(item[0])) {
                                        GdataForChart.push(company.Criterii.G[`${item[0]}`].valoare * item[1].pondere);
                                        nr_pondere += item[1].pondere;
                                    }
                                })

                                for (let value of GdataForChart) {
                                    GdataValue += value;
                                }
                                GdataValue = Math.round(GdataValue / nr_pondere);
                                nr_pondere = 0;

                                console.table(EdataValue, SdataValue, GdataValue)

                                let someValue = 25;
                                if (EdataValue + SdataValue + GdataValue % 2 != 0) {
                                    someValue = 25 * 2 + EdataValue + SdataValue + GdataValue % 2
                                }

                                const dif = EdataValue + SdataValue + GdataValue - someValue;
                                const procentage = ((100 * dif) / someValue);

                                if (procentage >= 0) {
                                    document.querySelector("#improvement").textContent = `+${procentage.toFixed(2)}`;
                                    document.querySelector("#improvement").style.color = "green";
                                    if (procentage > 0 && procentage <= 2) {
                                        document.querySelector("#grade").textContent = "BB"
                                    } else if (procentage > 2) {
                                        document.querySelector("#grade").textContent = "BBB";
                                    } else if (procentage == 0) {
                                        document.querySelector("#grade").textContent = "B";
                                    }
                                } else if (procentage < 0) {
                                    document.querySelector("#improvement").textContent = `${procentage.toFixed(2)}`;
                                    document.querySelector("#improvement").style.color = "red";
                                    document.querySelector("#grade").textContent = "Junk";
                                }

                                let someValue1 = EdataValue + SdataValue + GdataValue / 5 * 3 - Math.round(Math.random() * 10);

                                function linearRegression(inputArray, xLabel, yLabel) {
                                    const x = inputArray.map((element) => element[xLabel]);
                                    const y = inputArray.map((element) => element[yLabel]);
                                    const sumX = x.reduce((prev, curr) => prev + curr, 0);
                                    const avgX = sumX / x.length;
                                    const xDifferencesToAverage = x.map((value) => avgX - value);
                                    const xDifferencesToAverageSquared = xDifferencesToAverage.map(
                                        (value) => value ** 2
                                    );
                                    const SSxx = xDifferencesToAverageSquared.reduce(
                                        (prev, curr) => prev + curr,
                                        0
                                    );
                                    const sumY = y.reduce((prev, curr) => prev + curr, 0);
                                    const avgY = sumY / y.length;
                                    const yDifferencesToAverage = y.map((value) => avgY - value);
                                    const xAndYDifferencesMultiplied = xDifferencesToAverage.map(
                                        (curr, index) => curr * yDifferencesToAverage[index]
                                    );
                                    const SSxy = xAndYDifferencesMultiplied.reduce(
                                        (prev, curr) => prev + curr,
                                        0
                                    );
                                    const slope = SSxy / SSxx;
                                    const intercept = avgY - slope * avgX;
                                    return (x) => avgX;
                                }
                                
                                    inputArray = [
                                        {
                                            "months": 1,
                                            "ESG": 65
                                        },
                                        {

                                            "months": 2,
                                            "ESG": someValue1,
                                        },
                                        {

                                            "months": 3,
                                            "ESG": 80,
                                        },
                                        {

                                            "months": 4,
                                            "ESG": 81,
                                        },
                                        {

                                            "months": 5,
                                            "ESG": someValue,
                                        },
                                        {

                                            "months": 6,
                                            "ESG": EdataValue + SdataValue + GdataValue,
                                        }
                                    ]


                                const linReg = linearRegression(inputArray, "ESG", "months");
                                    
                                let data1 = {
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July-Prediction'],
                                    datasets: [{
                                        label: 'Looping tension',
                                        data: [65, someValue1, 80, 81, someValue, EdataValue + SdataValue + GdataValue, linReg(7).toFixed(2)],
                                        fill: true,
                                        borderColor: 'rgb(75, 192, 192)',
                                    }]
                                };

                                const config = {
                                    type: "line",
                                    data: data1,
                                    options: {
                                        animations: {
                                            tension: {
                                                duration: 1000,
                                                easing: 'linear',
                                                from: 0.5,
                                                to: 0,
                                                loop: true
                                            }
                                        },
                                        scales: {
                                            y: {
                                                min: 0,
                                                max: EdataValue + SdataValue + GdataValue + 20
                                            }
                                        }
                                    }
                                }

                                const ctx = document.getElementById('myChart');
                                const myChart = new Chart(ctx, config);

                                //Donut chart
                                const dataDonutChart = {
                                    labels: ["E", "S", "G"],
                                    datasets: [{
                                        label: 'My First Dataset',
                                        data: [EdataValue, SdataValue, GdataValue],
                                        backgroundColor: [
                                            'rgb(255, 99, 132)',
                                            'rgb(54, 162, 235)',
                                            'rgb(255, 205, 86)'
                                        ],
                                        hoverOffset: 4
                                    }]
                                };

                                //Donut chart background
                                const configDonut = {
                                    type: "doughnut",
                                    data: dataDonutChart,

                                }

                                const ctx2 = document.getElementById('donutChart');
                                const myChart2 = new Chart(ctx2, configDonut);

                                //Config object line triple chart
                                const dataTripleChart = {
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [{
                                        label: 'E',
                                        data: [65, 59, 80, 81, 26, EdataValue],
                                        fill: false,
                                        borderColor: 'rgb(255, 99, 132)'
                                    },
                                    {
                                        label: 'S',
                                        data: [90, 87, 12, 67, 90, SdataValue],
                                        fill: false,
                                        borderColor: 'rgb(54, 162, 235)'
                                    },
                                    {
                                        label: 'G',
                                        data: [5, 128, 40, 21, 56, GdataValue],
                                        fill: false,
                                        borderColor: 'rgb(255, 205, 86)'
                                    }]
                                };

                                const configTripleChart = {
                                    type: "line",
                                    data: dataTripleChart,
                                    options: {
                                        animations: {
                                            tension: {
                                                duration: 1000,
                                                easing: 'linear',
                                                from: 0.4,
                                                to: 0.1,
                                                loop: true
                                            }
                                        },
                                        scales: {
                                            y: {
                                                min: 0,
                                                max: 150
                                            }
                                        }
                                    }
                                }

                                const ctxTripleChart = document.getElementById('tripleChart');
                                const myTripleChart = new Chart(ctxTripleChart, configTripleChart);

                                document.querySelector("#score").textContent = EdataValue + SdataValue + GdataValue;



                                EdataForChart = [];
                                SdataForChart = [];
                                GdataForChart = [];
                                nr_pondere = 0;
                                EdataValue = 0;
                                SdataValue = 0;
                                GdataValue = 0;
                            })

                    }
                }


            })
        })
    })


document.querySelector("#back_button").addEventListener("click", () => {
    document.querySelector("#companyList").classList.remove("display-none");
    document.querySelector("#ESG_title").classList.add("display-none");
    document.querySelector("#dashboard").classList.add("display-none");
    document.querySelector("#back_button").classList.add("display-none");
    document.querySelector("#from_where").textContent = "";
    location.href = 'http://127.0.0.1:5500/index.html'
})

const linkImob = 'Json/domeniu.imobiliare.json';
const linkIt = 'Json/domeniu.IT.json';
const linkLemn = 'Json/domeniu.lemn.json';


