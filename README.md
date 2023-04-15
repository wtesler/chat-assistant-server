## Chat Assistant Server

Node server for hosting Chat Assistant functionality.

## Architecture

-Uses Express for hosting endpoints.
-Endpoints are exported with cranny syntax (developed by Will Tesler). See `index.js`.

## Setup Gcloud

gcloud auth login --update-adc
gcloud config set project PROJECT_NAME

## Deploy

`cd /host`

#### Create Image (One time only)
gcloud builds submit --tag gcr.io/will-chat-assistant/chat-assistant-image

#### Deploy Service
gcloud run deploy chat-assistant-service --image gcr.io/will-chat-assistant/chat-assistant-image-slim --region us-central1

## Local Development

Use `npm run startDev` from `/host`.

All functions have associated admin files for running the functionality directly.

Create a .env file in host folder. Add `DEV_HTTPS_CERT`, `DEV_HTTPS_KEY`, and `OPEN_AI_KEY`.

`DEV_HTTPS_CERT`, `DEV_HTTPS_KEY` are used to test the server over LAN.
See https://flaviocopes.com/express-https-self-signed-certificate/

Run once if needed:
npm install -g dotenv-cli

### Google Cloud Storage CORS Support (If needed)

#### One time setup per every new Google Cloud Storage Bucket
Paste the following into a json file called `cors.json`:
```
[
    {
      "origin": ["*"],
      "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "x-goog-resumable"],
      "method": ["PUT", "GET", "POST"],
      "maxAgeSeconds": 3600
    }
]
```

Run `gsutil cors set cors.json gs://BUCKET`

Where `BUCKET` is the bucket which needs CORS support.
