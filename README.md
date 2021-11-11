# MyReadingList

An article reading list manager.

## API

Parameters written in **bold text** are required.

Parameters written in *italic text* are optional.

### Login in

POST JSON to `/login`:
- **username** (string)
- **password** (string)

You will receive a JSON on success, as following: `{"success": "ok", "token": "..."}`

Send the token to every other request in a basic `Authorization` header. Be careful that tokens expires after a given amount of time (default is 3600 seconds, one hour).

### Articles

**Note**: all `/articles` routes are protected, they need you to send a valid authorization header.

#### Add an article

POST JSON to `/articles/add`:
- **title** (string)
- **url** (string)
- *tags* (list of strings, can be empty)

Example:
```powershell
(curl "http://localhost:3000/articles/add" -Method POST -H @{"Content-Type"="application/json"; "Authorization"="Basic token..."} -Body '{"title": "hello", "url": "https://google.com", "tags": []}').Content
```

#### Get an article details

GET JSON from `/articles/:id`:
- **id** (integer)

```powershell
(curl "http://localhost:3000/articles/0" -Method GET -H @{"Authorization"="Basic token..."}).Content
```

#### List all

GET JSON from `/articles/list`:
- URL parameter *page* (integer), defaults to 1
- URL parameter *quantity* (integer), defaults to 25

Example:
```powershell
(curl "http://localhost:3000/articles/list?page=1&quantity=14" -Method GET -H @{"Authorization"="Basic token..."}).Content
```

#### Remove article

DELETE `/articles/:id`:
- **id** (integer)

Example:
```powershell
(curl "http://localhost:3000/articles/0" -Method DELETE -H @{"Authorization"="Basic token..."}).Content
```

#### Update article

PATCH JSON to `/articles/:id`:
- **id** (integer)
- *title* (string)
- *tags* (list of strings)
- *read* (bool)
- *url* (string)
- *notes* (string)

Note: unknown attributes are simply ignored

Example:
```powershell
(curl http://localhost:3000/articles/0 -Method PATCH -H @{"Content-Type"="application/json"; "Authorization"="Basic token..."} -Body '{"not_an_attribute": "hello", "read": true}').Content
```

### Tags

**Note**: all `/tags` routes are protected, they need you to send a valid authorization header.

#### Add a tag

POST JSON to `/tags/add`:
- **name** (string)
- **color** (string), must be a valid hexcolor

Example:
```powershell
(curl "http://localhost:3000/tags/add" -Method POST -H @{"Content-Type"="application/json"; "Authorization"="Basic token..."} -Body '{"name": "foo", "color": "012345"}').Content
```

#### Get a tag details

GET JSON from `/tags/:id`:
- **id** (string)

```powershell
(curl "http://localhost:3000/tags/0" -Method GET -H @{"Authorization"="Basic token..."}).Content
```

#### List all

GET JSON from `/tags/list`.

Example:
```powershell
(curl "http://localhost:3000/tags/list" -Method GET -H @{"Authorization"="Basic token..."}).Content
```

#### Remove a tag

DELETE `/tags/:id`:
- **id** (string)

Example:
```powershell
(curl "http://localhost:3000/tags/coffee" -Method DELETE -H @{"Authorization"="Basic token..."}).Content
```

#### Update a tag

PATCH JSON to `/tags/:id`:
- **id** (string), the (old) tag name
- *name* (string), an optional new name (must be unique)
- *color* (string), must be a valid hexcolor

Note: unknown attributes are simply ignored

Example:
```powershell
(curl http://localhost:3000/tags/coffee -Method PATCH -H @{"Content-Type"="application/json"; "Authorization"="Basic token..."} -Body '{"not_an_attribute": "hello", "color": "ff0000"}').Content
```
