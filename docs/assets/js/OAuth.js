
      // Client ID and API key from the Developer Console
      var CLIENT_ID = '58004022070-hjm2c4m8kd9bn83i3rkvf4vn2sq05mad.apps.googleusercontent.com';
      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
      var oauthButton = document.getElementById('oauth-button');
      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }
      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          
        });
      }
      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          oauthButton.onclick = handleSignout;
		  oauthButton.innerText = "Signout";
        } else {
          oauthButton.onclick = handleSignin;
		  oauthButton.innerText = "Authorize";
        }
      }
      /**
       *  Sign in the user upon button click.
       */
      function handleSignin(event) {
        gapi.auth2.getAuthInstance().signIn();
      }
      /**
       *  Sign out the user upon button click.
       */
      function handleSignout(event) {
        gapi.auth2.getAuthInstance().signOut();
      }
      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }
      /**
       * Adds the values from the form to the sheet.
       */
      function writeData(form) {
		var url = form.urlBox.value;
		url = url.split("/")[5];
		var timestamp = new Date();
		var values = [ [ timestamp, form.activityBox.value, form.emailBox.value, form.numPDUBox.value, form.msgBox.value ] ];
        gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: url,
          range: 'A1:E1', valueInputOption: 'USER_ENTERED', values
        }).then(function(response) {
          var range = response.result;
          if (range.values.length > 0) {
            appendPre('Name, Major:');
            for (i = 0; i < range.values.length; i++) {
              var row = range.values[i];
              // Print columns A and E, which correspond to indices 0 and 4.
              appendPre(row[0] + ', ' + row[4]);
            }
          } else {
            appendPre('No data found.');
          }
        }, function(response) {
          appendPre('Error: ' + response.result.error.message);
        });
      }
