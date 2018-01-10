import csv 
import json 
import datetime as dt

file_list = ['litecoingoed.csv']
output_files = ['litecoin.json']

with open(file_list[0]) as csvfile:

	data_set =[]

	lines = csv.reader(csvfile)
	next(lines)
	for line in lines:
		# d = dt.datetime.strptime(line[0], "%b %d %Y")
		# d = d.date()
		# print(d.isoformat())
		print(line[6])
		exit()
		temp = {'date': d.isoformat(), 'high': line[2] , 'low': line[3], 'volume': line[5], 'market_cap': line[6]}
		data_set.append(temp)

print(data_set)		
		

		#print(date_object)
		#print("hallo")






# Convert datetime object to date object.
