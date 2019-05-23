/*
Regarding next steps moving this web app into production code.

This app currently has no data permanence, once the page is refreshed all the sales data
is gone. The dashboardValue object needs to be bound and updated in a database so
when it is utilized in the salesWidget callback the values are populated properly.
This includes how the id values are assigned in dashboardValue and widgetValue, instead of
starting at one each time the app is loaded it needs to increment depending on the last
database entry of each sale.

The amount of sales and how they're organized in the dashboard needs to be considered, as 
an unordered list will be come long and cumbersome after many sales are input. I would 
consider a search functionality and adding more data to each sale rather than only numbers,
such as other values that can be used for data visualization in the future.

Form validation, right now any value can be added to the sales input box. Since the SetColor() method
in the Widget class parses user input into an integer this will inevitably cause errors and unwanted data
as the app scales.

The source of the app is exposed in the browser inspector, if databases or other sensitive data is added
this will be a concern.

Removing all unneeded console.logs()

Updating CSS to be more user friendly
*/

window.onload = function(){
    new Dashboard();
};

class Dashboard {

  constructor() {
        this.dashboardValue = {
            id : 1,
            value : 0,
            style : ""
        }

        this.salesElement = document.getElementById("dashbaordSales");
        this.salesListElement = document.getElementById("salesList");

        this.salesWidget = new Widget((salesValue) => {
            if (this.dashboardValue.id !== salesValue.id) {  // Make sure they aren't adding a value which has already been added to support future updating.
                console.log("sales updated!");
                // Saved dashBoard object key, value seperately to avoid making a reference to salesValue when changed in AddSales() 
                this.dashboardValue.id = salesValue.id;
                this.dashboardValue.value = salesValue.value;
                this.dashboardValue.style = salesValue.style; // uses new style value in salesValue object

                this.salesElement.innerHTML = this.dashboardValue.value;
                this.salesElement.style.color = this.dashboardValue.style 

                this.saleListItem = document.createElement("li");
                this.saleListItem.style.color = this.dashboardValue.style
                this.saleListItem.appendChild(document.createTextNode(this.dashboardValue.value))
                this.salesListElement.appendChild(this.saleListItem)
            }
        });
    }
}

class Widget {
    
    constructor(callback){
        this.callback = callback;
        this.displayElement = document.getElementById("widgetValue");
        this.widgetValue = {
            id : 1,
            value : 0 ,
            style : ""
        }
        
        this.input = document.getElementById("widgetText");
        this.button = document.getElementById("widgetButton");
        this.button.addEventListener("click", () => { // Used an arrow function to keep the 'this' keyword defined within the constructor and not the "click" callback function
            this.AddSales(this.input.value);
        });
    }

    AddSales(value)
    {
        this.widgetValue.id += 1;
        this.widgetValue.value = value;
        this.widgetValue.style = this.SetColor(value)

        this.displayElement.innerHTML = this.widgetValue.value;    
        this.displayElement.style.color = this.SetColor(value)

        this.callback.call(this, this.widgetValue); // Used call() on the Widget callback to include the widgetValue parameter
    }

    SetColor(sale){
        // Made a simple check to set style based on the number value then carried this value through the widgetvalue object by creating a 'style' key
        if (parseInt(sale) < 0)
            return 'red'
        return 'black'
    }
}