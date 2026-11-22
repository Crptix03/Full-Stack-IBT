# Addis Eats API — Endpoint Design Document

Base URL: `/api/v1`

| Method | Path | Purpose | Success Status | Likely Failure Status |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new customer, restaurant owner, or courier account | `201 Created` | `400 Bad Request` / `409 Conflict` |
| `POST` | `/api/v1/auth/sessions` | Authenticate user credentials and issue an access token | `201 Created` | `401 Unauthorized` |
| `GET` | `/api/v1/restaurants` | Retrieve a paginated list of restaurants (supports `?cuisine=` and `?city=` filters) | `200 OK` | `400 Bad Request` |
| `POST` | `/api/v1/restaurants` | Create a new restaurant listing | `201 Created` | `400 Bad Request` / `403 Forbidden` |
| `GET` | `/api/v1/restaurants/{restaurantId}` | Retrieve detailed information for a specific restaurant | `200 OK` | `404 Not Found` |
| `PATCH` | `/api/v1/restaurants/{restaurantId}` | Update partial details (hours, address, status) of a restaurant | `200 OK` | `403 Forbidden` / `404 Not Found` |
| `GET` | `/api/v1/restaurants/{restaurantId}/menus` | Retrieve all menus and menu items for a specific restaurant (supports `?category=`) | `200 OK` | `404 Not Found` |
| `POST` | `/api/v1/restaurants/{restaurantId}/menus` | Add a new menu or menu item to a restaurant | `201 Created` | `400 Bad Request` / `403 Forbidden` |
| `PATCH` | `/api/v1/restaurants/{restaurantId}/menus/{menuId}` | Update price, availability, or description of a menu item | `200 OK` | `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/v1/restaurants/{restaurantId}/menus/{menuId}` | Remove a menu item from a restaurant | `204 No Content` | `403 Forbidden` / `404 Not Found` |
| `POST` | `/api/v1/orders` | Place a new food order from a restaurant | `201 Created` | `400 Bad Request` / `422 Unprocessable Entity` |
| `GET` | `/api/v1/orders` | List orders for the authenticated user (supports `?status=` filter) | `200 OK` | `401 Unauthorized` |
| `GET` | `/api/v1/orders/{orderId}` | Retrieve the items, total, and live delivery status of a specific order | `200 OK` | `403 Forbidden` / `404 Not Found` |
| `PATCH` | `/api/v1/orders/{orderId}` | Update order status (e.g., confirmed, preparing, out for delivery, cancelled) | `200 OK` | `400 Bad Request` / `409 Conflict` |
| `POST` | `/api/v1/orders/{orderId}/payments` | Initiate payment processing for a specific order | `201 Created` | `402 Payment Required` / `409 Conflict` |
| `GET` | `/api/v1/orders/{orderId}/payments/{paymentId}` | Retrieve receipt and verification status of a payment | `200 OK` | `404 Not Found` |