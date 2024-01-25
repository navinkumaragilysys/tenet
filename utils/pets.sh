#!/bin/bash

export COMPOSE_PROJECT_NAME="pets"
opt_names=

function usage () {
  name=$(basename $0)
  cat <<__end
usage:
  $name -h|--help
  $name [options] action...
options:
  --itest       just services needed for stay ITESTs
  --names       specific service names (multiple names in quotes like "mongo redis")
actions:
  start         docker compose start
  stop          docker compose stop
  repave        stop, clean, start, provision
  restart       stop, start
  provision     create users, vhosts, db, ...
  clean         remove docker images and volumes
  dangling      show dangling volumes
__end
}

function _stop () {
  docker compose stop $opt_names
}

function _dangling () {
  local dangling_volumes="$(docker volume ls -q -f dangling=true -f label=com.docker.compose.project=$COMPOSE_PROJECT_NAME)"
  if [[ -n "$dangling_volumes" ]]; then
    echo "$dangling_volumes"
  else
    echo "No dangling volumes"
  fi
}

function _clean () {
  docker compose rm -f $opt_names
  local dangling_volumes="$(docker volume ls -q -f dangling=true -f label=com.docker.compose.project=$COMPOSE_PROJECT_NAME)"
  if [[ -n "$dangling_volumes" ]]; then
    echo "$dangling_volumes" | tr '\n' '\0' | xargs -0 -n1 docker volume rm
  else
    echo "No dangling volumes"
  fi
}

function _start () {
  echo "EXTERNAL_AND_INTERNAL_HOSTNAME=$(_determine_external_and_internal_hostname)" > .env
  docker compose up -d $opt_names
}

_is_service_included() {
  [ -z "$opt_names" ] && return 0
  [[ "$opt_names" = *"$1"* ]] && return 0
  return 1
}

function _provision () {
  _is_service_included "mongo" && _provision_mongo
  _is_service_included "postgres" && _provision_postgres
  _is_service_included "rabbitmq" && _provision_rmq
}

function _wait () {
  _is_service_included "elasticsearch" && _elasticsearch_check
# _is_service_included "influxdb" && _influxdb_check -- optional
  _is_service_included "kafka" && _kafka_check
# _is_service_included "kibana" && _kibana_check -- optional
  _is_service_included "mongo" && _mongo_check
#  _is_service_included "postgres" && _postgres_check
  _is_service_included "rabbitmq" && _rmq_check
  _is_service_included "redis" && _redis_check
}

function _elasticsearch_check () {

  until [ "$(curl -s GET 'http://localhost:9200/_cluster/health' | jq -r '.status')" == "green" ]; do
    echo "[$(date -Iseconds)] ElasticSearch not ready, waiting 1s"
    sleep 1
  done
}

function _influxdb_check () {

  until [ "$(curl -s -o /dev/null -w '%{http_code}' 'http://localhost:8086/ping')" == "204" ]; do
    echo "[$(date -Iseconds)] InfluxDB not ready, waiting 1s"
    sleep 1
  done
}

function _kafka_check() {

  until [ "$(docker exec pets-kafka-1 kafka-topics --bootstrap-server localhost:9092 --version)" == "7.2.2-ccs (Commit:b1f098d4b86fb0e9bc6cc86da16ad16e8cd26ebd)" ]; do
    echo "[$(date -Iseconds)] Kafka not ready, waiting 1s"
    sleep 1
  done
}

function _mongo_check () {

  local command_args

  command_args=$( cat <<EOF
mongo <<END &>/dev/null
rs.status();
END
EOF
)
  until docker compose exec -T mongo bash -c "$command_args"; do
    echo "[$(date -Iseconds)] Mongo not ready, waiting 1s"
    sleep 1
  done
}

function _redis_check () {

  local command_args
  command_args=$( cat <<EOF
redis-cli <<END &>/dev/null
PING
END
EOF
)
  until docker compose exec -T redis bash -c "$command_args"; do
    echo "[$(date -Iseconds)] Redis not ready, waiting 1s"
    sleep 1
  done
}

