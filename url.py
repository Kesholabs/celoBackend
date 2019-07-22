#!/usr/bin/python
import sys
import ast
import requests
import os
import base64
import json
import datetime
import threading
from requests.auth import HTTPBasicAuth

arg = [os.environ['ARG0'], os.environ['ARG1']]
def AuthToken():
 consumer_key = "pwhF6qP4EG3KAqisthlJcrdBQFLKr4FM"
 consumer_secret = "dS90sUTgKWrq30Qz"
 api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
 r = requests.get(api_URL, auth=HTTPBasicAuth(consumer_key, consumer_secret))
 re = r.json()
 a_token = re['access_token']
 return a_token



def stkPush(token):
    access_token = token
    print (token)
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    headers = { "Authorization": "Bearer %s" % access_token }
    DT = datetime.datetime.now() 
    timestamp = str(DT.year) +str('{0:0=2d}'.format(DT.month))+ str('{0:0=2d}'.format(DT.day))+str('{0:0=2d}'.format(DT.hour))+str('{0:0=2d}'.format(DT.minute))+str('{0:0=2d}'.format(DT.second))
    data = str(174379)+"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"+timestamp
    encodedBytes = base64.b64encode(data.encode("utf-8"))
    encodedStr = str(encodedBytes, "utf-8")
    print("time is: %s" % timestamp)
    bsc = "174379"
    request = {
    "BusinessShortCode": bsc, 
    "Password": encodedStr, 
    "Timestamp": timestamp, 
    "TransactionType": "CustomerPayBillOnline", 
    "Amount": arg[1], 
    "PartyA": arg[0], 
    "PartyB": bsc, 
    "PhoneNumber": arg[0], 
    "CallBackURL": "https://sandbox.safaricom.co.ke/",
    "AccountReference": "ref", 
    "TransactionDesc": "please work" 
    }
  
    response = requests.post(api_url, json = request, headers=headers)
    con = response.json()
    print(con)
    
    if "errorCode" in con:
        print(con)   
    else:
        check = con['CheckoutRequestID']
        timer = threading.Timer(120.0, Query,[AuthToken(),bsc,encodedStr,timestamp,check]) 
        timer.start()



# optimize memory management

def Query(token,shortcode,password,timestamp,checkout):
    print (checkout)
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
    headers = {"Authorization": "Bearer %s" % token}
    request = { "BusinessShortCode":shortcode,
        "Password":password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout
    }
    response = requests.post(api_url, json = request, headers=headers)
    res1 = response.json()["ResultCode"]
    # res2 = res1["ResultCode"]

    print (res1)


stkPush(AuthToken())