 //functions/user.js
 import { getShortName } from "./index"
 export default function handler(request, response) {
   const name = "Hilary";
   const shortName = getShortName(name);
   response.status(200).send({ name, shortName});
 }