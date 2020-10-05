# How to run the code

To build and run the code locally,

     npm i
     npm run loc

If you'd like to run it in docker,

     ./start.sh

Once the project is running, open up  http://localhost:8080 in your browser.


# **How I solved the problem**

1. First, I needed to generate a dataset of similar scale to the problem presented.
I searched google and found this dataset of 2 indian restaurants' takeout orders
https://www.kaggle.com/henslersoftware/19560-indian-takeaway-orders.

    I cleaned this dataset, changing dates to all be within a 48 hour period and adding
a few extra items to create enough diversity for the need of infinite scrolling.

    I then imported this data into a mongoDB instance in one of my EC2 servers.

    (The DB dump is present in this directory as dbDump.zip, should you need it)

2. I then created a new full stack app using [my own boilerplate setup](https://github.com/bbatra/ServerSideNodeReact):
3. I created the schema for OrderItems and built a backend service that would return the data required (services > OrderItems.js).

    To generate the trending results, I created a mongoDB pipeline which did the following:

    i.   Select items sold within the last 48 hours

    ii.  Group items to return a list of items sold with total quantity sold and most recent order

    iii. Create a "score" for each item, based on both its most recent sale and total quantity ordered.
    The formula for this score is as follows:

        (Total Quantity sold / milliseconds since last order)

    iv.  Sort the list by the score, and the item name to break ties when sorting

    v.   Limit the results to allow for pagination using $limit and $skip

4. Finally, I made a very basic React front end, which rendered the list of order items in an infinite scroll manner.

   For this task, I used the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)