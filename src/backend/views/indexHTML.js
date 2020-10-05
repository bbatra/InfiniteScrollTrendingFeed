/**
 * Created by bharatbatra on 09/02/20.
 */
function renderHTML(layoutOptions, innerHTML,  clientConfig) {
  return `<!doctype html>
<html lang="en-US">
<head>
<style>
html{
    font-family: 'Open Sans', sans-serif;
}

body{
    margin: unset
}
</style>
<title> Bharat's timeline app - airtable interview take home assignment (front end) </title>
</head>
<body>
   <div id="app">${innerHTML}</div>
    <script>
        window.__CLIENT_CONFIG__ = ${JSON.stringify(clientConfig)}
    </script>
  <script defer src=${layoutOptions.bundleJS}></script>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&amp;display=swap" rel="stylesheet" type="text/css" />

 </body>
 </html>`;
}
export default renderHTML;