# MyReadingList

An article reading list manager.

## API

Parameters written in **bold text** are required.

Parameters written in *italic text* are optional.
### Articles

#### Add

POST JSON to `/articles/add`:
- **title** (string)
- **url** (string)
- **tags** (list of strings, can be empty)

Example:
```powershell
(curl "http://localhost:3000/articles/add" -Method POST -H @{"Content-Type"="application/json"} -Body '{"title": "hello", "url": "https://google.com", "tags": []}').Content
```

#### List all

GET JSON from `/articles/list`:
- URL parameter *page* (integer), defaults to 1
- URL parameter *quantity* (integer), defaults to 25

Example:
```powershell
(curl "http://localhost:3000/articles/list?page=1&quantity=14" -Method GET).Content
```
