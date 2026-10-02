# Cache Handling Workshop

A small Express API for managing products, with a file-backed data store and in-memory caching for GET requests.

## Requirements

- Node.js and npm

## Run locally

```sh
npm install
npm run server
```

The server listens at `http://localhost:3000`. Product endpoints are mounted under `/products`.

## API

| Method   | Path            | Description           |
| -------- | --------------- | --------------------- |
| `GET`    | `/products`     | Get all products      |
| `GET`    | `/products/:id` | Get one product by ID |
| `POST`   | `/products`     | Create a product      |
| `PUT`    | `/products/:id` | Update a product      |
| `PATCH`  | `/products/:id` | Update a product      |
| `DELETE` | `/products/:id` | Delete a product      |

Products have an `id`, `name`, and `price`. IDs are assigned by the server. Creating a product requires a non-empty `name` and a numeric `price` greater than or equal to zero. Updates require at least one field; if provided, `name` must be non-empty and `price` must be nonnegative. Both update methods merge the supplied fields into the existing product.

### Examples

Get all products:

```sh
curl -i http://localhost:3000/products
```

Get one product:

```sh
curl -i http://localhost:3000/products/1
```

Create a product:

```sh
curl -i -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Headphones","price":79.99}'
```

Update a product:

```sh
curl -i -X PATCH http://localhost:3000/products/1 \
  -H 'Content-Type: application/json' \
  -d '{"price":54.99}'
```

Delete a product:

```sh
curl -i -X DELETE http://localhost:3000/products/1
```

## Caching behavior

- GET requests for both the product list and an individual product are cached in memory.
- The cache key is the full request URL, including its query string. For example, `/products?page=1` and `/products?page=2` occupy different cache entries.
- A cached response is returned with `X-Cache: HIT`. A cache miss returns `X-Cache: MISS` and waits one second before continuing to the handler.
- Entries expire after 60 seconds.
- Successful create, update, and delete operations clear all cached GET responses.

Query parameters currently affect only the cache key; they are not used to filter, sort, or paginate products. For example, `/products?page=1` currently returns the same list as `/products`. Different parameter orders can also produce separate cache entries even if they represent equivalent parameters.

## Data storage

Product data is stored in `database/products.json`. Changes are written to that file, so the data persists across server restarts.
