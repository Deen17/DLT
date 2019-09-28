import requests
import base64
import json

url = "http://131.247.3.206:8082/topics/transactions"
headers = {
    "Content-Type" : "application/vnd.kafka.binary.v1 + json",
}
# Create one or more messages
payload = {"records":
       [{
           "key":'2',
           "value":'2',
       }],
}
# Send the message
r = requests.post(url, data=json.dumps(payload), headers=headers)
if r.status_code != 200:
   print("Status Code: " + str(r.status_code))
   print(r.text)