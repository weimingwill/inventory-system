# Ecommerce Inventory System

## Project setup
```
git clone git@github.com:weimingwill/inventory-system.git
cd inventory-system\WebContent
npm install
npm run dev

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
