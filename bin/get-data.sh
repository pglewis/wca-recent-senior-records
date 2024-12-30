#!/bin/bash
rankings_data="https://wca-seniors.org/data/Senior_Rankings.js"
destination_dir="dist/data"
destination_file="senior-rankings.js"

mkdir --parents "$destination_dir"
curl --fail "$rankings_data" >"$destination_dir"/"$destination_file"
