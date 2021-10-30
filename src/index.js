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
    let podUrl ;
    let webIdUrl
    if (session.info.isLoggedIn) {
      // Update the page with the status.
      document.getElementById("labelStatus").textContent = `Logged in with WebID ${session.info.webId}`;
      document.getElementById("labelStatus").setAttribute("role", "alert");
      webIdUrl = session.info.webId;
      podUrl = webIdUrl.replace('profile/card#me', '');
      document.getElementById("WebIdURL").setAttribute("value", webIdUrl);
      // Enable Create button
    }
    let d = new Date()
    addToken(d.getSeconds(), webIdUrl);
}

// The example has the login redirect back to the index.html.
// finishLogin() calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.
finishLogin();

async function addToken(token_value, podUrl) {
  // labelCreateStatus.textContent = "";
 
  // For simplicity and brevity, this tutorial hardcodes the SolidDataset URL.
  // In practice, you should add a link to this resource in your profile that applications can follow.
  const profileCardUrl = `${podUrl}/profile/card/`;
  const OIDC_SCHEMA ="http://www.w3.org/ns/solid/terms#oidcIssuerRegistrationToken"
  let myProfileCard ;
 
  // Fetch or create a new reading list.

  try {
    // Attempt to fetch the reading list in case it already exists.
    myProfileCard = await getSolidDataset(profileCardUrl, { fetch: fetch });
    console.log("could read profile card")

    // Clear the list to override the whole list
    // let titles = getThingAll(myProfileCard);
  } catch (error) {
    if (typeof error.statusCode === "number" && error.statusCode === 404) {
      // if not found, create a new SolidDataset (i.e., the reading list)
      myProfileCard = createSolidDataset();
    console.log("could NOT read profile card")
    console.log("creating one..")
    } else {
      console.error(error.message);
    }
  }

    const webIdUrl = myProfileCard.internal_resourceInfo.sourceIri + '#me'
    let card = getThing(myProfileCard, webIdUrl)
    card = addStringNoLocale(card, OIDC_SCHEMA, token_value);
    myProfileCard = setThing(myProfileCard, card);

  try {
     
    // Save the SolidDataset 
    let savedReadingList = await saveSolidDatasetAt(
      profileCardUrl,
      myProfileCard,
      { fetch: fetch }
    );

    // labelCreateStatus.textContent = "Saved";

  } catch (error) {
    console.log(error);
    // labelCreateStatus.textContent = "Error" + error;
    // labelCreateStatus.setAttribute("role", "alert");
  } 
}




async function addIndexToken() {
  console.log("add token")
  labelCreateStatus.textContent = "";
  const podUrl = document.getElementById("WebIdURL").value;
  const token_value = document.getElementById("token").value;
  addToken(token_value, podUrl)

}


async function fetch_oidc_token() {

    // Refetch the Reading List
    let savedReadingList = await getSolidDataset(
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
}


buttonLogin.onclick = function() {  
  startLogin();
};



buttonAddToken.onclick = function() {
  addIndexToken();
};

