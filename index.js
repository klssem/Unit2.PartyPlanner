const cohortName = "2310-fsa-et-web-pt-sf-b-kelssem";
const apiURL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohortName}/events`;

const form = document.querySelector("#eventForm");
const eventListSection = document.getElementById("eventsSection");

// data from the server will be stored in the state.partyEvents variable
const state = {
    partyEvents: [],
}


getData();
//listen for the event that happens when the submit button gets clicked
//If the submit button gets clicked, call the postEvent() function.
form.addEventListener("submit", postEvent);
eventListSection.addEventListener("click", deleteEvent);

function getButtons(){
    buttons = document.querySelectorAll(".deleteBtn");
    console.log(buttons);
}


//function to get data from server
async function getData(){
    state.partyEvents = [];
    while(eventListSection.hasChildNodes()){
    eventListSection.removeChild(eventListSection.firstChild);
}

    //getting data from server using API Call
    const apiCall = await fetch(apiURL);
    //converting data to json format
    const toJson = await apiCall.json();
    //storing the objects inside state.partyEvents
    state.partyEvents = toJson.data;
    // console.log(toJson.data);
    updateDOM();
}

//function to update the DOM with a list of events stored in the state
function updateDOM(){
    
    state.partyEvents.forEach(partyEvent => {
        let newCard = document.createElement("div");
        let localDate = new Date(partyEvent.date).toLocaleString();

        // let unOrderedList = document.createElement("");
        newCard.className = "cards";
        
        newCard.innerHTML = `
            <button id="${partyEvent.id}" class="deleteBtn" >X</button>
            <h4>${partyEvent.name}</h4>
            <ul>
                <li><strong>Party ID:</strong> ${partyEvent.id}</li>
                <li><strong>Date:</strong> ${localDate}</li>
                <li><strong>Location:</strong> ${partyEvent.location}</li><br>
                <li><strong>Description:</strong> ${partyEvent.description}</li>
            </ul>
                `;
                
                eventListSection.appendChild(newCard);
            });
        }
        
//function to post data from the form to the server
async function postEvent(event){
    event.preventDefault();

    try {
        const formEvent = event.target;

        const apiRequest = await fetch(apiURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: formEvent.name.value,
                description: formEvent.description.value,
                date: new Date(formEvent.date.value).toISOString(),
                location: formEvent.location.value,
            }),
        });
        
        getData();
        console.log(apiRequest.status);
    } catch (err) {
        console.error("Something went wrong!");
    }
    
}

//function to delete event from the server
async function deleteEvent(eventObject){
    try {
        if(eventObject.target.className === "deleteBtn"){
            const buttonId = eventObject.target.id;
            console.log(eventObject.target.id);
    
            const apiCall = await fetch(`${apiURL}/${buttonId}`, {
                method: "DELETE",
                headers:  {"Content-Type": "application/json"},
                body: null,
            });
            console.log(apiCall);
            getData();
        }
        
    } catch (err) {
        console.error(err.message);
    }

}