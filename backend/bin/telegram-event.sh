#!/bin/bash

set -euo pipefail

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
ID_FILE="${ROOT}/backend/build/mock-update-id"

if [[ ! -f "${ID_FILE}" ]] ; then
  echo -n "0" > "${ID_FILE}"
fi

ID=$(cat "${ID_FILE}")
echo -n "$(( ID + 1 ))" > "${ID_FILE}"

function register-as-volunteer() {
  DATA='{"update_id": '$ID',"message":{"message_id":0,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"date":'"$(date +%s)"',"chat":{"id":1409,"type":"private"},"text":"/start '"$1"'","entities":[{"type":"bot_command","offset":0,"length":6}]}}'
  send "$DATA"
}


function offer-help() {
  DATA='{"update_id":'$ID',"callback_query":{"id":1,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"data":"aaaa_'"$1"'","message":{"chat":{"id":0,"type":"group"}}}}'
  send "$DATA"
}


function confirm-help() {
  DATA='{"update_id":'$ID',"callback_query":{"id":1,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"data":"aaab_'"$1"'","message":{"chat":{"id":0,"type":"private"}}}}'
  send "$DATA"
}


function withdraw-help() {
  DATA='{"update_id":'$ID',"callback_query":{"id":1,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"data":"aaac_'"$1"'","message":{"chat":{"id":0,"type":"private"}}}}'
  send "$DATA"
}


function upload-receipt() {
  DATA='{"update_id": '$ID',"message":{"message_id":0,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"date":'"$(date +%s)"',"chat":{"id":1409,"type":"private"},"text":"","photo":[{"file_id":"fileid","file_unique_id":"fileuniqueid","width":5,"height":5,"file_size":25}]}}'
  send "$DATA"
}


function confirm-receipt-mapping() {
  DATA='{"update_id":'$ID',"callback_query":{"id":1,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"data":"aaaf_'"$1"'","message":{"chat":{"id":0,"type":"private"}}}}'
  send "$DATA"
}


function complete-purchase() {
  DATA='{"update_id":'$ID',"callback_query":{"id":1,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"data":"aaad_'"$1"'","message":{"chat":{"id":0,"type":"private"}}}}'
  send "$DATA"
}


function money-was-missing() {
  DATA='{"update_id":'$ID',"callback_query":{"id":1,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"data":"aaae_'"$1"'","message":{"chat":{"id":0,"type":"private"}}}}'
  send "$DATA"
}


function send-arbitrary-message() {
  DATA='{"update_id": '$ID',"message":{"message_id":0,"from":{"id":1409,"is_bot":false,"first_name":"Test","last_name":"Volunteer"},"date":'"$(date +%s)"',"chat":{"id":1409,"type":"private"},"text":"'"$1"'"}}'
  send "$DATA"
}


function send() {
  echo -n Sending data
  echo "$DATA" | jq
  curl -v http://localhost:4000/api/v1/telegram/the/next/path/is/a/password/Wz4Bg0pZUybWCbyjjRxpol \
      -H 'Content-Type: application/json' \
      -d "${1}"
}

ACTION="${1:-}"

if type "$ACTION" > /dev/null 2>&1 ; then
  shift
  "$ACTION" "$@"
else
    echo "Action '$ACTION' undefined."
    echo ""
    echo "Usage: $0 <action>"
    echo ""
    echo "Actions:"
    echo "register-as-volunteer <uuid>    Execute /start command after registration, takes volunteer uuid"
    echo "offer-help <uuid>               Press the button below broadcast purchase message, takes purchase uuid"
    echo "confirm-help <uuid>             Really do the purchase (private chat), takes purchase uuid"
    echo "withdraw-help <uuid>            Not do the purchase (private chat), takes purchase uuid"
    echo "upload-receipt                  Upload a receipt"
    echo "confirm-receipt-mapping <uuid>  Map a purchase to the receipt, takes purchase uuid"
    echo "complete-purchase <uuid>        Mark the purchase as done, takes purchase uuid"
    echo "money-was-missing <uuid>        Mark the purchase as money-was-missing, takes purchase uuid"
    echo "send-arbitrary-message <text>   Send a text to the bot"
    exit 1
fi

exit 0
