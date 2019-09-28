follow this until you finish step 1: download and start confluent platform using docker

run:
    docker-compose exec broker kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic <NAME OF TOPIC YOU WANT TO CREATE I DID transactions>

run 
    python consume.py

    python produce.py