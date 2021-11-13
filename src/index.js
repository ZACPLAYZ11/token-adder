import {
  setThing,
  addStringNoLocale,
  saveSolidDatasetAt,
  getSolidDataset,
  getThing,
  
} from "@inrupt/solid-client";

import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from "@inrupt/solid-client-authn-browser";

const buttonLogin = document.querySelector("#btnLogin");
const buttonAdd = document.querySelector("#btnAdd");

const buttonAlert = document.querySelector("#btnAlert");
buttonAlert.onclick = function() {
  alert("WORKING")
  console.log("WORKING")
}

// 1a. Start Login Process. Call login() function.
function startLogin(oidcIssuer) {
  return login({
    // oidcIssuer: "https://broker.pod.inrupt.com",
    oidcIssuer: oidcIssuer,
    redirectUrl: window.location.href,
    clientName: "Getting started !"
  });
}

// 1b. Login Redirect.
// When redirected after login, call handleIncomingRedirect() function to
// finish the login process by retrieving session information.
async function finishLogin() {
    let token = document.getElementById("tokenValue").value;
    await handleIncomingRedirect();
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      let webIdUrl = session.info.webId;
      document.getElementById("labelStatus").textContent = `Logged in with WebID ${session.info.webId}`;

    }

}

// The example has the login redirect back to the index.html.
// finishLogin() calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.

finishLogin();

async function addToken(token_value, webIdUrl) {

  const profileCardUrl = `${webIdUrl}`;
  const OIDC_SCHEMA ="http://www.w3.org/ns/solid/terms#oidcIssuerRegistrationToken"
  let myProfileCard ;
 

  try {
    myProfileCard = await getSolidDataset(profileCardUrl, { fetch: fetch });
  } catch (error) {
      console.error(error.message);
  }

  let card = getThing(myProfileCard, webIdUrl)
  card = addStringNoLocale(card, OIDC_SCHEMA, token_value);
  myProfileCard = setThing(myProfileCard, card);

  try {
    // Save the SolidDataset
    await saveSolidDatasetAt(
      profileCardUrl,
      myProfileCard,
      { fetch: fetch }
    );
  } catch (error) {
    console.log(error);
  } 
}

buttonLogin.onclick = function() {
  let oidcIssuer = document.getElementById('oidcIssuer').value
  startLogin(oidcIssuer);
};

buttonAdd.onclick = function() {
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      let token = document.getElementById('tokenValue').value
      addToken(token, session.info.webId );
      document.getElementById("sendStatus").textContent = `token sent`;
    }else{
      document.getElementById("labelStatus").textContent = ` 👈 Please login first`;
    }
};



