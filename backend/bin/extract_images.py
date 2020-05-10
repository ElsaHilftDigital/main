#!/usr/bin/env python3
import csv
import base64
import sys

# Extact images using
# select uuid, encode(receipt, 'base64') from purchase_supermarket where receipt is not null;


if __name__ == '__main__':
    csv.field_size_limit(sys.maxsize)
    with open('images.csv', newline='') as f:
        reader = csv.reader(f)
        for row in reader:
            filename = row[0]
            image = row[1]
            with open(filename, 'wb') as of:
                of.write(base64.b64decode(image))

