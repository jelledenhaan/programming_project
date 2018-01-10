import datetime as dt

d = dt.datetime.strptime("25-01-1973", "%d-%m-%Y")

# Convert datetime object to date object.
d = d.date()

print(d.isoformat())
# 1973-01-25
