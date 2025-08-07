import CheckboxSort from "./src/index.js";

const answer = await CheckboxSort({
    message: "Please select your favorite fruits",
    choices: [
        { name: "Apple", value: "apple" },
        { name: "Banana", value: "banana", disabled: true },
        { name: "Cherry", value: "cherry" },
        { name: "Date", value: "date" },
        "Elderberry"
    ],
})
console.log("Selected fruits:", answer);