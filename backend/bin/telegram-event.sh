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


function send() {
  echo -n Sending data
  echo "$DATA" | jq
  curl -v http://localhost:4000/api/v1/telegram/the/next/path/is/a/password/Wz4Bg0pZUybWCbyjjRxpol \
      -H 'Content-Type: application/json' \
      -XPOST \
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
    echo "register-as-volunteer <uuid>    Execute /start command after registration"
    exit 1
fi

exit 0
