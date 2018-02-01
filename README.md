# programming_project

## Problem statement

Cryptocurrency is getting more and more popular. However, many people do not know any other crypto coins besides the Bitcoin. With this website, people can get in touch with some other popular crypto coins and their characteristics.

## Solution 

### Idea

The goal of this project, is to help people  get in touch with other coins. Furthermore, this project shows some statistics of the coins itself. For example, the marketcap, prices, volume etc. This in order to inform people about different coins.

### Sketches

![](doc/screenshotLine.jpg)

![](doc/screenshotscatter.jpg)

### Main features

The project consits of a multi linegraph, a scatterplot and a donutchart. 

The scatterplot and donutchart will contain a tooltip. When the user hovers over the two charts, the characteristics of this coin can be viewed. The linegraph however will not contain a tooltip. Because there are so many dates the tooltip would not work properly. For some coins, the data goes back to 2014. That means there are more than 1000 days to visualize and this is the reason that a tooltip would not work properly. Besides that, in my opinion a tooltip is not needed at all at the linegraph. This because the goal of the linegraph is to show the huge increase of volume and price that almost every coin has had in the past year. In my opinion it is not interesting to know the price of a specific date, however it is interesting to see the general trend of those coins. 

Furthermore, there is a dropdown menu in which the user will be able to select the coin they want to view in the linegraph. There is also another dropdown menu present, the user can select the desired axes variables and how many coins they would like to see in the scatterplot and donutchart. 

## Prerequisites

### data sources
data about coins with their characteristics:

https://coinmarketcap.com/
https://www.kaggle.com/sudalairajkumar/cryptocurrencypricehistory/data

In order to use this data, the data must be a little bit transformed with help of python. Therefore, I created a python file which tranforms the data from csv format to json format. D3.js and json format fit well to each other.

### External components

Libraries I used during this assignment:  

Bootstrap V4
Jquery
D3.js V3
D3.queue

### Similar visualization
As far as I know coinmarketcap.com comes close to what I have in mind. This website is easy in use and very clear for beginners. 
The aim is to be as clear as coinmarketcap.com and add a couple of features. Like a drop down menu in order to show the characteristics of the desired coin. There are not many visualizations on this site, so I can not get inspiration for all of my visualizations from this site. 


### Hardest part

For me the hardest past is to find data and transform it into the right form in order to create visualizations. Furthermore, finding new data about cryptocurrencies may be hard while crypto is relatively new for me and many people. 




