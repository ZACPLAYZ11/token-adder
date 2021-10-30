import {
  createSolidDataset,
  createThing,
  setThing,
  addUrl,
  addStringNoLocale,
  saveSolidDatasetAt,
  getSolidDataset,
  getThingAll,
  getThing,
  getStringNoLocale,
  removeThing,
  FetchError
} from "@inrupt/solid-client";

import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from "@inrupt/solid-client-authn-browser";

import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";

const buttonLogin = document.querySelector("#btnLogin");
const buttonAddToken = document.querySelector("#btnAddToken");
const buttonCreate = document.querySelector("#btnCreate");
buttonCreate.disabled=true;
const labelCreateStatus = document.querySelector("#labelCreateStatus");

// 1a. Start Login Process. Call login() function.
function startLogin() {
  return login({

    // oidcIssuer: "https://broker.pod.inrupt.com",
    oidcIssuer: "https://solidcommunity.net",

    redirectUrl: window.location.href,
    clientName: "Getting started !"
  });
}

// 1b. Login Redirect.
// When redirected after login, call handleIncomingRedirect() function to
// finish the login process by retrieving session information.
async function finishLogin() {
    await handleIncomingRedirect();
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      // Update the page with the status.
      document.getElementById("labelStatus").textContent = `Logged in with WebID ${session.info.webId}`;
      document.getElementById("labelStatus").setAttribute("role", "alert");
      const podUrl = session.info.webId.replace('/profile/card#me', '')
      document.getElementById("PodURL").setAttribute("value", podUrl);
      // Enable Create button
      buttonCreate.disabled=false;
    }
}

// The example has the login redirect back to the index.html.
// finishLogin() calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.
finishLogin();

// 2. Create the Reading List
async function createList() {
  labelCreateStatus.textContent = "";
  const podUrl = document.getElementById("PodURL").value;
 
  // For simplicity and brevity, this tutorial hardcodes the SolidDataset URL.
  // In practice, you should add a link to this resource in your profile that applications can follow.
  const readingListUrl = `${podUrl}/getting-started/readingList/myList`;
  // const readingListUrl = `${podUrl}/profile/card`;
 
  let titles = document.getElementById("titles").value.split("\n");

  // Fetch or create a new reading list.
  let myReadingList;

  try {
    // Attempt to fetch the reading list in case it already exists.
    myReadingList = await getSolidDataset(readingListUrl, { fetch: fetch });
    // Clear the list to override the whole list
    let titles = getThingAll(myReadingList);
    titles.forEach(title => {
     // myReadingList = removeThing(myReadingList, title);
    });
  } catch (error) {
    if (typeof error.statusCode === "number" && error.statusCode === 404) {
      // if not found, create a new SolidDataset (i.e., the reading list)
      myReadingList = createSolidDataset();
    } else {
      console.error(error.message);
    }
  }

  // Add titles to the Dataset
  for (let i = 0; i < titles.length; i++) {
    let title = createThing({name: "title" + i + "-" + titles[i]});

    console.log("title:")
    console.log(title)
    console.log("ThingAll: ")
    const allt =getThingAll(myReadingList)
    console.log( allt )
    console.log("Thing: ")
    const url = "https://tmey.solidcommunity.net/getting-started/readingList/myList#title1"
    console.log(getThing(myReadingList, url))
    let item = addStringNoLocale(allt[0], SCHEMA_INRUPT.name, 'JOJOE');
    console.log(item)

    title = addStringNoLocale(title, SCHEMA_INRUPT.name, titles[i]);
    title = addStringNoLocale(title, SCHEMA_INRUPT.name, 'added title');
    title = addUrl(title, RDF.type, AS.Article);
    myReadingList = setThing(myReadingList, title);
  }

// adding a new prop (joe)
    console.log("Thing: ")
    const url = "https://tmey.solidcommunity.net/getting-started/readingList/myList#title0"
    let t0 = getThing(myReadingList, url)
    t0 = addStringNoLocale(t0, SCHEMA_INRUPT.name, "new added name");
    myReadingList = setThing(myReadingList, t0);

  try {
     
    // Save the SolidDataset 
    let savedReadingList = await saveSolidDatasetAt(
      readingListUrl,
      myReadingList,
      { fetch: fetch }
    );

    labelCreateStatus.textContent = "Saved";

    // Refetch the Reading List
    savedReadingList = await getSolidDataset(
      readingListUrl,
      { fetch: fetch }
    );

    let items = getThingAll(savedReadingList);

    let listcontent="";
    for (let i = 0; i < items.length; i++) {
      let item = getStringNoLocale(items[i], SCHEMA_INRUPT.name);
      if (item !== null) {
          listcontent += item + "\n";
      }
    }

    document.getElementById("savedtitles").value = listcontent;

  } catch (error) {
    console.log(error);
    labelCreateStatus.textContent = "Error" + error;
    labelCreateStatus.setAttribute("role", "alert");
  } 
}

