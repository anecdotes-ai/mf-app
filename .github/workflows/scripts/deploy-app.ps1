Invoke-Expression "gsutil -m rsync -R "${Env:$APP_DIRECTORY}" gs://${Env:GCS_BUCKET}"