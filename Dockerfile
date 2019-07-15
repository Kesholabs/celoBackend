
FROM frolvlad/alpine-python3
MAINTAINER Tenda "@tenda"

COPY url.py /

RUN pip3 install requests

CMD python ./url.py 