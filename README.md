# MyReadingList

An article reading list manager.

## API

Parameters written in **bold text** are required.
### Articles

#### Add

POST JSON to `/articles/add`:
- **title** (string)
- **url** (string)
- **tags** (list of integers, can be empty)

Example:
```powershell
(curl http://localhost:3000/articles/add -Method POST -H @{"Content-Type"="application/json"} -Body '{"title": "hello", "url": "https://google.com", "tags": []}').Content
```
