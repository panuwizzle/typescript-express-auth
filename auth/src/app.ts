import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { routes } from "./routes";
import { logMiddleware } from "./utils/logs";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";


import { ConfidentialClientApplication } from "@azure/msal-node";

// configuration
let options = {
  explorer: true,
};
dotenv.config();
const config = {
  auth: {
    clientId: "0829d66d-df72-44c4-8229-0b04cd4496aa",
    redirectUri: "http://localhost:3001",
    authority:
      "https://login.microsoftonline.com/ffe70b60-777e-4efc-8028-4b1704fac3d0",
    clientSecret: "wl78Q~RC99siNHCwnw9TU-p~9qrkhFJUTp1dvb9E",
  },
};


// boot express
const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logMiddleware);

const cca = new ConfidentialClientApplication(config);


import jwt from 'jsonwebtoken'

const validateAccessToken = async (accessToken: string) => {
  try {
    // Decode the access token to get the "kid" value from the "header"
    const decodedHeader = jwt.decode(accessToken, { complete: true });
    if (!decodedHeader) return
    const kid = decodedHeader.header.kid;
    console.log('decoded jwt ', decodedHeader)

    // Retrieve the signing key from your tenant's OpenID configuration
    const openIdConfigUrl = `https://login.microsoftonline.com/ffe70b60-777e-4efc-8028-4b1704fac3d0/.well-known/openid-configuration`;
    const response = await fetch(openIdConfigUrl);
    const openIdConfig = await response.json();
    const jwksUri = openIdConfig.jwks_uri;
    const jwksResponse = await fetch(jwksUri);
    const jwks = await jwksResponse.json();
    const signingKey = jwks.keys.find((key: { kid: string }) => key.kid === kid);

    console.log('signingKey ', signingKey)

    // Verify the access token using the signing key
    const decodedAccessToken = jwt.verify(accessToken, signingKey.x5c[0], { algorithms: ["RS256"] });
    return decodedAccessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};


app.get("/api/data", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ err: "no header" });
    return;
  }
  const parts = authHeader.split(" ");
  const token = parts[1];

  const result = await validateAccessToken(token)
  console.log('decoded ', result)
  /*
  try {
    const result = await cca.acquireTokenSilent({
      scopes: ["user.read"],
      accessToken: token,
    });
    // If the token is valid, do something with the data
    const data = { message: "Your data is here" };
    res.json(data);
  } catch (error) {
    console.log(error);
    // If the token is invalid, return an error
    res.status(401).json({ error: "Unauthorized" });
  }
  */
 res.status(200).json('ok')
});
// routes
app.use("/", routes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);

export default app;
