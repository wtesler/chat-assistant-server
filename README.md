## Chat Assistant Server

Node server for hosting Chat Assistant functionality.

## Architecture

-Uses Express for hosting endpoints.
-Endpoints are exported with cranny syntax (developed by Will Tesler). See `index.js`.

## Setup Gcloud

gcloud auth login --update-adc
gcloud config set project PROJECT_NAME

## Deploy

gcloud app deploy --version 1

## Local Development

Use `npm run startDev` .

All functions have associated admin files for running the functionality directly.

## Secret Manager
This project uses Google Cloud's secrets manager for key access like the OpenAi key. In order to view secrets,
you must have the "Secret Manager Secret Accessor" role applied in the IAM console.

### Google Cloud Storage CORS Support

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