async function addToken() {
  console.log("add token")
  labelCreateStatus.textContent = "";
  const podUrl = document.getElementById("PodURL").value;
 
  // For simplicity and brevity, this tutorial hardcodes the SolidDataset URL.
  // In practice, you should add a link to this resource in your profile that applications can follow.
  const profileCardUrl = `${podUrl}/profile/card`;
  let myProfileCard ;
 
  // Fetch or create a new reading list.

  try {
    // Attempt to fetch the reading list in case it already exists.
    myProfileCard = await getSolidDataset(profileCardUrl, { fetch: fetch });
    console.log("could read SolidDataset")

    // Clear the list to override the whole list
    // let titles = getThingAll(myProfileCard);
  } catch (error) {
    if (typeof error.statusCode === "number" && error.statusCode === 404) {
      // if not found, create a new SolidDataset (i.e., the reading list)
      myProfileCard = createSolidDataset();
    console.log("could NOT read SolidDataset")
    console.log("creating new..")
    } else {
      console.error(error.message);
    }
  }

  // Add titles to the Dataset
    // const url = "https://tmey.solidcommunity.net/getting-started/readingList/myList#title0"
    // t0 = getThing(myProfileCard, url)
    // let item = addStringNoLocale(t0, SCHEMA_INRUPT.name, 'JOJOE');
    // console.log(item)

    // title = addStringNoLocale(title, SCHEMA_INRUPT.name, titles[i]);
    // title = addStringNoLocale(title, SCHEMA_INRUPT.name, 'added title');
    // title = addUrl(title, RDF.type, AS.Article);
    // myProfileCard = setThing(myProfileCard, title);
  

// adding a new prop (joe)
    console.log("Thing: ")
    // const url = "https://tmey.solidcommunity.net/getting-started/readingList/myList#title0"
    const url = myProfileCard.internal_resourceInfo.sourceIri + '#me'
    console.log('url')
    console.log(url)
    console.log(SCHEMA_INRUPT.name)
    let t0 = getThing(myProfileCard, url)
    console.log('t0')
    console.log(t0)
    const schema ="http://www.w3.org/ns/solid/terms#oidcIssuerRegistrationToken"
    // t0 = addStringNoLocale(t0, SCHEMA_INRUPT.name, "new stuf");
    t0 = addStringNoLocale(t0, schema, "new stuf");
    myProfileCard = setThing(myProfileCard, t0);

  try {
     
    // Save the SolidDataset 
    let savedReadingList = await saveSolidDatasetAt(
      profileCardUrl,
      myProfileCard,
      { fetch: fetch }
    );

    labelCreateStatus.textContent = "Saved";

    // Refetch the Reading List
    savedReadingList = await getSolidDataset(
      profileCardUrl,
      { fetch: fetch }
    );

    let items = getThingAll(savedReadingList);

    let listcontent="";
    for (let i = 0; i < items.length; i++) {
      let item = getStringNoLocale(items[i], SCHEMA_INRUPT.name);
      if (item !== null) {
          listcontent += item + "\n";
      }
    }

    document.getElementById("savedtitles").value = listcontent;

  } catch (error) {
    console.log(error);
    labelCreateStatus.textContent = "Error" + error;
    labelCreateStatus.setAttribute("role", "alert");
  } 
}




buttonLogin.onclick = function() {  
  startLogin();
};

buttonCreate.onclick = function() {  
  createList();
};


buttonAddToken.onclick = function() {
  addToken();
};

