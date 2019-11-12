import requests
res = requests.post('http://localhost:5000/users/transact', json={"mytext":"lalala"})
if res.ok:
    print(res.json())
print(res.ok)

print(res)