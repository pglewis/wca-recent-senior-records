#!/bin/bash
mkdir data --parents
curl --fail https://wca-seniors.org/data/Senior_Rankings.js > data/senior-rankings.js
