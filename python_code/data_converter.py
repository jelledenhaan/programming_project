
# Jelle den Haan 11975458
#
# This file reads csv files, copies the data
# and transforms it into json format



import csv 
import json 
import datetime as dt

# input and output file names
file_list = ['litecoin.csv','ripple.csv', 'iota.csv', 'monero.csv', 'neo.csv', 'omisego.csv', 'ethereum.csv', 'dash.csv', 'bitcoin.csv', 'nem.csv']
output_files = ['litecoin.json', 'ripple.json', 'iota.json', 'monero.json', 'neo.json', 'omisego.json', 'ethereum.json', 'dash.json', 'bitcoin.json', 'nem.json']

output_files = ['../src/data_json/' + i for i in output_files]

for i in range(10):
	with open(file_list[i]) as csvfile:
		
		# array to store data
		data_set = []

		lines = csv.reader(csvfile)
		# read data from csv file and append to data_set
		for j, line in enumerate(lines):
			if j == 0:
				continue
			print(line)
			d = dt.datetime.strptime(line[0], "%b %d %Y")
			d = d.date()
			if line[5] == '-' or line[6] == '-':
				line[5] = 0
				line[6] = 0
			else:
				oldstr1 = line[5]
				newstr1 = oldstr1.replace(",", "")
				oldstr2 = line[6]
				newstr2 = oldstr2.replace(",", "")
	
			
			oldstr3 = d.isoformat()
			newstr3 = oldstr3.replace("-", "/")
			
			
			temp = {'date': newstr3, 'high': float(line[2]) , 'low': float(line[3]),'volume': int(newstr1), 'market_cap': int(newstr2)}
			data_set.append(temp)

	json_file = output_files[i]
	data_set = data_set[::-1]
	# copy data into json file 
	with open(json_file, 'w') as outfile:
		json.dump(data_set, outfile)
	
	