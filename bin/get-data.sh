#!/bin/bash
rankings_data="https://wca-seniors.org/data/Senior_Rankings.js"
destination_dir="public/data" # Local development

mkdir --parents "$destination_dir"
curl --fail "$rankings_data" >"$destination_dir"/senior-rankings.js
