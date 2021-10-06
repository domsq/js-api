const API_KEY = "hf1-2OojoHUfp2mYVeyTxnwxMZs";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        };
    };

    document.getElementById("resultsModalTitle").textContent = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();

};

function processOptions(form) {

    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        };
    };

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        console.log(data.expiry);
    } else {
        displayException(data)
        throw new Error(data.error);
    };
};

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));
     
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    }
    else {
        displayException(data)
        throw new Error(data.error);
    };
};

function displayException(data) {

    let errorData = `<p>The API returned status code ${data.status_code}<br>
    Error Number: <span class="fw-bold">${data.error_no}</span><br>
    Error Text: <span class="fw-bold">${data.error}</span></p>`;

    document.getElementById("resultsModalTitle").textContent = "An Exception Occurred";
    document.getElementById("results-content").innerHTML = errorData;
    resultsModal.show();
};

