#temporary file to generate more data for ML learning, to make URL parsing code in JS Later

import re as regex
import pandas as pd
import numpy as np

file = pd.read_csv("Training_ML_models/Datasets/Phishing_Email.csv")

for column in file:
    print(column)

#for checking phishing
phishingLinks = {}
phishingText = {}
count = 0
for row in file["Email Text"]:
    if row != "empty":   
        if file["Email Type"][count] != "Safe Email":
            phishingText.__setitem__(str(count), row)
    count += 1

print(len(phishingText))


for index in phishingText:
    rowLinks = regex.findall(r'(http?://\S+)', str(phishingText[index]))
    phishingLinks.__setitem__(index, rowLinks)

print(len(phishingLinks))

#for checking all
allLinks = []
allText = {}
emptyIndex = []
count = 0
for row in file["Email Text"]:
    if row != "empty":
        allText.__setitem__(str(count), row)
    else:
        emptyIndex.append(count)
    count += 1

print(len(allText))

for index in allText:
    rowLinks = regex.findall(r'(http?://\S+)', str(allText[index]))
    allLinks.append(rowLinks)

print(len(allLinks))

file.drop(emptyIndex, inplace=True)
file.rename(columns={"Unnamed: 0": "Email Index"}, inplace=True)
print(len(file))

file["Links"] = allLinks
print(file.head(10))

#file.to_csv("Training_ML_models/Datasets/Phishing_CSV_W_Links.csv")