# TMF620 Product Catalog API

A comprehensive Product Catalog Management API built with the MERN stack, following TMF620 standards from TM Forum.

## Features

- **Product Management**: Full CRUD operations for products
- **Category Management**: Hierarchical category structure with parent-child relationships
- **Product Specifications**: Detailed product specification management
- **Product Offerings**: Product offering lifecycle management
- **Search & Filtering**: Advanced search capabilities across all entities
- **TMF620 Compliance**: Follows TM Forum TMF620 API standards
- **RESTful API**: Clean REST endpoints with proper HTTP methods
- **Data Validation**: Comprehensive input validation and error handling
- **MongoDB Integration**: Scalable NoSQL database with optimized schemas

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Frontend
- **React** - UI library
- **Material-UI** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd apps/backend/TMF620_Product_Catalog_API
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/tmf620_product_catalog
PORT=3001
JWT_SECRET=your_secret_key_here
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd apps/frontend/tmf620-product-catalog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000` and will proxy API requests to `http://localhost:3001`.

## API Endpoints

### Base URL
```
http://localhost:3001/api/v1
```

### Products
- `GET /products` - List products with filtering and pagination
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories
- `GET /categories` - List categories with filtering and pagination
- `GET /categories/:id` - Get category by ID
- `GET /categories/:id/children` - Get child categories
- `POST /categories` - Create new category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Product Specifications
- `GET /productSpecifications` - List product specifications
- `GET /productSpecifications/:id` - Get specification by ID
- `POST /productSpecifications` - Create new specification
- `PATCH /productSpecifications/:id` - Update specification
- `DELETE /productSpecifications/:id` - Delete specification

### Product Offerings
- `GET /productOfferings` - List product offerings
- `GET /productOfferings/:id` - Get offering by ID
- `POST /productOfferings` - Create new offering
- `PATCH /productOfferings/:id` - Update offering
- `DELETE /productOfferings/:id` - Delete offering

### Catalog
- `GET /productCatalog` - Get catalog overview and statistics
- `GET /productCatalog/search` - Global search across all entities

## Query Parameters

### Filtering
All list endpoints support filtering:
- `name` - Filter by name (case-insensitive partial match)
- `lifecycleStatus` - Filter by lifecycle status
- `brand` - Filter by brand (for products and specifications)
- `parentId` - Filter by parent ID (for categories)
- `isSellable` - Filter by sellable status (for offerings)

### Pagination
- `offset` - Number of records to skip (default: 0)
- `limit` - Number of records to return (default: 20, max: 100)

### Field Selection
- `fields` - Comma-separated list of fields to return

### Date Filtering
- `validFor.startDateTime.gte` - Filter by start date (greater than or equal)
- `validFor.startDateTime.lte` - Filter by start date (less than or equal)

## Example Requests

### Create a Product
```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "PROD001",
    "name": "Premium Smartphone",
    "description": "Latest flagship smartphone with advanced features",
    "brand": "TechCorp",
    "lifecycleStatus": "Active",
    "version": "1.0",
    "isCustomerVisible": true
  }'
```

### Get Products with Filtering
```bash
curl "http://localhost:3001/api/v1/products?lifecycleStatus=Active&limit=10&offset=0"
```

### Search Across Catalog
```bash
curl "http://localhost:3001/api/v1/productCatalog/search?q=smartphone&type=product"
```

## Data Models

### Product Schema
Key fields include:
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `brand` - Product brand
- `lifecycleStatus` - Current lifecycle status
- `version` - Product version
- `productNumber` - Product number
- `isBundle` - Bundle indicator
- `isCustomerVisible` - Visibility flag

### Category Schema
Key fields include:
- `id` - Unique identifier
- `name` - Category name
- `description` - Category description
- `parentId` - Parent category ID
- `isRoot` - Root category indicator
- `lifecycleStatus` - Current lifecycle status

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (for deletions)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate IDs)
- `500` - Internal Server Error

Error responses include:
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive data validation
- **Error Sanitization**: Prevents information leakage

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
TMF620_Product_Catalog_API/
├── models/           # Mongoose schemas
├── routes/           # Express route handlers
├── middleware/       # Custom middleware
├── config/           # Configuration files
├── tests/            # Test files
├── server.js         # Main server file
└── package.json      # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please contact the MarketHub development team.
