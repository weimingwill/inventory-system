# Ecommerce Inventory System
This is a SPA (Single page application) as MVP for EC inventory system. Not all functions are well completed and bug-free.

## Project setup
```
git clone git@github.com:weimingwill/inventory-system.git
cd inventory-system\WebContent
npm install
npm run dev

open index.html file

// To login
username: admin/purchasing/inbound
password: weiming
```

## Business Operations
### Products
List of products managed in the inventory system.

### Variants
Each product has several variants, varied by size or color.

### Purchasing

#### Purchasing dashboard
- Data: total purchase units, total cost, avg unit cost
- Charts: demand forecast, incoming stocks
- Recommendations: 
  - to create new purchase based on demand forecast
  - to reorder variants based on demand forecast and low inventory
- To handle adjustment from inbound process: receiving, checking, storing

### Inbound
- Receive: 
  - Partial receive
  - Adjust problems in receiving process
  
- Check: 
  - Partial check
  - Adjust problems in checking process
  - Smart allocation of goods after checking
  
- Store:
  - Warehouse map to locate the storing location

- Adjustment
  - In process of receiving, checking and storing, if any problems such as wrong items or item damaged, users can record it in the system. It will be sent to purchasing crew to further deal with suppliers. 
  
### Warehouse Map
- Check the goods stored in each location of warehouse.

## Major function

### Demand forecast
Use Holt-Winters Forecasting, from [this github](https://github.com/wdamron/Nostradamus.js).
Forecast the demand of variants by type, size and color. Based on demand forecast, recommend purchasing crew the type-size-color variant to purchase/reorder

### Auto allocation
After the quality checker checks the item, it will be suggested to allocate to a location in warehouse automatically. The auto-allocation is based on:
1. Search through the warehouse to find the same variant. If found, store them in the same cell -> layer -> shelf
2. If shelves of same variant is full, search the warehouse for the other variants that belong to the same product.
3. If shelves of same product is full, store new items in a new shelf, which is closest to the shelves storing current variant/product.
