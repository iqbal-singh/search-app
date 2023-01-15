# Search App
 








----





## Query Language

#### [Grammar rules](app/lib/query-lang/grammar.peggy) are written in [Peggy.js](https://peggyjs.org/)
- Unquoted or quoted values
``` 
    aaaa
    "aaaa bb you\\"re "
    "aaa bb"
    "asd  r3r3rr3"
```

- Field/Value search
``` 
    field1:value1
    field2=a
    field1 = "aaa aa"
    field555 <= 54
    req.status != 200
    v = " you\\"re    aa"
```

- Operators
``` 
    field1:value1 AND field2:value2
    req.status = 200 OR name:abc
    a AND v = " you\\"re    aa" OR x:123
```

- Complex queries and nested parentheses
``` 
    (field1:value1 AND field2:value2) OR field3:value3
    (req.status < 299 AND name = vaaa) OR uuid = 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed
    (field1 = 1251 AND field2 <= 5135315) OR (field3:value3 AND a OR b) OR c OR AAAA AND (x AND b OR f)
```