function _provision_mongo () {
  local hostname_external_and_internal
  hostname_external_and_internal=$(_determine_external_and_internal_hostname)
  echo "replicaset host: $hostname_external_and_internal"

  _mongo_check

  docker compose exec -T mongo bash <<EOF
mongo <<END
var config = {
  "_id": "rs0",
  "version": 1,
  "members": [
    {
      "_id": 1,
      "host": "$hostname_external_and_internal:27017",
      "priority": 1
    }
  ]
};
try {
  rs.conf();
  print("replicaset has already been initialized: reconfiguring...");
  rs.reconfig(config, { force: true });
} catch (e) {
  print("replicaset has not been initialized: initializing...");
  rs.initiate(config, { force: true });
}
rs.conf();
END
EOF
}

function _rmq_check (){
  until [ "$(curl -s -o /dev/null -w '%{http_code}' http://guest:guest@localhost:15672/api/aliveness-test/%2F)" == "200" ]; do
    echo "[$(date -Iseconds)] RMQ not ready, waiting 1s"
    sleep 1
  done

}

function _provision_rmq () {
  local username='testServices'
  local password='Agile1'
  local vhost='testCloud'
  local vhost_testpool='testCloudTest'
  local container_name="${COMPOSE_PROJECT_NAME}-rabbitmq-1"
  local rabbitmqctl_cmd=/opt/rabbitmq/sbin/rabbitmqctl



  # Users
  docker exec $container_name $rabbitmqctl_cmd add_user ${username} ${password}
  docker exec $container_name $rabbitmqctl_cmd add_user applianceSocketClient ${password}
  docker exec $container_name $rabbitmqctl_cmd set_user_tags ${username} administrator

  # Cloud services vhost
  docker exec $container_name $rabbitmqctl_cmd add_vhost "${vhost}"
  docker exec $container_name $rabbitmqctl_cmd set_permissions -p ${vhost} ${username} ".*" ".*" ".*"

  # Cloud services vhost (when in test pool)
  docker exec $container_name $rabbitmqctl_cmd add_vhost ${vhost_testpool}
  docker exec $container_name $rabbitmqctl_cmd set_permissions -p ${vhost_testpool} ${username} ".*" ".*" ".*"

  # Appliance vhost
  docker exec $container_name $rabbitmqctl_cmd add_vhost appliance
  docker exec $container_name $rabbitmqctl_cmd set_permissions -p appliance applianceSocketClient ".*" ".*" ".*"
}

function _postgres_check () {
  local command_to_run='psql host=localhost port=5432 dbname=postgres user=postgres password=' <<END
SELECT version();
END

  until [ "$($command_to_run)" == "200" ]; do
    echo "[$(date -Iseconds)] Postgres not ready, waiting 1s"
    sleep 1
  done

}

function _provision_postgres {
  local psql_connect_dba='host=localhost port=5432 dbname=postgres user=postgres password='
  local warehouse_database='k3d_localhost'
  local pg_username='postgres'

  psql "$psql_connect_dba" <<END
create database ${warehouse_database};
grant all privileges on database ${warehouse_database} to "${pg_username}";
revoke all on database ${warehouse_database} from PUBLIC;
revoke all on schema public from PUBLIC;
revoke all on all tables in schema public FROM PUBLIC;
END
}

function _status () {
  docker compose ps $opt_names
}

function _determine_external_and_internal_hostname () {
    local domain_name="$(hostname -d)"
    local hostname_external_and_internal="localhost"
    if [[ "$domain_name" == *cloudapp.net ]] && [[ "$CI" != true ]]; then
      hostname_external_and_internal="$(hostname -s).westus.cloudapp.azure.com"
    fi
    echo "$hostname_external_and_internal"
}

if [[ $# -eq 0 ]]; then
  usage
  exit 1
fi

actions=()
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)  usage; exit 0;;
    --names)    shift; opt_names="$1";;
    --itest)    opt_names="mongo rabbitmq postgres elasticsearch";;
    -*)         echo "Unknown option: $1"; usage; exit 1;;
    *)          actions+=($1);;
  esac
  shift
done

for action in "${actions[@]}"; do
  case $action in
    stop)       _stop;;
    start)      _start;;
    restart)    _stop; _start;;
    repave)     _stop; _clean; _start; _wait; _provision;;
    provision)  _wait; _provision;;
    wait)       _wait;;
    status)     _status;;
    clean)      _clean;;
    dangling)   _dangling;;
    *)          echo "Unknown action: $action"; usage; exit 1;;
  esac
done
