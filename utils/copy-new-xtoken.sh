#!/bin/bash
source ~/.bashkitrc || exit 255
source ~/bin/util/rgcurl.rc || exit 255;

opt_env=
opt_interval=60
opt_host=
opt_username=
opt_tenant_id=
opt_property_id=
opt_max_keepalive_failures=3

_usage() {
  local script_name=$(basename $0)
  cat <<__end
usage:
  $script_name -?|--help
  $script_name -e <name> [options]
  $script_name -h <url> -u <name> -t <id> -p <id> [options]
presets:
  -e|--env <name>                 Presets: dev|lab
connection:
  -h|--host <url>                 Example: https://aks-stay-dev.hospitalityrevolution.com
  -u|--username <name>            Example: automation
  -t|--tenant-id <id>             Example: 100
  -p|--property-id <id>           Example: 100
options:
  -i|--interval <seconds>         Default: $opt_interval
     --max-failures <count>       Default: $opt_max_keepalive_failures
__end
}

args=()
while [[ $# -gt 0 ]]; do
  arg="$1"; shift
  case $arg in
    -\?|--help) _usage; exit 0;;
    -e|--env) opt_env=$1; shift;;
    -h|--host) opt_host=$1; shift;;
    -u|--username) opt_username=$1; shift;;
    -t|--tenant-id) opt_tenant_id=$1; shift;;
    -p|--property-id) opt_property_id=$1; shift;;
    -i|--interval) opt_interval=$1; shift;;
    --max-failures) opt_max_keepalive_failures=$1; shift;;
    -*) echo_error "Unknown option: $arg"; _usage; exit 1;;
    *) args+=($arg);;
  esac
done

if [ -z "$opt_host" ] && [ -z "$opt_env" ]; then
  if [ ${#args} -gt 0 ]; then
    opt_env="${args[0]}"
    cwarn "Using positional argument for environment preset ($opt_env), please update to use -e|--env"
  else
    echo "No host specified (see --help)"
    exit 1
  fi
fi

if [ -n "$opt_env" ]; then
  case "$opt_env" in
    dev)
      opt_host=https://aks-stay-dev.hospitalityrevolution.com
      opt_username=automation
      opt_tenant_id=254
      opt_property_id=19558
      ;;
    lab)
      opt_host=https://aks-core-devint.hospitalityrevolution.com
      opt_username=super
      opt_tenant_id=1964
      opt_property_id=25383
      ;;
    *)
      echo "Unknown an environment preset: $opt_env (use lab|dev)"
      exit 1
      ;;
  esac
fi

rghost "$opt_host"
rgauth "$opt_username" "$opt_tenant_id"

update_timestamp() {
  timestamp=$(cbold "$(date +"%D %T")")
}

if [[ $? -eq 0 ]]; then
  if hash pbcopy; then
    echo $RGUEST_XTOKEN | pbcopy
  fi
  echo "x-token: $RGUEST_XTOKEN"
  echo "x-tenant-id: $opt_tenant_id"
  echo "x-property-id: $opt_property_id"
  update_timestamp
else
  echo "Auth failed"
  exit 1
fi

keepalive_failures=0
keepalive() {
# curl "$RGUEST_HOST/auth-service/auth/tenants/${opt_tenant_id}/users/loginInfo" \
  rgget "/user-service/user/tenants/${opt_tenant_id}/users/details" > /tmp/last-keep-alive.json
  if [[ $? -ne 0 ]]; then
    echo "Keep-alive failed, adding +1 to: $keepalive_failures"
    if [ $(( keepalive_failures++ )) -gt $opt_max_keepalive_failures ]; then
      echo "Keep-alive failed $keepalive_failures times, exiting"
      quit 2
    fi
    return 1
  fi
  keepalive_failures=0
  update_timestamp
  return 0
}

echo "Keeping X-Token alive (^C to quit)"
while true; do
  keepalive
  for s in $(seq $opt_interval -1 1); do
    if [ $keepalive_failures -gt 0 ]; then
      echo -n -e "\033[2K\r[Last touched: $timestamp ($keepalive_failures failures)] $s ..."
    else
      echo -n -e "\033[2K\r[Last touched: $timestamp] $s ..."
    fi
    sleep 1
  done
  echo -n -e "\033[2K\r[Last touched: $timestamp] Updating ..."
done
