# Docker Compose Utilities

execute the sccript with the following command:

```bash
:~/utils/pets$ bash pets.sh

usage:
  pets.sh -h|--help
  pets.sh [options] action...
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

```

Sure, here's a detailed breakdown of the script `pets.sh`:

1. `#!/bin/bash`: This is called a shebang. It tells the system that this script should be executed using the Bash shell.

2. `export COMPOSE_PROJECT_NAME="pets"`: This line sets an environment variable `COMPOSE_PROJECT_NAME` to "pets". Docker Compose uses this variable as the project name.

3. `opt_names=`: This line initializes an empty variable `opt_names`. It's used later to store optional service names.

4. `function usage () {...}`: This function prints the usage instructions for the script when it's called.

5. `function _stop () {...}`: This function stops the Docker Compose services specified by `opt_names`.

6. `function _dangling () {...}`: This function lists the dangling volumes (volumes not used by any containers) associated with the Docker Compose project.

7. `function _clean () {...}`: This function removes the Docker Compose services specified by `opt_names` and also removes any dangling volumes associated with the Docker Compose project.

8. `function _start () {...}`: This function starts the Docker Compose services specified by `opt_names`. It also sets an environment variable `EXTERNAL_AND_INTERNAL_HOSTNAME` to the output of the `_determine_external_and_internal_hostname` function.

9. `_is_service_included() {...}`: This function checks if a given service is included in `opt_names`. It returns 0 (true) if `opt_names` is empty or contains the given service, and 1 (false) otherwise.

10. `function _provision () {...}`: This function provisions the services specified by `opt_names`. It calls the `_provision_mongo`, `_provision_postgres`, and `_provision_rmq` functions if "mongo", "postgres", and "rabbitmq" are included in `opt_names`, respectively.

11. `function _wait () {...}`: This function waits for the services specified by `opt_names` to be ready. It calls the `_elasticsearch_check`, `_influxdb_check`, `_kafka_check`, `_mongo_check`, `_postgres_check`, `_rmq_check`, and `_redis_check` functions if "elasticsearch", "influxdb", "kafka", "mongo", "postgres", "rabbitmq", and "redis" are included in `opt_names`, respectively.

12. `function _elasticsearch_check () {...}`: This function waits until Elasticsearch is ready.

13. `function _influxdb_check () {...}`: This function waits until InfluxDB is ready.

14. `function _kafka_check() {...}`: This function waits until Kafka is ready.

15. `function _mongo_check () {...}`: This function waits until Mongo is ready.

16. `function _redis_check () {...}`: This function waits until Redis is ready.

17. `function _provision_mongo () {...}`: This function provisions Mongo.

18. `function _rmq_check (){...}`: This function waits until RabbitMQ is ready.

19. `function _provision_rmq () {...}`: This function provisions RabbitMQ.

20. `function _postgres_check () {...}`: This function waits until Postgres is ready.

21. `function _provision_postgres {...}`: This function provisions Postgres.

22. `function _status () {...}`: This function shows the status of the Docker Compose services specified by `opt_names`.

23. `function _determine_external_and_internal_hostname () {...}`: This function determines the external and internal hostname.

24. `if [[ $# -eq 0 ]]; then...`: This block checks if any arguments were passed to the script. If not, it prints the usage instructions and exits.

25. `while [[ $# -gt 0 ]]; do...`: This block processes the script arguments. It supports the `-h|--help`, `--names`, `--itest`, and action arguments.

26. `for action in "${actions[@]}"; do...`: This block performs the actions specified by the script arguments. It supports the "stop", "start", "restart", "repave", "provision", "wait", "status", "clean", and "dangling" actions.

The script is designed to manage Docker Compose services and volumes. It provides a command-line interface to start, stop, clean, and list services and volumes. The services to be managed can be specified by the `--names` option.