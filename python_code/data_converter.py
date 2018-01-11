import csv 
import json 
import datetime as dt

file_list = ['litecoin.csv','ripple.csv', 'iota.csv', 'monero.csv', 'neo.csv', 'omisego.csv', 'ethereum.csv', 'dash.csv', 'bitcoin.csv', 'nem.csv']
output_files = ['litecoin.json', 'ripple.json', 'iota.json', 'monero.json', 'neo.json', 'omisego.json', 'ethereum.json', 'dash.json', 'bitcoin.json', 'nem.json']

for i in range(10):
	with open(file_list[i]) as csvfile:

		data_set =[]

		lines = csv.reader(csvfile)
		next(lines)
		for line in lines:
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
				
			
			temp = {'date': d.isoformat(), 'high': float(line[2]) , 'low': float(line[3]),'volume': int(newstr1), 'market_cap': int(newstr2)}
			data_set.append(temp)

	json_file = output_files[i]
	# copy data into json file which is called output1.json
	with open(json_file, 'w') as outfile:
		json.dump(data_set, outfile)
	
		

	#print(date_object)
	#print("hallo")






# Convert datetime object to date object.
